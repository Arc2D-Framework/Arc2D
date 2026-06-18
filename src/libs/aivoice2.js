class LiveAvatarServiceBase {
    constructor(options = {}) {
        this.options = options;
    }

    get availability() {
        return 'available';
    }

    async createSession() {
        throw new Error('createSession() must be implemented by a LiveAvatar service.');
    }

    async getSessionTranscript() {
        throw new Error('getSessionTranscript() must be implemented by a LiveAvatar service.');
    }
}

class LiveAvatarBrowserService extends LiveAvatarServiceBase {
    constructor(options = {}) {
        super(options);
        this.apiKey = options.apiKey || '';
        this.baseUrl = options.baseUrl || 'https://api.liveavatar.com';
    }

    get availability() {
        return this.apiKey ? 'available' : 'unavailable';
    }

    async _request(path, { method = 'GET', body } = {}) {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method,
            headers: {
                'X-API-KEY': this.apiKey,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`LiveAvatar browser request failed (${method} ${path}) with status ${response.status}: ${errorText}`);
        }

        return response.json();
    }

    async syncContext(config = {}) {
        if (!this.apiKey) {
            throw new Error('LiveAvatar API key is missing for browser mode.');
        }
        if (!config.contextId) {
            return null;
        }

        const body = {};

        if (config.contextName) body.name = config.contextName;
        if (config.instructions) {
            body.prompt = config.instructions;
            body.instructions = config.instructions;
        }
        if (typeof config.openingText === 'string') body.opening_text = config.openingText;

        if (!Object.keys(body).length) {
            return null;
        }

        return this._request(`/v1/contexts/${config.contextId}`, {
            method: 'PATCH',
            body
        });
    }

    async createSession(config = {}) {
        if (!this.apiKey) {
            throw new Error('LiveAvatar API key is missing for browser mode.');
        }

        if (config.contextId && (config.instructions || typeof config.openingText === 'string')) {
            await this.syncContext(config);
        }

        const tokenPayload = await this._request('/v1/sessions/token', {
            method: 'POST',
            body: {
                mode: 'FULL',
                avatar_id: config.avatarId,
                is_sandbox: Boolean(config.isSandbox),
                avatar_persona: {
                    voice_id: config.voiceId,
                    context_id: config.contextId,
                    language: config.language || 'en'
                }
            }
        });

        const sessionToken = tokenPayload?.session_token || tokenPayload?.data?.session_token;
        if (!sessionToken) {
            throw new Error('LiveAvatar did not return a session token.');
        }

        const startResponse = await fetch(`${this.baseUrl}/v1/sessions/start`, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${sessionToken}`,
                'accept': 'application/json'
            }
        });

        if (!startResponse.ok) {
            const errorText = await startResponse.text();
            throw new Error(`LiveAvatar session start failed with status ${startResponse.status}: ${errorText}`);
        }

        const payload = await startResponse.json();
        const liveKitUrl = payload?.livekit_url || payload?.data?.livekit_url;
        const liveKitToken = payload?.livekit_client_token || payload?.data?.livekit_client_token;
        const embedUrl = liveKitUrl && liveKitToken
            ? `https://meet.livekit.io/custom?liveKitUrl=${encodeURIComponent(liveKitUrl)}&token=${encodeURIComponent(liveKitToken)}`
            : '';

        return {
            url: embedUrl,
            sessionId: tokenPayload?.session_id || tokenPayload?.data?.session_id || null,
            sessionToken,
            liveKitUrl,
            liveKitToken,
            rawResponse: {
                token: tokenPayload,
                session: payload
            }
        };
    }

    async getSessionTranscript(sessionId) {
        if (!sessionId) {
            throw new Error('sessionId is required to fetch a LiveAvatar transcript.');
        }
        return this._request(`/v1/sessions/${sessionId}/transcript`, {
            method: 'GET'
        });
    }
}

class LiveAvatarProxyService extends LiveAvatarServiceBase {
    constructor(options = {}) {
        super(options);
        this.sessionEndpoint = options.sessionEndpoint || '/api/liveavatar/session';
        this.transcriptEndpointBase = options.transcriptEndpointBase || '/api/liveavatar/transcript';
        this.apiKey = options.apiKey || '';
    }

