# Live Avatar (`<live-avatar>`)

A self-contained, drop-in web component for a **real-time conversational video avatar** — you see it, hear it, talk to it, interrupt it, and it survives connection drops. Built ground-up for simplicity: one script tag + one HTML element.

```html
<script type="module" src="./voice3.js"></script>
<live-avatar
    session-endpoint="/api/liveavatar/session"
    avatar-id="…" voice-id="…" context-id="…">
</live-avatar>
```

> **File note:** the element is implemented in `voice3.js` (kept that name for continuity across the project's history). This folder is fully self-contained — front end (`voice3.js` + `live-avatar.html`) **and** backend (`openai-proxy-server.js`) live here together.

---

> **v2 note:** this folder adds a second, swappable brain. The `llm` attribute picks the backend:
> `llm="liveavatar"` (default) is the video avatar described below; `llm="openai"` runs an **OpenAI
> Realtime voice** session (your `OPENAI_API_KEY`, minted server-side as an ephemeral secret at
> `POST /api/openai/realtime-session`) with **no video — a pulsing orb** driven by the reply audio.
> Same public API, same `statechange`/`transcript` events either way; flip the attribute to swap live.
> The recipe (ephemeral mint + WebRTC handshake + server-VAD turn-taking) is ported from DemoGeeni's
> ChatBar. Open **http://localhost:3000/demos/live-avatar2/live-avatar.html** and use the Brain selector.

## TL;DR for a future session

- The avatar's **entire brain** (speech-to-text → LLM → text-to-speech → video) runs **server-side inside LiveAvatar (which is built on HeyGen)**. This front end just does media I/O + orchestration.
- **LiveKit** is the transport (WebRTC room). **OpenAI is NOT used** by this avatar at all — the whole loop is LiveAvatar/HeyGen.
- You **must** run it through the proxy server (`npm run start:proxy`, port **3000**), not the static `npm start` (port 8080) — only the proxy has the `/api/liveavatar/*` routes.
- Open at **http://localhost:3000/demos/live-avatar/live-avatar.html**.
- The avatar drops occasionally (flaky sandbox renderer). The component **auto-recovers** and carries the conversation across the reconnect. `sandbox="false"` is the real cure but costs avatar credits.

---

## Who does what (architecture)

| Piece | Role | How you spot it |
|---|---|---|
| **LiveAvatar** (`api.liveavatar.com`) | The platform. Owns the avatar, the "context" (system prompt/persona), the voice, and the **conversational brain (STT → LLM → TTS)**. Authenticated with the LiveAvatar API key. | `liveavatar-agent-…` participant; all `/v1/sessions`, `/v1/contexts` calls |
| **HeyGen** | The engine LiveAvatar is built on. Renders the **talking-head video** (lip-synced) and hosts the realtime infra. Never called directly. | `heygen` participant (audio+video); LiveKit URL `heygen-*.livekit.cloud` |
| **LiveKit** (`livekit-client`) | WebRTC transport. Avatar video/audio come **down**, your mic goes **up**, transcripts/events over the **data channel**. | `track subscribed`, `connection state`, `DataReceived` logs |
| **Proxy** (`openai-proxy-server.js`, in this folder) | Holds keys server-side; brokers create/stop/keep-alive sessions and patches the context. Node, port 3000. | `[openai-proxy-server]` logs |
| **OpenAI** | **Not used by this avatar.** Only the *old* `demos/help-demo.html` path uses the proxy's `/api/chat`. | — |

### One conversational turn
```
You speak
  → mic audio published to the LiveKit room
    → LiveAvatar: speech-to-text (what you said)
      → LiveAvatar LLM (reads the context prompt/persona) → decides the reply
        → LiveAvatar text-to-speech (your voice_id) → reply audio
          → HeyGen renders the avatar video lip-synced to that audio
            → both stream back over LiveKit → the <video>/<audio> in the element
  (transcripts + speak_started/ended arrive over the LiveKit data channel)
```

---

## Running it

1. Put the LiveAvatar (and, for the old demo, OpenAI) keys in `<repoRoot>/.env`:
   ```
   OPENAI_API_KEY=sk-...          # only needed by the old help-demo, not this avatar
   LIVEAVATAR_API_KEY=...         # optional — or pass api-key="" on the element (dev only)
   ```
2. Start the proxy: `npm run start:proxy` (serves static files **and** the API on port 3000).
3. Open **http://localhost:3000/demos/live-avatar/live-avatar.html**, click **Start voice chat**, allow the mic.

> The demo currently passes `api-key="…"` on the element for convenience. That exposes the key in the browser — for anything real, drop that attribute and set `LIVEAVATAR_API_KEY` in the server `.env` instead (the proxy falls back to it).

---

## The `<live-avatar>` element API

### Attributes
| Attribute | Default | Purpose |
|---|---|---|
| `session-endpoint` | `/api/liveavatar/session` | Proxy route that creates a session |
| `avatar-id` / `voice-id` / `context-id` | — (required) | LiveAvatar identifiers |
| `api-key` | — | LiveAvatar key (dev convenience; prefer server env) |
| `context-name` | `Live Avatar Session` | Name written to the context on patch |
| `language` | `en` | Session language |
| `sandbox` | `true` | `false` = production renderer (stable, uses credits) |
| `opening-text` | — | Verbatim line spoken when a **fresh** session starts |
| `instructions` | — | Persona/system prompt for the context |
| `resume-text` | "Looks like the connection dropped for a moment — shall we pick up where we left off?" | Verbatim line spoken on **reconnect** |
| `auto-start` | (absent) | If present, shows the tap-to-start overlay on load |

### Events (all bubble + `composed`)
| Event | `detail` | When |
|---|---|---|
| `statechange` | `{ state }` | `idle`\|`connecting`\|`live`\|`listening`\|`speaking`\|`error`\|`stopped` |
| `transcript` | `{ speaker, text }` | Final user or avatar transcription (`speaker: 'user'\|'avatar'`) |
| `action` | `{ type, raw }` | Reserved seam for structured avatar intents (nothing consumes it yet) |
| `error` | `{ error }` | Any failure |

### Methods
- `start()` / `stop()` — connect / tear down.
- `interrupt()` — best-effort "stop talking" (barge-in also happens automatically from the mic).

### Extension seam (e.g. wiring to a tour later)
The element is deliberately decoupled — it knows nothing about tours or any host app. To react, listen for events:
```js
avatar.addEventListener('transcript', e => …);   // {speaker, text}
avatar.addEventListener('statechange', e => …);
avatar.addEventListener('action', e => …);        // future: avatar → app intents
```

---

## Reliability design (drops, recovery, keep-alive)

The sandbox avatar renderer is flaky — the `heygen` (video) participant can leave the room mid-session while your client stays connected ("the video got lost"). The component handles this in layers:

1. **Keep-alive heartbeat** — pings `POST /v1/sessions/keep-alive` every 20s while connected, to prevent idle drops at the source.
2. **Hold the last frame** — on a transient `TrackUnsubscribed`, it does *not* tear down (HeyGen unpublishes/republishes tracks when idle); it re-attaches when they return.
3. **Participant-aware recovery** — if the avatar participant actually leaves, a 4s grace timer (in case it rejoins on its own) then a full session restart, guarded against loops → falls back to a one-tap "Resume" overlay.
4. **Conversation continuity across a reconnect** — it records the transcript, injects the recent turns into the new session's prompt, and speaks `resume-text` so it re-engages instead of starting cold. Because the avatar is a **voice agent** (input only via mic) and `opening_text` is spoken **verbatim**, `resume-text` is posed as a **question** ("…shall we pick up where we left off?") — your "yes" is the mic input that triggers its own brain to continue with full context. That's why it isn't fully automatic: there's no API to hand the agent text, so *something* has to prompt it, and a question makes that natural.
5. **Single audio track** — the session has two audio publishers (`heygen` + `liveavatar-agent`); the component attaches only one (preferring the video participant's, for lip-sync) to avoid a doubled/echo voice.
6. **Clean session teardown** — ends the LiveAvatar session server-side (`/api/liveavatar/session/stop`) on stop and before each restart, so dead sessions don't clog the sandbox's single concurrency slot.

---

## LiveAvatar API quirks (hard-won — save future debugging)

Base: `https://api.liveavatar.com`, `X-API-KEY` header. Full list: `GET /openapi.json`.

- **Context PATCH requires all three fields.** `PATCH /v1/contexts/{id}` 422s ("Field required") unless `name`, `prompt`, **and** `opening_text` are all present. The proxy fetches the current context and merges caller overrides so every field is always sent.
- **`opening_text` is spoken verbatim** and is the avatar's *only* proactive utterance — empty ⇒ silence until it hears the mic. There is **no** send-text/task/chat endpoint; the agent only takes mic audio.
- **Concurrency is enforced at `/v1/sessions/start`, not `/token`.** Sandbox = **one** concurrent session, so a leftover session blocks new ones with a 403 "Session concurrency limit reached" at the start step. The proxy auto-clears stale **sandbox** sessions and retries once on that 403.
- **Session lifecycle endpoints:** `POST /v1/sessions/token` → `POST /v1/sessions/start` (returns `livekit_url` + `livekit_client_token`) → `POST /v1/sessions/keep-alive` (`{session_id}`) → `POST /v1/sessions/stop` (`{session_id}`). List actives: `GET /v1/sessions?type=active` (`type` must be `active` or `historic`).
- Two participants per session: `heygen` (audio+video renderer) and `liveavatar-agent-…` (the brain). Both publish audio.
- `GET /v1/sessions/{id}/transcript` only populates when a real LiveKit client is joined.

---

## Known limitations / next levers

- **Sandbox renderer flakiness** is the root cause of drops. `sandbox="false"` gives the stable production renderer + real concurrency (so recovery never collides) — but consumes avatar credits.
- **Reconnect isn't fully hands-free** by design (see reliability §4). True auto-continue would require re-introducing a generation step (an LLM authoring the continuation line) — deliberately removed to keep the stack single-brain and OpenAI-free.
- The demo `api-key` is inline for dev; move it to server env for anything shared.

---

## File map

```
demos/live-avatar/
  live-avatar.html         ← the demo page (one script tag + one <live-avatar>)
  voice3.js                ← the <live-avatar> custom element (imports LiveKit from CDN)
  openai-proxy-server.js   ← backend: /api/liveavatar/session (+ /stop, /keep-alive), holds keys, serves static
  README.md                ← this file
```

> The proxy serves static files from the **repo root** (it resolves two levels up), so it still hosts every other demo too — and it also exposes `/api/chat` (OpenAI) used by the legacy `demos/help-demo.html`. It's a shared dev backend that happens to live in this folder; not exclusive to the live avatar.

This is a from-scratch rewrite that replaced the older, more tangled `src/libs/aivoice2.js` + `demos/help-demo2.html` path.
