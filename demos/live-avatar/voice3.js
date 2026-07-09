/**
 * voice3.js — a ground-up, self-contained live avatar element.
 *
 * Drop one tag on a page and you get a HeyGen/LiveAvatar streaming avatar that
 * you can see, hear, talk to, and interrupt. The avatar does its own speech-to-text,
 * reasoning, and text-to-speech server-side; this element's whole job is:
 *
 *     create a session  →  join the LiveKit room  →  show the video  →  pipe the mic
 *
 * Usage:
 *     <script type="module" src="./voice3.js"></script>
 *     <live-avatar
 *         session-endpoint="/api/liveavatar/session"
 *         avatar-id="65f9e3c9-d48b-4118-b73a-4ae2e3cbb8f0"
 *         voice-id="b2bd6569-a537-4342-aeca-a1f15d2a2c97"
 *         context-id="65315879-21e9-4a64-ad86-dc810091ef65">
 *     </live-avatar>
 *
 * It knows nothing about tours or any host app. Everything a host might want to
 * react to is surfaced as a DOM event (see EVENTS below), so integrations stay
 * decoupled and additive.
 *
 * EVENTS (all bubble + composed):
 *   'statechange'  detail: { state }                     lifecycle: idle|connecting|live|listening|speaking|error|stopped
 *   'transcript'   detail: { speaker, text }             speaker: 'user' | 'avatar'
 *   'action'       detail: { type, raw }                 reserved seam for structured avatar intents (e.g. launch a tour)
 *   'error'        detail: { error }
 */

import * as LiveKit from 'https://cdn.jsdelivr.net/npm/livekit-client@2.17.2/+esm';

const STYLE = `
    :host {
        display: block;
        inline-size: 100%;
        block-size: 100%;
        --la-radius: 12px;
        --la-accent: #4f8cff;
    }
    .stage {
        position: relative;
        inline-size: 100%;
        block-size: 100%;
        min-block-size: 220px;
        border-radius: var(--la-radius);
        overflow: hidden;
        background: radial-gradient(circle at 50% 0%, #1b2452, #05060f);
        display: grid;
        place-items: center;
    }
    video {
        position: absolute;
        inset: 0;
        inline-size: 100%;
        block-size: 100%;
        object-fit: cover;
        background: transparent;
    }
    audio { display: none; }
    .overlay {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        gap: 14px;
        color: #cdd6f4;
        font: 500 15px/1.4 "Open Sans", system-ui, sans-serif;
        text-align: center;
        padding: 20px;
        background: rgb(5 6 15 / 55%);
        backdrop-filter: blur(2px);
    }
    .overlay[hidden] { display: none; }
    button {
        font: inherit;
        color: #fff;
        background: var(--la-accent);
        border: 0;
        border-radius: 999px;
        padding: 10px 22px;
        cursor: pointer;
        box-shadow: 0 6px 20px rgb(79 140 255 / 35%);
    }
    button:hover { filter: brightness(1.08); }
    .pill {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 2;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        font: 600 11px/1 "Open Sans", system-ui, sans-serif;
        letter-spacing: .04em;
        text-transform: uppercase;
        color: #cdd6f4;
        background: rgb(5 6 15 / 60%);
        border: 1px solid rgb(205 214 244 / 14%);
        border-radius: 999px;
        padding: 6px 10px;
    }
    .pill[hidden] { display: none; }
    .dot {
        inline-size: 8px;
        block-size: 8px;
        border-radius: 50%;
        background: #6b7280;
        transition: background .2s;
    }
    :host([data-state="live"]) .dot,
    :host([data-state="listening"]) .dot { background: #22c55e; }
    :host([data-state="speaking"]) .dot { background: var(--la-accent); }
    :host([data-state="connecting"]) .dot { background: #eab308; }
    :host([data-state="error"]) .dot { background: #ef4444; }
    .stop {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 2;
        inline-size: 32px;
        block-size: 32px;
        padding: 0;
        border-radius: 50%;
        background: rgb(211 65 58 / 92%);
        box-shadow: none;
        display: none;
    }
    :host([data-active]) .stop { display: grid; place-items: center; }
`;

const DEFAULT_ENDPOINT = '/api/liveavatar/session';

class LiveAvatarElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.room = null;
        this.state = 'idle';
        this._decoder = new TextDecoder();
        this._starting = false;
        this._history = []; // rolling conversation transcript, carried across reconnects
        this._heartbeat = null; // keep-alive interval handle
        this._audioTrack = null; // exactly one audio track attached at a time (avoids echo)
        this._videoTrack = null;
        this._audioParticipant = '';
        this._render();
    }

    connectedCallback() {
        if (this.hasAttribute('auto-start')) {
            // Autoplay + mic need a user gesture, so auto-start shows the tap-to-start
            // overlay rather than forcing a connection that the browser would block.
            this._setState('idle');
        }
    }

    disconnectedCallback() {
        this.stop();
    }

    // ---- public API ---------------------------------------------------------

    /** Create a session, join the room, show the avatar, and open the mic. */
    async start() {
        if (this.room || this._starting) return;
        this._starting = true;
        this._history = []; // fresh conversation on a user-initiated start
        this._setState('connecting');
        try {
            const session = await this._createSession();
            this._sessionId = session.sessionId || null;
            await this._connect(session);
            this._setState('live');
        } catch (error) {
            this._setState('error');
            this._emit('error', { error });
            console.error('[live-avatar] start failed', error);
            this._showOverlay('Could not start the avatar. Tap to retry.', 'Retry');
        } finally {
            this._starting = false;
        }
    }

    /** Leave the room and reset. */
    async stop() {
        if (this._recoverTimer) {
            clearTimeout(this._recoverTimer);
            this._recoverTimer = null;
        }
        this._stopHeartbeat();
        const room = this.room;
        this.room = null;
        if (room) {
            try { await room.localParticipant?.setMicrophoneEnabled?.(false); } catch {}
            try { room.disconnect?.(); } catch {}
        }
        // End the LiveAvatar session server-side too — disconnecting the room alone
        // leaves it "active" and it keeps holding a (sandbox: single) concurrency slot.
        this._endSession(this._sessionId);
        this._sessionId = null;
        this._detachMedia();
        this.removeAttribute('data-active');
        this._setState('stopped');
        this._showOverlay('', 'Start voice chat');
    }

    /**
     * Ping keep-alive on an interval so the avatar isn't dropped for inactivity. This
     * attacks the drop at its source; the reconnect recovery is the safety net for when
     * a drop still slips through.
     */
    _startHeartbeat() {
        this._stopHeartbeat();
        const c = this._config;
        this._heartbeat = setInterval(() => {
            if (!this._sessionId) return;
            try {
                fetch(`${c.endpoint}/keep-alive`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId: this._sessionId, apiKey: c.apiKey || undefined })
                }).catch(() => {});
            } catch {}
        }, 20000);
    }

    _stopHeartbeat() {
        if (this._heartbeat) {
            clearInterval(this._heartbeat);
            this._heartbeat = null;
        }
    }

    /**
     * Ask the server to end a LiveAvatar session so it frees its slot. Returns a
     * promise that always resolves (never rejects) so callers can `await` it to
     * guarantee the old session is gone before starting a new one, or fire-and-forget
     * it on teardown. `keepalive` lets it survive a page unload.
     */
    _endSession(sessionId) {
        if (!sessionId) return Promise.resolve();
        const c = this._config;
        try {
            return fetch(`${c.endpoint}/stop`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                keepalive: true,
                body: JSON.stringify({ sessionId, apiKey: c.apiKey || undefined })
            }).then(() => {}, () => {});
        } catch {
            return Promise.resolve();
        }
    }

    /**
     * Ask the avatar to stop talking. In FULL voice mode HeyGen already interrupts
     * on your speech automatically; this is the manual seam for a "stop"/push-to-talk
     * button. Best-effort: publishes an interrupt message on the data channel.
     */
    interrupt() {
        if (!this.room?.localParticipant?.publishData) return;
        try {
            const data = new TextEncoder().encode(JSON.stringify({ type: 'interrupt' }));
            this.room.localParticipant.publishData(data, { reliable: true, topic: 'agent-control' });
        } catch (error) {
            console.warn('[live-avatar] interrupt failed', error);
        }
    }

    // ---- conversation history ----------------------------------------------

    _recordTurn(speaker, text) {
        this._history.push({ speaker, text });
        // Keep a bounded window so a resumed prompt stays reasonable.
        if (this._history.length > 40) this._history.shift();
    }

    /**
     * Instructions for a resumed session: the base persona instructions, the recent
     * conversation transcript, and a directive to continue seamlessly. Injected into
     * the context prompt on reconnect so the new session isn't amnesiac.
     */
    _buildResumeInstructions() {
        const base = this._config.instructions || '';
        const transcript = this._history
            .slice(-16)
            .map(turn => `${turn.speaker === 'avatar' ? 'You' : 'User'}: ${turn.text}`)
            .join('\n');
        const directive = 'The live video connection briefly dropped and has just been '
            + 'restored. Continue the SAME conversation exactly where it left off. Do NOT '
            + 'greet, re-introduce yourself, or mention the reconnection.';
        return [base, transcript ? `Conversation so far:\n${transcript}` : '', directive]
            .filter(Boolean)
            .join('\n\n');
    }

    // ---- config (from attributes) ------------------------------------------

    get _config() {
        return {
            endpoint: this.getAttribute('session-endpoint') || DEFAULT_ENDPOINT,
            avatarId: this.getAttribute('avatar-id') || '',
            voiceId: this.getAttribute('voice-id') || '',
            contextId: this.getAttribute('context-id') || '',
            apiKey: this.getAttribute('api-key') || '',            // optional; prefer server env LIVEAVATAR_API_KEY
            contextName: this.getAttribute('context-name') || 'Live Avatar Session',
            language: this.getAttribute('language') || 'en',
            isSandbox: this.getAttribute('sandbox') !== 'false',   // sandbox by default
            openingText: this.getAttribute('opening-text') || '',
            instructions: this.getAttribute('instructions') || '',
            // Spoken (verbatim) the moment the avatar reconnects, so it re-engages instead
            // of sitting silent. The recent conversation is also in the resume prompt, so
            // the avatar's own brain carries the thread from the user's next turn.
            resumeText: this.getAttribute('resume-text')
                || 'Looks like the connection dropped for a moment — shall we pick up where we left off?'
        };
    }

    // ---- session + room -----------------------------------------------------

    async _createSession({ resume = false } = {}) {
        const c = this._config;
        if (!c.avatarId || !c.voiceId || !c.contextId) {
            throw new Error('live-avatar requires avatar-id, voice-id, and context-id attributes.');
        }
        // On a resume, feed the recent conversation into the prompt and set the opening
        // text to a contextual continuation the avatar speaks immediately — so it picks
        // up on its own instead of sitting silent until the user prompts it.
        const instructions = resume ? this._buildResumeInstructions() : (c.instructions || '');
        const openingText = resume ? c.resumeText : (c.openingText || undefined);
        const response = await fetch(c.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                apiKey: c.apiKey || undefined,
                avatarId: c.avatarId,
                voiceId: c.voiceId,
                contextId: c.contextId,
                contextName: c.contextName,
                language: c.language,
                isSandbox: c.isSandbox,
                openingText,
                instructions: instructions || undefined
            })
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.liveKitUrl || !payload?.liveKitToken) {
            throw new Error(payload?.error || `Session request failed (${response.status}).`);
        }
        return payload;
    }

    async _connect(session) {
        const room = new LiveKit.Room({ adaptiveStream: false, dynacast: false });
        const E = LiveKit.RoomEvent;

        room.on(E.TrackSubscribed, (track, _pub, participant) => {
            console.log('[live-avatar] track subscribed:', track.kind, participant?.identity || '');
            this._attachTrack(track, participant);
        });
        room.on(E.TrackUnsubscribed, (track) => {
            // Intentionally do NOT clear the element — hold the last frame. HeyGen can
            // briefly drop and re-add tracks; TrackSubscribed re-attaches when they return.
            console.log('[live-avatar] track unsubscribed:', track.kind);
        });
        room.on(E.DataReceived, (payload, _p, _k, topic) => this._handleData(payload, topic));

        room.on(E.ParticipantConnected, (p) => console.log('[live-avatar] participant joined:', p?.identity));
        room.on(E.ParticipantDisconnected, (p) => {
            console.warn('[live-avatar] participant left:', p?.identity);
            // The avatar renderer (its video) leaving while we're still in the room IS
            // the "video got lost" case. Give it a few seconds to rejoin the SAME session
            // on its own (a healthy video re-attach cancels this) before we tear the
            // session down and start a fresh one.
            if (this.room === room && this._avatarIdentity && p?.identity === this._avatarIdentity && !this._recoverTimer) {
                this._recoverTimer = setTimeout(() => {
                    this._recoverTimer = null;
                    this._recoverAvatar();
                }, 4000);
            }
        });
        room.on(E.ConnectionStateChanged, (s) => console.log('[live-avatar] connection state:', s));

        // Transient network blip: keep the video on screen, ride it out, re-attach on recovery.
        room.on(E.Reconnecting, () => {
            console.warn('[live-avatar] reconnecting…');
            this._setState('connecting');
        });
        room.on(E.Reconnected, () => {
            console.log('[live-avatar] reconnected');
            this._attachExistingTracks(room);
            this._setState('live');
        });

        // Real end of session (server closed it, token expired, idle/duration cap…).
        room.on(E.Disconnected, (reason) => {
            console.warn('[live-avatar] disconnected. reason:', reason);
            if (this.room !== room) return;
            this.stop();
            this._showOverlay('The session ended. Tap to resume.', 'Resume');
        });

        await room.connect(session.liveKitUrl, session.liveKitToken);
        this.room = room;

        // Unblock autoplay (safe: start() is user-gesture triggered) and open the mic.
        try { await room.startAudio(); } catch {}
        await room.localParticipant?.setMicrophoneEnabled?.(true);

        this.setAttribute('data-active', '');
        this._hideOverlay();
        this._attachExistingTracks(room);
        this._startHeartbeat();
    }

    _attachExistingTracks(room) {
        for (const participant of room.remoteParticipants?.values?.() || []) {
            for (const pub of participant.trackPublications?.values?.() || []) {
                if (pub.track) this._attachTrack(pub.track, participant);
            }
        }
    }

    /**
     * The avatar's video stream ended mid-session (participant left). Recreate the
     * session to bring it back. Guarded against loops; suppresses the opening line so
     * a recovery doesn't replay the greeting.
     */
    async _recoverAvatar() {
        this._recoverCount = (this._recoverCount || 0) + 1;
        if (this._recoverCount > 2) {
            console.warn('[live-avatar] avatar kept dropping; stopping auto-recovery.');
            await this.stop();
            this._showOverlay('The avatar session ended. Tap to resume.', 'Resume');
            return;
        }
        console.log('[live-avatar] avatar stream ended — restarting session…');
        this._setState('connecting');
        this._stopHeartbeat();
        const room = this.room;
        const staleSessionId = this._sessionId;
        this.room = null;
        this._sessionId = null;
        try { room?.disconnect?.(); } catch {}
        // Drop the old session's media so its audio can't overlap the new session's
        // (the doubled/echo voice on reconnect).
        this._detachMedia();
        // Terminate the old LiveAvatar session and WAIT for it before requesting a new
        // one — disconnecting the room alone leaves it active and holding the (sandbox:
        // single) slot. Awaiting avoids racing the new session into a concurrency error.
        await this._endSession(staleSessionId);
        try {
            const session = await this._createSession({ resume: true });
            this._sessionId = session.sessionId || null;
            await this._connect(session);
            this._setState('live');
        } catch (error) {
            this._setState('error');
            this._emit('error', { error });
            console.error('[live-avatar] recovery failed', error);
            this._showOverlay('The avatar session ended. Tap to resume.', 'Resume');
        }
    }

    _attachTrack(track, participant) {
        if (!track) return;
        const identity = participant?.identity || '';
        if (track.kind === 'video' && this._videoEl) {
            // Remember who provides the video so we can tell when the avatar (vs. any
            // other participant) leaves. We deliberately never detach on
            // TrackUnsubscribed — HeyGen unpublishes tracks when the avatar goes idle
            // and republishes on the next utterance; holding the element keeps the last
            // frame instead of flashing an empty stage.
            this._avatarIdentity = identity || this._avatarIdentity;
            this._recoverCount = 0; // healthy video → clear the recovery guard
            if (this._recoverTimer) {
                // Avatar rejoined on its own; no restart needed.
                clearTimeout(this._recoverTimer);
                this._recoverTimer = null;
            }
            if (this._videoTrack && this._videoTrack !== track) {
                try { this._videoTrack.detach(this._videoEl); } catch {}
            }
            this._videoTrack = track;
            track.attach(this._videoEl);
            this._videoEl.play?.().catch(() => {});
        } else if (track.kind === 'audio' && this._audioEl) {
            // Keep exactly ONE audio track on the element. LiveKit adds (not replaces)
            // tracks, so attaching a second makes both voices play at once — the echo.
            // Prefer the participant that also provides the video, so audio stays lip-synced.
            if (this._audioTrack && this._audioTrack !== track) {
                const haveAvatarAudio = this._audioParticipant && this._audioParticipant === this._avatarIdentity;
                const thisIsAvatar = identity && identity === this._avatarIdentity;
                if (haveAvatarAudio && !thisIsAvatar) return; // already have the lip-synced audio
                try { this._audioTrack.detach(this._audioEl); } catch {}
            }
            this._audioTrack = track;
            this._audioParticipant = identity;
            track.attach(this._audioEl);
            this._audioEl.play?.().catch(() => {});
        }
    }

    /** Detach and clear both media elements — used on teardown and before a restart. */
    _detachMedia() {
        try { this._audioTrack?.detach(this._audioEl); } catch {}
        try { this._videoTrack?.detach(this._videoEl); } catch {}
        this._audioTrack = null;
        this._videoTrack = null;
        this._audioParticipant = '';
        if (this._audioEl) this._audioEl.srcObject = null;
        if (this._videoEl) this._videoEl.srcObject = null;
    }

    // ---- data channel (transcripts + intents) -------------------------------

    _handleData(payload, topic) {
        if (topic && topic !== 'agent-response') return;
        let msg;
        try {
            msg = JSON.parse(this._decoder.decode(payload));
        } catch {
            return;
        }

        const type = msg.type || msg.event_type || msg.event || msg?.data?.type || '';
        const text = msg.text || msg?.data?.text || '';

        // Ignore streaming partials (e.g. user.transcription.chunk) — we surface finals only.
        if (type.endsWith('.chunk') || type.endsWith('.partial')) return;

        switch (type) {
            case 'user.transcription':
                if (text) {
                    this._recordTurn('user', text);
                    this._emit('transcript', { speaker: 'user', text });
                }
                break;
            case 'avatar.transcription':
                if (text) {
                    this._recordTurn('avatar', text);
                    this._emit('transcript', { speaker: 'avatar', text });
                }
                break;
            case 'avatar.speak_started':
                this._setState('speaking');
                break;
            case 'avatar.speak_ended':
                this._setState(this.hasAttribute('data-active') ? 'live' : 'idle');
                break;
            case 'user.speak_started':
                this._setState('listening');
                break;
            case 'user.speak_ended':
                this._setState('live');
                break;
            default:
                // Reserved seam: structured intents from the avatar (e.g. "launch a tour").
                // Nothing consumes this yet — a host can listen for it later.
                if (type) this._emit('action', { type, raw: msg });
        }
    }

    // ---- state + events -----------------------------------------------------

    _setState(state) {
        if (this.state === state) return;
        this.state = state;
        this.setAttribute('data-state', state);
        this._syncPill(state);
        this._emit('statechange', { state });
    }

    _emit(name, detail) {
        this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
    }

    // ---- rendering ----------------------------------------------------------

    _render() {
        this.shadowRoot.innerHTML = `
            <style>${STYLE}</style>
            <div class="stage">
                <video playsinline autoplay muted></video>
                <audio autoplay></audio>
                <span class="pill"><span class="dot"></span><span class="pill-text">Idle</span></span>
                <button class="stop" title="Stop voice chat" aria-label="Stop voice chat">✕</button>
                <div class="overlay">
                    <div class="overlay-text">Talk with a live avatar guide.</div>
                    <button class="overlay-btn" type="button">Start voice chat</button>
                </div>
            </div>
        `;
        this._videoEl = this.shadowRoot.querySelector('video');
        this._audioEl = this.shadowRoot.querySelector('audio');
        this._pillEl = this.shadowRoot.querySelector('.pill-text');
        this._overlayEl = this.shadowRoot.querySelector('.overlay');
        this._overlayTextEl = this.shadowRoot.querySelector('.overlay-text');
        this._overlayBtnEl = this.shadowRoot.querySelector('.overlay-btn');

        this._overlayBtnEl.addEventListener('click', () => this.start());
        this.shadowRoot.querySelector('.stop').addEventListener('click', () => this.stop());
    }

    _syncPill(state) {
        if (this._pillEl) this._pillEl.textContent = state.charAt(0).toUpperCase() + state.slice(1);
    }

    _showOverlay(text, buttonLabel) {
        if (!this._overlayEl) return;
        if (text) this._overlayTextEl.textContent = text;
        if (buttonLabel) this._overlayBtnEl.textContent = buttonLabel;
        this._overlayEl.hidden = false;
    }

    _hideOverlay() {
        if (this._overlayEl) this._overlayEl.hidden = true;
    }
}

if (!customElements.get('live-avatar')) {
    customElements.define('live-avatar', LiveAvatarElement);
}

export default LiveAvatarElement;