    async createSession(config = {}) {
        const response = await fetch(this.sessionEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiKey: config.apiKey || this.apiKey || '',
                avatarId: config.avatarId,
                contextId: config.contextId,
                voiceId: config.voiceId,
                language: config.language || 'en',
                isSandbox: Boolean(config.isSandbox),
                instructions: config.instructions || '',
                openingText: config.openingText || '',
                contextName: config.contextName || ''
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`LiveAvatar proxy embed failed with status ${response.status}: ${errorText}`);
        }

        const payload = await response.json();
        return {
            url: payload?.url || payload?.data?.url || '',
            sessionId: payload?.sessionId || payload?.data?.sessionId || null,
            liveKitUrl: payload?.liveKitUrl || payload?.data?.liveKitUrl || '',
            liveKitToken: payload?.liveKitToken || payload?.data?.liveKitToken || '',
            rawResponse: payload
        };
    }

    async getSessionTranscript(sessionId) {
        const transcriptUrl = new URL(`${this.transcriptEndpointBase}/${sessionId}`, window.location.origin);
        if (this.apiKey) {
            transcriptUrl.searchParams.set('apiKey', this.apiKey);
        }

        const response = await fetch(transcriptUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`LiveAvatar proxy transcript failed with status ${response.status}: ${errorText}`);
        }

        return response.json();
    }
}

class LiveAvatarVoiceAgent extends EventTarget {
    constructor(options = {}) {
        super();
        this.service = options.service || null;
        this.liveKit = options.liveKit || null;
        this.embedConfig = {
            avatarId: options.avatarId || '',
            contextId: options.contextId || '',
            voiceId: options.voiceId || '',
            language: options.language || 'en',
            apiKey: options.apiKey || '',
            isSandbox: Boolean(options.isSandbox)
        };
        this.systemPrompt = options.systemPrompt || '';
        this.instructions = options.instructions || '';
        this.openingText = options.openingText || '';
        this.visualizerConfig = {
            mode: 'embed-frame',
            label: options.visualizerLabel || 'Live avatar agent',
            placeholder: options.visualizerPlaceholder || 'Start voice chat to load the avatar agent.'
        };
        this.context = null;
        this.state = 'idle';
        this.isPrepared = false;
        this.activeEmbed = null;
        this.embedUrl = '';
        this.sessionId = null;
        this.room = null;
        this.remoteVideoTrack = null;
        this.remoteAudioTrack = null;
        this.remoteVideoParticipantId = '';
        this.remoteAudioParticipantId = '';
        this.textDecoder = new TextDecoder();
        this.pendingAvatarResponse = null;
        this.isAvatarSpeaking = false;
        this.avatarSpeechFallbackTimer = null;
        this.dialogState = {
            pendingOfferTourKey: null,
            lastSuggestedTourKey: null,
            awaitingLaunchConfirmationTourKey: null
        };
    }

    _emit(type, detail = {}) {
        this.dispatchEvent(new CustomEvent(type, { detail }));
    }

    _setState(state) {
        this.state = state;
        this._emit('transcriberstatechange', { state });
    }

    getTranscriberState() {
        return this.state;
    }

    setContext(context) {
        this.context = context;
    }

    _normalizeText(value = '') {
        return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    }

    _tokenizeText(value = '') {
        return this._normalizeText(value).split(/\s+/).filter(Boolean);
    }

    _looksAffirmative(text = '') {
        return /\b(yes|yeah|yep|sure|ok|okay|alright|why not|lets do it|let's do it|go ahead|start it|show me|sounds good)\b/i.test(text);
    }

    _looksLikeTourOffer(text = '') {
        return /(tour|walkthrough|walk through|guide)/i.test(text)
            && /(want|would you like|if you want|if you'd like|can show|show you|walk you through|take you through)/i.test(text);
    }

    _looksLikeTourConfirmationPrompt(text = '') {
        return /(confirm|before i start|before we start|before i begin|would you like to proceed|like to proceed|ready to start|start the tour|get started with the tour)/i.test(text)
            && /(tour|walkthrough|guide)/i.test(text);
    }

    _looksLikeDirectStartRequest(text = '') {
        return /(start|begin|launch|open)/i.test(text)
            && /(tour|walkthrough|guide)/i.test(text);
    }

    _findRelevantTourKey(text = '') {
        const availableTours = this.context?.availableTours || {};
        const normalizedText = this._normalizeText(text);
        let bestMatch = null;
        let bestScore = 0;

        for (const [tourKey, tourValue] of Object.entries(availableTours)) {
            const keyTokens = this._tokenizeText(tourKey);
            const summaryTokens = this._tokenizeText(
                Array.isArray(tourValue)
                    ? tourValue.map(step => step?.title || step?.content || '').join(' ')
                    : JSON.stringify(tourValue)
            );
            const uniqueTokens = new Set([...keyTokens, ...summaryTokens].filter(token => token.length > 2));
            let score = 0;
            for (const token of uniqueTokens) {
                if (normalizedText.includes(token)) score += keyTokens.includes(token) ? 3 : 1;
            }
            if (score > bestScore) {
                bestScore = score;
                bestMatch = tourKey;
            }
        }

        return bestScore > 0 ? bestMatch : null;
    }

    _buildResponseFromAvatarText(text = '') {
        const targetTourKey = this.dialogState.awaitingLaunchConfirmationTourKey
            || this._findRelevantTourKey(text)
            || this.dialogState.pendingOfferTourKey
            || null;

        let nextAction = 'respond_only';
        if (this.dialogState.awaitingLaunchConfirmationTourKey && targetTourKey) {
            nextAction = 'start_tour';
            this.dialogState.awaitingLaunchConfirmationTourKey = null;
            this.dialogState.pendingOfferTourKey = null;
            this.dialogState.lastSuggestedTourKey = targetTourKey;
        } else if (this._looksLikeTourConfirmationPrompt(text) && targetTourKey) {
            nextAction = 'offer_tour';
            this.dialogState.pendingOfferTourKey = targetTourKey;
            this.dialogState.lastSuggestedTourKey = targetTourKey;
        } else if (this._looksLikeTourOffer(text) && targetTourKey) {
            nextAction = 'offer_tour';
            this.dialogState.pendingOfferTourKey = targetTourKey;
            this.dialogState.lastSuggestedTourKey = targetTourKey;
        }

        return {
            text,
            provider: 'liveavatar',
            nextAction,
            targetTourKey,
            topic: targetTourKey,
            confidence: null
        };
    }

    _handleTranscriptEntry(entry) {
        if (entry.speaker === 'user') {
            this._endAvatarSpeech();
            if (this.dialogState.pendingOfferTourKey && (this._looksAffirmative(entry.text) || this._looksLikeDirectStartRequest(entry.text))) {
                this.dialogState.awaitingLaunchConfirmationTourKey = this.dialogState.pendingOfferTourKey;
            } else if (!this.dialogState.pendingOfferTourKey && this._looksLikeDirectStartRequest(entry.text)) {
                const requestedTourKey = this._findRelevantTourKey(entry.text) || this.dialogState.lastSuggestedTourKey || this.context?.activeTourKey || null;
                if (requestedTourKey) {
                    this.dialogState.awaitingLaunchConfirmationTourKey = requestedTourKey;
                }
            }
            this._emit('finaltranscript', {
                text: entry.text
            });
            return;
        }

        const response = this._buildResponseFromAvatarText(entry.text);
        this.pendingAvatarResponse = response;
        this._emit('response', {
            text: entry.text,
            response
        });
        this._emit('action', {
            action: response.nextAction,
            response
        });
    }

    _scheduleAvatarSpeechFallback(text = '') {
        if (this.avatarSpeechFallbackTimer) {
            clearTimeout(this.avatarSpeechFallbackTimer);
            this.avatarSpeechFallbackTimer = null;
        }

        const normalizedLength = String(text || '').trim().length;
        if (!normalizedLength) return;

        const estimatedDurationMs = Math.min(14000, Math.max(2200, normalizedLength * 55));
        this.avatarSpeechFallbackTimer = setTimeout(() => {
            this._endAvatarSpeech();
        }, estimatedDurationMs);
    }

    _beginAvatarSpeech(response = null, fallbackText = '') {
        const effectiveResponse = response || this.pendingAvatarResponse || {
            text: fallbackText || '',
            provider: 'liveavatar',
            nextAction: 'respond_only',
            targetTourKey: null
        };

        if (!this.isAvatarSpeaking) {
            this.isAvatarSpeaking = true;
            this._emit('speechstart', {
                text: effectiveResponse.text || fallbackText || '',
                response: effectiveResponse
            });
        }

        this._scheduleAvatarSpeechFallback(effectiveResponse.text || fallbackText || '');
    }

    _endAvatarSpeech() {
        if (this.avatarSpeechFallbackTimer) {
            clearTimeout(this.avatarSpeechFallbackTimer);
            this.avatarSpeechFallbackTimer = null;
        }
        if (!this.isAvatarSpeaking) return;

        const response = this.pendingAvatarResponse || {
            text: '',
            provider: 'liveavatar',
            nextAction: 'respond_only',
            targetTourKey: null
        };

        this.isAvatarSpeaking = false;
        this._emit('speechend', {
            text: response.text || '',
            response
        });
        this.pendingAvatarResponse = null;
    }

    _emitMediaChange() {
        this._emit('visualizermediachange', {
            videoTrack: this.remoteVideoTrack,
            audioTrack: this.remoteAudioTrack
        });
    }

    _getRoomEvent(name) {
        return this.liveKit?.RoomEvent?.[name] || name;
    }

    _extractRoomMessage(payload) {
        const eventType = payload?.type
            || payload?.event_type
            || payload?.event
            || payload?.name
            || payload?.data?.type
            || payload?.message?.type
            || '';
        const text = payload?.text
            || payload?.data?.text
            || payload?.message?.text
            || payload?.payload?.text
            || '';

        return {
            eventType,
            text
        };
    }

    _handleRoomData(payload, participant, kind, topic) {
        if (topic && topic !== 'agent-response') return;

        let parsed;
        try {
            parsed = JSON.parse(this.textDecoder.decode(payload));
        } catch {
            return;
        }

        const { eventType, text } = this._extractRoomMessage(parsed);

        if (eventType === 'user.transcription' && text) {
            this._handleTranscriptEntry({
                speaker: 'user',
                text
            });
            return;
        }

        if (eventType === 'avatar.transcription' && text) {
            this._handleTranscriptEntry({
                speaker: 'avatar',
                text
            });
            return;
        }

        if (eventType === 'user.speak_started') {
            this._endAvatarSpeech();
            this._setState('listening');
            return;
        }

        if (eventType === 'user.speak_ended') {
            this._setState('idle');
            return;
        }

        if (eventType === 'avatar.speak_started') {
            this._beginAvatarSpeech(this.pendingAvatarResponse, text || '');
            return;
        }

        if (eventType === 'avatar.speak_ended') {
            this._endAvatarSpeech();
        }
    }

    _handleTrackSubscribed(track, publication, participant) {
        const source = publication?.source || track?.source || '';
        const kind = track?.kind || publication?.kind || '';
        const normalizedSource = String(source).toLowerCase();
        const normalizedKind = String(kind).toLowerCase();
        const participantId = participant?.identity || participant?.sid || '';

        console.log('[LiveAvatarVoiceAgent][track subscribed]', {
            kind,
            source,
            participant: participantId || 'unknown'
        });

        if (normalizedKind === 'video' || normalizedSource.includes('camera')) {
            this.remoteVideoTrack = track;
            this.remoteVideoParticipantId = participantId;
        }
        if (normalizedKind === 'audio' || normalizedSource.includes('microphone')) {
            const prefersSameParticipant = this.remoteVideoParticipantId
                && participantId
                && participantId === this.remoteVideoParticipantId;
            const hasNoAudioYet = !this.remoteAudioTrack;
            const prefersAvatarIdentity = /heygen|avatar/i.test(participantId);

            if (hasNoAudioYet || prefersSameParticipant || prefersAvatarIdentity) {
                this.remoteAudioTrack = track;
                this.remoteAudioParticipantId = participantId;
            }
        }
        this._emitMediaChange();
    }

    _handleTrackUnsubscribed(track) {
        if (this.remoteVideoTrack === track) {
            this.remoteVideoTrack = null;
            this.remoteVideoParticipantId = '';
        }
        if (this.remoteAudioTrack === track) {
            this.remoteAudioTrack = null;
            this.remoteAudioParticipantId = '';
        }
        this._emitMediaChange();
    }

    async _connectRoom(session = {}) {
        if (!this.liveKit?.Room) {
            throw new Error('LiveKit SDK is unavailable.');
        }

        const room = new this.liveKit.Room();
        room.on(this._getRoomEvent('DataReceived'), (payload, participant, kind, topic) => {
            this._handleRoomData(payload, participant, kind, topic);
        });
        room.on(this._getRoomEvent('TrackSubscribed'), (track, publication, participant) => {
            this._handleTrackSubscribed(track, publication, participant);
        });
        room.on(this._getRoomEvent('TrackUnsubscribed'), (track) => {
            this._handleTrackUnsubscribed(track);
        });

        await room.connect(session.liveKitUrl, session.liveKitToken);
        if (typeof room.startAudio === 'function') {
            try {
                await room.startAudio();
            } catch {}
        }
        await room.localParticipant?.setMicrophoneEnabled?.(true);
        this.room = room;
    }

    async _disconnectRoom() {
        try {
            await this.room?.localParticipant?.setMicrophoneEnabled?.(false);
        } catch {}
        try {
            this.room?.disconnect?.();
        } catch {}
        this.room = null;
        this.remoteVideoTrack = null;
        this.remoteAudioTrack = null;
        this.remoteVideoParticipantId = '';
        this.remoteAudioParticipantId = '';
        this._endAvatarSpeech();
        this._emitMediaChange();
    }

    _buildSessionInstructions() {
        const sections = [];
        if (this.systemPrompt) {
            sections.push(`System prompt:\n${this.systemPrompt}`);
        }
        if (this.instructions) {
            sections.push(`Additional instructions:\n${this.instructions}`);
        }

        if (this.context) {
            const summarizedContext = {
                activeTourKey: this.context.activeTourKey || null,
                activeStepIndex: this.context.activeStepIndex ?? null,
                totalSteps: this.context.totalSteps ?? null,
                activeStep: this.context.activeStep || null,
                availableTours: this.context.availableTours || null
            };
            sections.push(`TourGuide context:\n${JSON.stringify(summarizedContext, null, 2)}`);
        }

        sections.push(
            'Behavior rules:\n' +
            '- You are the LiveAvatar voice agent for this TourGuide experience.\n' +
            '- Use the TourGuide context to explain what is on the page and what tours are available.\n' +
            '- Never launch or advance a tour without first asking the user for permission.\n' +
            '- When you recommend a tour, ask briefly and naturally.\n' +
            '- If the user confirms they want a tour, do not explain the tour contents, steps, or UI in detail.\n' +
            '- After the user confirms, reply with exactly one short sentence that simply hands off to the tour, such as "Sure, opening it now." or "Alright, let me show you."\n' +
            '- Do not narrate the step-by-step walkthrough yourself after confirmation because the TourGuide UI will handle that.\n' +
            '- Be warm, natural, and helpful.'
        );

        return sections.join('\n\n').trim();
    }

    async prepareChat() {
        this._emit('chatpreparestart', {});
        if (!this.service || this.service.availability === 'unavailable') {
            const error = new Error('LiveAvatar service is unavailable.');
            this._emit('chatprepareready', { ready: false, error });
            this._emit('error', { error });
            return false;
        }

        this.isPrepared = true;
        this._emit('chatprepareready', { ready: true });
        this._emit('visualizerchange', { config: { ...this.visualizerConfig, src: '' } });
        return true;
    }

    async startListening() {
        if (this.state === 'listening' || this.state === 'starting') return true;
        if (!this.isPrepared) {
            const ready = await this.prepareChat();
            if (!ready) {
                throw new Error('LiveAvatar agent is not ready yet.');
            }
        }

        this._setState('starting');
        try {
            const embed = await this.service.createSession({
                ...this.embedConfig,
                contextName: 'Arc2D TourGuide Live Session',
                openingText: this.openingText,
                instructions: this._buildSessionInstructions()
            });
            if (!embed?.url) {
                throw new Error('LiveAvatar did not return an embed URL.');
            }

            this.activeEmbed = embed;
            this.embedUrl = embed.url || '';
            this.sessionId = embed.sessionId || null;
            await this._connectRoom(embed);
            this._emit('visualizerchange', {
                config: {
                    ...this.visualizerConfig,
                    mode: 'live-media'
                }
            });
            this._emitMediaChange();
            this._setState('listening');
            return true;
        } catch (error) {
            await this._disconnectRoom();
            this._setState('idle');
            this._emit('error', { error });
            throw error;
        }
    }

    async stopListening() {
        if (this.state === 'idle' || this.state === 'stopping') return false;
        this._setState('stopping');
        this.activeEmbed = null;
        this.embedUrl = '';
        this.sessionId = null;
        await this._disconnectRoom();
        this._emit('visualizerchange', {
            config: {
                ...this.visualizerConfig,
                mode: 'live-media'
            }
        });
        this._setState('idle');
        return false;
    }

    async toggleListening() {
        if (this.state === 'listening' || this.state === 'starting') {
            return this.stopListening();
        }
        await this.startListening();
        return true;
    }

    async destroy() {
        await this.stopListening();
    }
}

export {
    LiveAvatarBrowserService,
    LiveAvatarProxyService
};

export default LiveAvatarVoiceAgent;
