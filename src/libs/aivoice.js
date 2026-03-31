class BaseVoiceProvider {
    constructor() {
        this.state = 'idle';
    }

    setState(state) {
        this.state = state;
    }
}

class BaseTranscriber extends EventTarget {
    constructor() {
        super();
        this.state = 'idle';
    }

    setState(state) {
        this.state = state;
        this.dispatchEvent(new CustomEvent('statechange', { detail: { state } }));
    }

    emitPartialTranscript(text, sourceEvent = null) {
        this.dispatchEvent(new CustomEvent('partialtranscript', {
            detail: { text, sourceEvent }
        }));
    }

    emitFinalTranscript(text, sourceEvent = null) {
        this.dispatchEvent(new CustomEvent('finaltranscript', {
            detail: { text, sourceEvent }
        }));
    }

    emitError(error) {
        this.dispatchEvent(new CustomEvent('error', { detail: { error } }));
    }

    async start() {
        throw new Error('start() must be implemented by a transcriber provider');
    }

    async stop() {
        throw new Error('stop() must be implemented by a transcriber provider');
    }

    async toggle() {
        if (this.state === 'listening' || this.state === 'starting') {
            await this.stop();
            return false;
        }
        await this.start();
        return true;
    }

    destroy() {}
}

class BaseVoiceActivityDetector extends EventTarget {
    constructor() {
        super();
        this.state = 'idle';
    }

    setState(state) {
        this.state = state;
        this.dispatchEvent(new CustomEvent('statechange', { detail: { state } }));
    }

    emitSpeechStart(detail = {}) {
        this.dispatchEvent(new CustomEvent('speechstart', { detail }));
    }

    emitSpeechEnd(detail = {}) {
        this.dispatchEvent(new CustomEvent('speechend', { detail }));
    }

    emitError(error) {
        this.dispatchEvent(new CustomEvent('error', { detail: { error } }));
    }

    async start() {
        throw new Error('start() must be implemented by a voice activity detector');
    }

    async stop() {
        throw new Error('stop() must be implemented by a voice activity detector');
    }

    destroy() {}
}

class BrowserSpeechTranscriber extends BaseTranscriber {
    constructor(options = {}) {
        super();
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            this.recognition = null;
            this.setState('unsupported');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = options.continuous ?? true;
        this.recognition.interimResults = options.interimResults ?? true;
        this.recognition.lang = options.lang || document.documentElement.lang || 'en-US';
        this._stopRequested = false;

        this.recognition.addEventListener('start', () => {
            this.setState('listening');
        });

        this.recognition.addEventListener('result', event => {
            let partialTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                const transcript = result[0]?.transcript?.trim();
                if (!transcript) continue;

                if (result.isFinal) {
                    this.emitFinalTranscript(transcript, event);
                } else {
                    partialTranscript += `${transcript} `;
                }
            }

            const partial = partialTranscript.trim();
            if (partial) this.emitPartialTranscript(partial, event);
        });

        this.recognition.addEventListener('error', event => {
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                this.emitError(event);
                this.setState('error');
                return;
            }
            if (this._stopRequested) {
                this.setState('idle');
                return;
            }
            if (event.error === 'no-speech') {
                return;
            }
            this.emitError(event);
            this.setState('error');
        });

        this.recognition.addEventListener('end', () => {
            if (this._stopRequested) {
                this.setState('idle');
                return;
            }

            if (this.state === 'listening') {
                try {
                    this.recognition.start();
                } catch (error) {
                    this.emitError(error);
                    this.setState('error');
                }
                return;
            }

            if (this.state !== 'unsupported') {
                this.setState('idle');
            }
        });
    }

    async start() {
        if (!this.recognition) {
            this.setState('unsupported');
            throw new Error('Speech recognition is not supported in this browser.');
        }

        if (this.state === 'listening' || this.state === 'starting') return;

        this._stopRequested = false;
        this.setState('starting');
        this.recognition.start();
    }

    async stop() {
        if (!this.recognition) {
            this.setState('unsupported');
            return;
        }

        if (this.state === 'idle' || this.state === 'stopping') return;

        this._stopRequested = true;
        this.setState('stopping');
        this.recognition.stop();
    }

    destroy() {
        if (!this.recognition) return;
        this._stopRequested = true;
        try {
            this.recognition.abort();
        } catch (error) {
            this.emitError(error);
        }
        this.setState('idle');
    }
}

class BrowserVoiceActivityDetector extends BaseVoiceActivityDetector {
    constructor(options = {}) {
        super();
        this.threshold = options.threshold ?? 0.045;
        this.startFrames = options.startFrames ?? 4;
        this.endFrames = options.endFrames ?? 10;
        this.fftSize = options.fftSize ?? 2048;
        this.mediaStream = null;
        this.audioContext = null;
        this.source = null;
        this.analyser = null;
        this.data = null;
        this.animationFrame = null;
        this._speechFrames = 0;
        this._silenceFrames = 0;
        this._isSpeechActive = false;
    }

    async start() {
        if (this.state === 'listening' || this.state === 'starting') return;

        this.setState('starting');
        try {
            const getUserMedia = navigator.mediaDevices?.getUserMedia?.bind(navigator.mediaDevices);
            if (!getUserMedia) throw new Error('getUserMedia is unavailable.');

            this.mediaStream = this.mediaStream || await getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            this.audioContext = this.audioContext || new (window.AudioContext || window.webkitAudioContext)();
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            this.source = this.source || this.audioContext.createMediaStreamSource(this.mediaStream);
            this.analyser = this.analyser || this.audioContext.createAnalyser();
            this.analyser.fftSize = this.fftSize;
            this.analyser.smoothingTimeConstant = 0.15;
            this.source.connect(this.analyser);
            this.data = this.data || new Float32Array(this.analyser.fftSize);
            this._speechFrames = 0;
            this._silenceFrames = 0;
            this._isSpeechActive = false;
            this._startMonitoring();
            this.setState('listening');
        } catch (error) {
            this.emitError(error);
            this.setState('error');
        }
    }

    _startMonitoring() {
        cancelAnimationFrame(this.animationFrame);
        const tick = () => {
            this.animationFrame = requestAnimationFrame(tick);
            if (!this.analyser || !this.data) return;
            this.analyser.getFloatTimeDomainData(this.data);

            let sum = 0;
            for (let i = 0; i < this.data.length; i++) {
                const sample = this.data[i];
                sum += sample * sample;
            }

            const rms = Math.sqrt(sum / this.data.length);
            if (rms >= this.threshold) {
                this._speechFrames += 1;
                this._silenceFrames = 0;
                if (!this._isSpeechActive && this._speechFrames >= this.startFrames) {
                    this._isSpeechActive = true;
                    this.emitSpeechStart({ rms });
                }
                return;
            }

            this._silenceFrames += 1;
            this._speechFrames = 0;
            if (this._isSpeechActive && this._silenceFrames >= this.endFrames) {
                this._isSpeechActive = false;
                this.emitSpeechEnd({ rms });
            }
        };
        tick();
    }

    async stop() {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
        this._speechFrames = 0;
        this._silenceFrames = 0;
        if (this._isSpeechActive) {
            this._isSpeechActive = false;
            this.emitSpeechEnd({ rms: 0 });
        }
        this.setState('idle');
    }

    destroy() {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
        try {
            this.source?.disconnect?.();
        } catch {}
        this.source = null;
        this.analyser = null;
        this.data = null;
        this.mediaStream?.getTracks?.().forEach(track => track.stop());
        this.mediaStream = null;
        this.audioContext?.close?.();
        this.audioContext = null;
        this.setState('idle');
    }
}

class BaseChatProvider extends BaseVoiceProvider {
    constructor() {
        super();
        this.listeners = new Map();
    }

    on(eventName, handler) {
        const handlers = this.listeners.get(eventName) || new Set();
        handlers.add(handler);
        this.listeners.set(eventName, handlers);
        return () => handlers.delete(handler);
    }

    emit(eventName, detail = {}) {
        const handlers = this.listeners.get(eventName);
        if (!handlers) return;
        for (const handler of handlers) {
            handler(detail);
        }
    }

    async sendMessage() {
        throw new Error('sendMessage() must be implemented by a chat provider');
    }

    async prepare() {
        return true;
    }
}

class NullChatProvider extends BaseChatProvider {
    async sendMessage() {
        return null;
    }
}

class EchoChatProvider extends BaseChatProvider {
    async prepare() {
        return true;
    }

    async sendMessage({ text, metadata }) {
        const tourName = metadata?.context?.tourKey;
        return {
            text: tourName
                ? `You said: ${text}. Current tour context is "${tourName}".`
                : `You said: ${text}`
        };
    }
}

class ChromeNanoChatProvider extends BaseChatProvider {
    constructor(options = {}) {
        super();
        this.fallbackProvider = options.fallbackProvider || new EchoChatProvider();
        this.systemPrompt = options.systemPrompt || '';
        this.expectedInputs = options.expectedInputs || [{ type: 'text', languages: ['en'] }];
        this.expectedOutputs = options.expectedOutputs || [{ type: 'text', languages: ['en'] }];
        this.maxAvailabilityChecks = options.maxAvailabilityChecks || 20;
        this.availabilityPollIntervalMs = options.availabilityPollIntervalMs || 1500;
        this.session = null;
        this.sessionPromise = null;
        this.lastAvailability = 'unavailable';
    }

    _getSessionOptions() {
        return {
            expectedInputs: this.expectedInputs,
            expectedOutputs: this.expectedOutputs
        };
    }

    async _getAvailability() {
        const LanguageModel = globalThis.LanguageModel;
        if (!LanguageModel) {
            this.lastAvailability = 'unavailable';
            this.emit('availabilitychange', { availability: 'unavailable', reason: 'api-missing' });
            return 'unavailable';
        }

        const availability = await LanguageModel.availability(this._getSessionOptions());
        this.lastAvailability = availability;
        this.emit('availabilitychange', { availability });
        return availability;
    }

    async _waitForAvailability() {
        let availability = await this._getAvailability();
        if (availability === 'available' || availability === 'unavailable') {
            return availability;
        }

        for (let attempt = 0; attempt < this.maxAvailabilityChecks; attempt++) {
            await new Promise(resolve => setTimeout(resolve, this.availabilityPollIntervalMs));
            availability = await this._getAvailability();
            if (availability === 'available' || availability === 'unavailable') {
                return availability;
            }
        }

        return availability;
    }

    async _createSession() {
        const LanguageModel = globalThis.LanguageModel;
        if (!LanguageModel) return null;

        const sessionOptions = {
            ...this._getSessionOptions(),
            monitor: monitor => {
                monitor.addEventListener('downloadprogress', event => {
                    this.emit('downloadprogress', {
                        loaded: event.loaded,
                        percent: event.loaded * 100
                    });
                });
            }
        };

        this.emit('sessioncreating', {});
        this.session = await LanguageModel.create(sessionOptions);
        this.emit('sessionready', {});
        return this.session;
    }

    async _getSession() {
        if (this.session) return this.session;
        if (this.sessionPromise) return this.sessionPromise;

        this.sessionPromise = (async () => {
            const availability = await this._getAvailability();
            if (availability === 'unavailable') return null;

            if (availability === 'downloadable' || availability === 'downloading') {
                const session = await this._createSession();
                const settledAvailability = await this._waitForAvailability();
                if (settledAvailability === 'unavailable') return null;
                return session;
            }

            return this._createSession();
        })();

        try {
            return await this.sessionPromise;
        } finally {
            this.sessionPromise = null;
        }
    }

    async prepare() {
        const session = await this._getSession();
        if (session) return true;

        if (this.fallbackProvider?.prepare) {
            await this.fallbackProvider.prepare();
            return true;
        }

        return false;
    }

    _buildPrompt({ text, conversation, metadata, systemPrompt }) {
        const safeConversation = conversation.map(entry => ({
            role: entry.role,
            text: entry.text
        }));

        const tourContext = metadata?.context || null;
        const responseContract = metadata?.responseContract || null;

        return [
            systemPrompt || this.systemPrompt || 'You are a concise help assistant for an interactive product tour demo.',
            '',
            'Current tour context:',
            JSON.stringify(tourContext, null, 2),
            '',
            'Response contract:',
            JSON.stringify(responseContract, null, 2),
            '',
            'Conversation history:',
            JSON.stringify(safeConversation, null, 2),
            '',
            `User message: ${text}`,
            '',
            'Follow the system prompt and the response contract exactly. Output only what the response contract requests.'
        ].join('\n');
    }

    async sendMessage({ text, conversation, metadata, systemPrompt }) {
        try {
            const session = await this._getSession();
            if (!session) {
                throw new Error('Chrome Nano session is unavailable.');
            }

            const prompt = this._buildPrompt({ text, conversation, metadata, systemPrompt });
            console.log('[AIVoice][ChromeNanoChatProvider.sendMessage] payload', {
                text,
                conversation,
                metadata,
                systemPrompt,
                prompt
            });
            const responseText = await session.prompt(prompt, this._getSessionOptions());

            return {
                text: responseText,
                provider: 'chrome-nano'
            };
        } catch (error) {
            this.emit('error', { error });
            const fallback = await this.fallbackProvider.sendMessage({
                text,
                conversation,
                metadata,
                systemPrompt
            });
            return {
                ...fallback,
                provider: fallback?.provider || 'echo-fallback',
                fallbackReason: error?.message || String(error)
            };
        }
    }

    async reset() {
        if (this.session?.destroy) {
            await this.session.destroy();
        }
        this.session = null;
    }
}

class OpenAIChatProvider extends BaseChatProvider {
    constructor(options = {}) {
        super();
        this.client = options.client || null;
        this.model = options.model || 'gpt-5-mini';
        this.systemPrompt = options.systemPrompt || '';
        this.fallbackProvider = options.fallbackProvider || new EchoChatProvider();
    }

    async prepare() {
        return Boolean(this.client || this.fallbackProvider?.prepare?.());
    }

    _buildPrompt({ text, conversation, metadata, systemPrompt }) {
        const safeConversation = conversation.map(entry => ({
            role: entry.role,
            text: entry.text
        }));

        const tourContext = metadata?.context || null;
        const responseContract = metadata?.responseContract || null;

        return [
            systemPrompt || this.systemPrompt || 'You are a concise help assistant for an interactive product tour demo.',
            '',
            'Current tour context:',
            JSON.stringify(tourContext, null, 2),
            '',
            'Response contract:',
            JSON.stringify(responseContract, null, 2),
            '',
            'Conversation history:',
            JSON.stringify(safeConversation, null, 2),
            '',
            `User message: ${text}`,
            '',
            'Follow the system prompt and the response contract exactly. Output only what the response contract requests.'
        ].join('\n');
    }

    async sendMessage({ text, conversation, metadata, systemPrompt }) {
        try {
            if (!this.client?.responses?.create) {
                throw new Error('OpenAI client is unavailable.');
            }

            const prompt = this._buildPrompt({ text, conversation, metadata, systemPrompt });
            console.log('[AIVoice][OpenAIChatProvider.sendMessage] payload', {
                text,
                conversation,
                metadata,
                systemPrompt,
                prompt,
                model: this.model
            });

            const response = await this.client.responses.create({
                model: this.model,
                input: prompt
            });

            return {
                text: response.output_text || '',
                rawResponse: response,
                provider: 'openai'
            };
        } catch (error) {
            this.emit('error', { error });
            const fallback = await this.fallbackProvider.sendMessage({
                text,
                conversation,
                metadata,
                systemPrompt
            });
            return {
                ...fallback,
                provider: fallback?.provider || 'echo-fallback',
                fallbackReason: error?.message || String(error)
            };
        }
    }
}

class HttpChatProvider extends BaseChatProvider {
    constructor(options = {}) {
        super();
        this.endpoint = options.endpoint || '/api/chat';
        this.model = options.model || 'gpt-5-mini';
        this.systemPrompt = options.systemPrompt || '';
        this.fallbackProvider = options.fallbackProvider || new EchoChatProvider();
        this.headers = options.headers || {};
    }

    async prepare() {
        return true;
    }

    _buildPrompt({ text, conversation, metadata, systemPrompt }) {
        const safeConversation = conversation.map(entry => ({
            role: entry.role,
            text: entry.text
        }));

        const tourContext = metadata?.context || null;
        const responseContract = metadata?.responseContract || null;

        return [
            systemPrompt || this.systemPrompt || 'You are a concise help assistant for an interactive product tour demo.',
            '',
            'Current tour context:',
            JSON.stringify(tourContext, null, 2),
            '',
            'Response contract:',
            JSON.stringify(responseContract, null, 2),
            '',
            'Conversation history:',
            JSON.stringify(safeConversation, null, 2),
            '',
            `User message: ${text}`,
            '',
            'Follow the system prompt and the response contract exactly. Output only what the response contract requests.'
        ].join('\n');
    }

    async sendMessage({ text, conversation, metadata, systemPrompt }) {
        try {
            const prompt = this._buildPrompt({ text, conversation, metadata, systemPrompt });
            const payload = {
                model: this.model,
                prompt
            };
            console.log('[AIVoice][HttpChatProvider.sendMessage] payload', {
                text,
                conversation,
                metadata,
                systemPrompt,
                prompt,
                model: this.model,
                endpoint: this.endpoint
            });

            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.headers
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP chat proxy failed with status ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            return {
                text: data.text || '',
                rawResponse: data.rawResponse || data,
                provider: data.provider || 'http-proxy'
            };
        } catch (error) {
            this.emit('error', { error });
            const fallback = await this.fallbackProvider.sendMessage({
                text,
                conversation,
                metadata,
                systemPrompt
            });
            return {
                ...fallback,
                provider: fallback?.provider || 'echo-fallback',
                fallbackReason: error?.message || String(error)
            };
        }
    }
}

class BaseSpeechRenderer extends BaseVoiceProvider {
    async speak() {
        throw new Error('speak() must be implemented by a speech renderer provider');
    }

    cancel() {}
}

class BrowserSpeechRenderer extends BaseSpeechRenderer {
    constructor(options = {}) {
        super();
        this.voiceName = options.voiceName || null;
        this.rate = options.rate ?? 1;
        this.pitch = options.pitch ?? 1;
        this.volume = options.volume ?? 1;
    }

    async speak(text) {
        if (!('speechSynthesis' in window)) {
            throw new Error('Speech synthesis is not supported in this browser.');
        }

        this.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = this.rate;
        utterance.pitch = this.pitch;
        utterance.volume = this.volume;

        if (this.voiceName) {
            const voice = window.speechSynthesis.getVoices().find(item => item.name === this.voiceName);
            if (voice) utterance.voice = voice;
        }

        return new Promise(resolve => {
            this.emit?.('speakstart', { text });
            utterance.addEventListener('end', resolve, { once: true });
            utterance.addEventListener('error', resolve, { once: true });
            window.speechSynthesis.speak(utterance);
        });
    }

    cancel() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }
}

class ElevenLabsSpeechRenderer extends BaseSpeechRenderer {
    constructor(options = {}) {
        super();
        this.apiKey = options.apiKey || '';
        this.voiceId = options.voiceId || '';
        this.modelId = options.modelId || 'eleven_flash_v2_5';
        this.outputFormat = options.outputFormat || 'mp3_22050_32';
        this.voiceSettings = options.voiceSettings || null;
        this.fallbackRenderer = options.fallbackRenderer || null;
        this.audio = null;
        this.audioUrl = null;
        this.abortController = null;
        this.activePlayback = null;
    }

    async _speakWithFallback(text, error) {
        if (!this.fallbackRenderer?.speak) throw error;
        console.warn('[ElevenLabsSpeechRenderer] Falling back to browser speech.', error);
        return this.fallbackRenderer.speak(text);
    }

    async speak(text) {
        if (!this.apiKey) {
            return this._speakWithFallback(text, new Error('ElevenLabs API key is required.'));
        }
        if (!this.voiceId) {
            return this._speakWithFallback(text, new Error('ElevenLabs voice ID is required.'));
        }

        this.cancel();

        this.abortController = new AbortController();

        let response;
        try {
            response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': this.apiKey
                },
                body: JSON.stringify({
                    text,
                    model_id: this.modelId,
                    output_format: this.outputFormat,
                    ...(this.voiceSettings ? { voice_settings: this.voiceSettings } : {})
                }),
                signal: this.abortController.signal
            });
        } catch (error) {
            if (error?.name === 'AbortError') return;
            throw error;
        }

        if (!response.ok) {
            return this._speakWithFallback(text, new Error(`ElevenLabs TTS failed with status ${response.status}`));
        }

        const audioBlob = await response.blob();
        this.audioUrl = URL.createObjectURL(audioBlob);
        this.audio = new Audio(this.audioUrl);

        return new Promise((resolve, reject) => {
            const cleanup = () => {
                if (this.audio) {
                    this.audio.onended = null;
                    this.audio.onerror = null;
                }
                this._revokeAudioUrl();
                this.activePlayback = null;
            };

            this.activePlayback = {
                resolve,
                reject,
                cleanup
            };

            this.audio.onended = () => {
                cleanup();
                resolve();
            };

            this.audio.onerror = () => {
                cleanup();
                reject(new Error('ElevenLabs audio playback failed.'));
            };

            this.audio.play().catch(error => {
                cleanup();
                reject(error);
            });
        });
    }

    _revokeAudioUrl() {
        if (this.audioUrl) {
            URL.revokeObjectURL(this.audioUrl);
            this.audioUrl = null;
        }
    }

    cancel() {
        this.abortController?.abort();
        this.abortController = null;

        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio.onended = null;
            this.audio.onerror = null;
            this.audio = null;
        }

        if (this.activePlayback) {
            const { cleanup, resolve } = this.activePlayback;
            cleanup?.();
            resolve?.();
        }

        this._revokeAudioUrl();
        this.fallbackRenderer?.cancel?.();
    }
}

class AIVoice extends EventTarget {
    constructor(options = {}) {
        super();
        this.transcriber = options.transcriber || new BrowserSpeechTranscriber();
        this.voiceActivityDetector = options.voiceActivityDetector || new BrowserVoiceActivityDetector();
        this.chatProvider = options.chatProvider || new NullChatProvider();
        this.speechRenderer = options.speechRenderer || null;
        this.autoSubmitFinalTranscript = options.autoSubmitFinalTranscript ?? false;
        this.autoSpeakResponses = options.autoSpeakResponses ?? false;
        this.systemPrompt = options.systemPrompt || '';
        this.context = options.context || null;
        this.dialogState = {
            pendingAction: null,
            lastSuggestedTourKey: null,
            activeTopic: null
        };
        this.conversation = [];
        this.isSessionActive = false;
        this.isRendererSpeaking = false;
        this.currentSpeechText = '';
        this.currentSpeechFingerprint = '';
        this.lastSpeechFingerprint = '';
        this.lastSpeechEndedAt = 0;
        this.speechStartedAt = 0;
        this.recentSpeechEchoWindowMs = options.recentSpeechEchoWindowMs ?? 3000;
        this.postSpeechEchoGuardMs = options.postSpeechEchoGuardMs ?? 1600;
        this.bargeInGracePeriodMs = options.bargeInGracePeriodMs ?? 500;
        this.awaitingBargeInTranscriptUntil = 0;
        this.endOfTurnSilenceMs = options.endOfTurnSilenceMs ?? 1400;
        this.pendingUserTurns = [];
        this.pendingUserTurnTimer = null;
        this.requestSequence = 0;
        this.latestAcceptedRequestId = 0;
        this.activeSpeechRequestId = 0;
        this.latestPartialTranscript = '';
        this.latestPartialTranscriptAt = 0;

        this._detachChatProviderEvents = null;

        this._onTranscriberStateChange = event => {
            this.dispatchEvent(new CustomEvent('transcriberstatechange', {
                detail: event.detail
            }));
        };

        this._onPartialTranscript = event => {
            const text = event.detail?.text || '';
            if (this.isRendererSpeaking) return;
            if (this._shouldSuppressPostSpeechEcho(text)) return;
            if (!this._shouldAcceptTranscriptDuringBargeInWindow(text) && this._looksLikeRecentSpeechEcho(text)) return;
            this.latestPartialTranscript = text;
            this.latestPartialTranscriptAt = Date.now();
            this.dispatchEvent(new CustomEvent('partialtranscript', {
                detail: event.detail
            }));
        };

        this._onFinalTranscript = async event => {
            const finalText = this._chooseTranscriptForTurn(event.detail?.text || '');
            if (this.isRendererSpeaking) return;
            if (this._shouldSuppressPostSpeechEcho(finalText)) return;
            if (!this._shouldAcceptTranscriptDuringBargeInWindow(finalText) && this._looksLikeRecentSpeechEcho(finalText)) return;
            this.awaitingBargeInTranscriptUntil = 0;
            this._queueUserTurn(finalText, {
                ...(event.detail || {}),
                text: finalText
            });
        };

        this._onTranscriberError = event => {
            this.dispatchEvent(new CustomEvent('error', {
                detail: event.detail
            }));
        };

        this._onVoiceActivitySpeechStart = () => {
            if (!this.isRendererSpeaking) return;
            if (this._isWithinBargeInGracePeriod()) return;
            this.awaitingBargeInTranscriptUntil = Date.now() + 3000;
            this.interruptSpeech();
            this.dispatchEvent(new CustomEvent('bargein', {
                detail: { at: Date.now() }
            }));
        };

        this._onVoiceActivityError = event => {
            this.dispatchEvent(new CustomEvent('error', {
                detail: event.detail
            }));
        };

        this.transcriber.addEventListener('statechange', this._onTranscriberStateChange);
        this.transcriber.addEventListener('partialtranscript', this._onPartialTranscript);
        this.transcriber.addEventListener('finaltranscript', this._onFinalTranscript);
        this.transcriber.addEventListener('error', this._onTranscriberError);
        this.voiceActivityDetector?.addEventListener?.('speechstart', this._onVoiceActivitySpeechStart);
        this.voiceActivityDetector?.addEventListener?.('error', this._onVoiceActivityError);

        this._bindChatProviderEvents();
    }

    _buildAvailableTourSummaries(tourContext) {
        const tours = tourContext?.availableTours;
        if (!tours || typeof tours !== 'object') return [];

        return Object.entries(tours).map(([tourKey, steps]) => {
            const normalizedSteps = Array.isArray(steps) ? steps : [];
            const firstStep = normalizedSteps[0] || null;
            const topics = [];

            for (const step of normalizedSteps.slice(0, 3)) {
                if (step?.title) topics.push(step.title);
                if (typeof step?.content === 'string') topics.push(step.content);
                if (Array.isArray(step?.content)) {
                    for (const item of step.content) {
                        if (typeof item === 'string' && !/^https?:\/\//.test(item)) topics.push(item);
                    }
                }
            }

            return {
                tourKey,
                stepCount: normalizedSteps.length,
                firstStepTitle: firstStep?.title || null,
                summary: topics.join(' ').slice(0, 500)
            };
        });
    }

    _getContextSnapshot(baseContext = null) {
        const context = baseContext || this.context || {};
        return {
            ...context,
            dialogState: {
                pendingAction: this.dialogState.pendingAction || null,
                lastSuggestedTourKey: this.dialogState.lastSuggestedTourKey || null,
                activeTopic: this.dialogState.activeTopic || null,
                ...(context?.dialogState || {})
            }
        };
    }

    _buildResponseContract(context = null) {
        return {
            format: 'json',
            schema: {
                spoken_reply: 'string',
                next_action: 'respond_only|offer_tour|start_tour|continue_tour|ask_clarifying_question|end_conversation',
                target_tour_key: 'string|null',
                follow_up_question: 'string|null',
                topic: 'string|null',
                confidence: 'number|null'
            },
            available_tours: this._buildAvailableTourSummaries(context),
            rules: [
                'Reply like a natural spoken sales or support rep: warm, confident, conversational, and helpful.',
                'Stay grounded in the supplied context and paraphrase the tour content in your own words.',
                'Do not quote or closely mirror the exact wording of the tour copy unless the user explicitly asks for an exact quote.',
                'spoken_reply should sound good out loud, using contractions and short natural sentences.',
                'Use next_action to choose the best conversational move, not just whether a tour exists.',
                'target_tour_key must be one of the provided available_tours tourKey values, or null.',
                'Use offer_tour when a tour would help but the user has not clearly asked to start it yet.',
                'Use start_tour when the user is clearly asking to begin now, or when the dialogState shows you already offered that tour and the user gives contextual consent such as "sure", "why not", "okay", or similar.',
                'If next_action is start_tour, spoken_reply must be exactly one short sentence that quickly hands off into the action, with no explanation or recap.',
                'If next_action is continue_tour, spoken_reply should be a short handoff sentence.',
                'Use respond_only when it is better to keep talking naturally without pushing a tour yet.',
                'Use ask_clarifying_question only when one short follow-up is genuinely needed.',
                'Use continue_tour only when there is already an active tour and the user wants to keep going.',
                'If next_action is offer_tour or ask_clarifying_question, follow_up_question may contain the short spoken follow-up. Otherwise it should be null.',
                'If uncertain, use respond_only and leave target_tour_key null.',
                'Return valid JSON only with no markdown.'
            ]
        };
    }

    _buildOrchestratedSystemPrompt(systemPrompt, responseContract) {
        return [
            systemPrompt || this.systemPrompt || 'You are a concise help assistant for an interactive product tour demo.',
            '',
            'You must follow this response contract exactly:',
            JSON.stringify(responseContract, null, 2)
        ].join('\n');
    }

    _extractJsonObject(text) {
        if (typeof text !== 'string') return null;

        const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
        if (fenced) return fenced[1].trim();

        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;
        return text.slice(firstBrace, lastBrace + 1);
    }

    _parseStructuredChatResponse(responseText, context = null) {
        const jsonText = this._extractJsonObject(responseText);
        if (!jsonText) {
            return {
                text: responseText,
                nextAction: 'respond_only',
                targetTourKey: null,
                followUpQuestion: null,
                topic: null,
                confidence: null,
                rawText: responseText
            };
        }

        try {
            const parsed = JSON.parse(jsonText);
            const allowedTourKeys = new Set(Object.keys(context?.availableTours || {}));
            const targetTourKey = allowedTourKeys.has(parsed.target_tour_key)
                ? parsed.target_tour_key
                : null;
            const allowedActions = new Set([
                'respond_only',
                'offer_tour',
                'start_tour',
                'continue_tour',
                'ask_clarifying_question',
                'end_conversation'
            ]);
            const nextAction = allowedActions.has(parsed.next_action)
                ? parsed.next_action
                : 'respond_only';
            const spokenReply = typeof parsed.spoken_reply === 'string'
                ? parsed.spoken_reply.trim()
                : responseText;

            return {
                text: spokenReply,
                spokenReply,
                nextAction,
                actionType: nextAction,
                targetTourKey,
                followUpQuestion: typeof parsed.follow_up_question === 'string' ? parsed.follow_up_question.trim() : null,
                topic: typeof parsed.topic === 'string' ? parsed.topic.trim() : null,
                confidence: typeof parsed.confidence === 'number' ? parsed.confidence : null,
                rawText: responseText
            };
        } catch {
            return {
                text: responseText,
                nextAction: 'respond_only',
                targetTourKey: null,
                followUpQuestion: null,
                topic: null,
                confidence: null,
                rawText: responseText
            };
        }
    }

    _updateDialogStateFromResponse(response = null, context = null) {
        const activeTourKey = context?.activeTourKey || null;
        const nextAction = response?.nextAction || 'respond_only';
        const targetTourKey = response?.targetTourKey || null;
        const topic = response?.topic || this.dialogState.activeTopic || null;

        if (nextAction === 'offer_tour') {
            this.dialogState = {
                pendingAction: 'offer_tour',
                lastSuggestedTourKey: targetTourKey,
                activeTopic: topic
            };
            return;
        }

        if (nextAction === 'ask_clarifying_question') {
            this.dialogState = {
                pendingAction: 'ask_clarifying_question',
                lastSuggestedTourKey: targetTourKey || this.dialogState.lastSuggestedTourKey || null,
                activeTopic: topic
            };
            return;
        }

        if (nextAction === 'start_tour') {
            this.dialogState = {
                pendingAction: null,
                lastSuggestedTourKey: targetTourKey || this.dialogState.lastSuggestedTourKey || null,
                activeTopic: topic
            };
            return;
        }

        if (nextAction === 'continue_tour' && activeTourKey) {
            this.dialogState = {
                pendingAction: null,
                lastSuggestedTourKey: activeTourKey,
                activeTopic: topic
            };
            return;
        }

        this.dialogState = {
            pendingAction: null,
            lastSuggestedTourKey: this.dialogState.lastSuggestedTourKey || targetTourKey || activeTourKey || null,
            activeTopic: topic
        };
    }

    _normalizeTranscript(text = '') {
        return text
            .toLowerCase()
            .replace(/https?:\/\/\S+/g, ' ')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    _transcriptTokens(text = '') {
        return this._normalizeTranscript(text)
            .split(' ')
            .filter(token => token.length >= 3);
    }

    _isExplicitInterrupt(text = '') {
        return /^(stop|cancel|wait|whoa|woah|no|no wait|hold on|hold up|pause|actually|sorry|one sec|one second|just a sec|just a second|nevermind|never mind|shh|quiet|okay stop|ok stop)$/.test(text);
    }

    _isWithinBargeInGracePeriod() {
        if (!this.isRendererSpeaking || !this.speechStartedAt) return false;
        return (Date.now() - this.speechStartedAt) < this.bargeInGracePeriodMs;
    }

    _shouldAcceptTranscriptDuringBargeInWindow(text = '') {
        if (Date.now() > this.awaitingBargeInTranscriptUntil) return false;
        const normalizedText = this._normalizeTranscript(text);
        if (!normalizedText) return false;
        if (this._isExplicitInterrupt(normalizedText)) return true;
        return normalizedText.length >= 2;
    }

    _shouldSuppressPostSpeechEcho(text = '') {
        const normalizedText = this._normalizeTranscript(text);
        if (!normalizedText) return false;
        if (this._isExplicitInterrupt(normalizedText)) return false;

        const withinGuardWindow = Date.now() - this.lastSpeechEndedAt <= this.postSpeechEchoGuardMs;
        if (!withinGuardWindow || !this.lastSpeechFingerprint) return false;

        if (this.lastSpeechFingerprint.startsWith(normalizedText)) return true;

        const textWords = normalizedText.split(' ').filter(Boolean);
        const hasStrongOverlap = this._hasStrongTokenOverlap(normalizedText, this.lastSpeechFingerprint);
        if (textWords.length <= 3 && hasStrongOverlap) return true;
        if (textWords.length >= 4 && hasStrongOverlap) return true;

        return false;
    }

    _chooseTranscriptForTurn(finalText = '') {
        const normalizedFinal = this._normalizeTranscript(finalText);
        const partialAgeMs = Date.now() - this.latestPartialTranscriptAt;
        const normalizedPartial = this._normalizeTranscript(this.latestPartialTranscript);

        if (!normalizedPartial || partialAgeMs > 2000) {
            this.latestPartialTranscript = '';
            this.latestPartialTranscriptAt = 0;
            return finalText;
        }

        const finalWords = normalizedFinal ? normalizedFinal.split(' ').filter(Boolean) : [];
        const partialWords = normalizedPartial.split(' ').filter(Boolean);
        const isShortFinal = finalWords.length > 0 && finalWords.length <= 2;
        const partialIsMuchRicher = partialWords.length >= Math.max(4, finalWords.length + 2);
        const finalLooksLikeAcknowledgement = /^(sure|yeah|yep|yup|okay|ok|right|alright|uh huh|mm hmm)(\s+\1)?$/.test(normalizedFinal);

        const chosenText = (isShortFinal && partialIsMuchRicher && finalLooksLikeAcknowledgement)
            ? this.latestPartialTranscript
            : finalText;

        this.latestPartialTranscript = '';
        this.latestPartialTranscriptAt = 0;
        return chosenText;
    }

    _queueUserTurn(text = '', detail = {}) {
        const normalizedText = this._normalizeTranscript(text);
        if (!normalizedText) return;

        const lastEntry = this.pendingUserTurns[this.pendingUserTurns.length - 1];
        if (lastEntry?.normalized === normalizedText) {
            this._schedulePendingUserTurnFlush();
            return;
        }

        this.pendingUserTurns.push({
            text: text.trim(),
            normalized: normalizedText,
            detail
        });
        this._schedulePendingUserTurnFlush();
    }

    _schedulePendingUserTurnFlush() {
        clearTimeout(this.pendingUserTurnTimer);
        this.pendingUserTurnTimer = setTimeout(() => {
            this._flushPendingUserTurn().catch(error => {
                this.dispatchEvent(new CustomEvent('error', {
                    detail: { error }
                }));
            });
        }, this.endOfTurnSilenceMs);
    }

    async _flushPendingUserTurn() {
        clearTimeout(this.pendingUserTurnTimer);
        this.pendingUserTurnTimer = null;
        if (!this.pendingUserTurns.length) return;

        const mergedText = this.pendingUserTurns.map(entry => entry.text).join(' ').replace(/\s+/g, ' ').trim();
        const finalDetail = {
            ...(this.pendingUserTurns[this.pendingUserTurns.length - 1]?.detail || {}),
            text: mergedText
        };
        this.pendingUserTurns = [];

        const beforeEvent = new CustomEvent('beforefinaltranscript', {
            cancelable: true,
            detail: finalDetail
        });
        if (!this.dispatchEvent(beforeEvent)) return;

        this.conversation.push({ role: 'user', text: mergedText });
        this.dispatchEvent(new CustomEvent('finaltranscript', {
            detail: finalDetail
        }));

        if (this.autoSubmitFinalTranscript) {
            await this.sendUserText(mergedText);
        }
    }

    _applyActionPolicy(response = null) {
        if (!response) return response;

        const pendingAction = this.dialogState.pendingAction || null;
        const lastSuggestedTourKey = this.dialogState.lastSuggestedTourKey || null;

        if (response.nextAction === 'start_tour') {
            const hasPriorOffer = pendingAction === 'offer_tour'
                && (!lastSuggestedTourKey || lastSuggestedTourKey === response.targetTourKey);

            if (!hasPriorOffer) {
                return {
                    ...response,
                    nextAction: 'offer_tour',
                    actionType: 'offer_tour',
                    followUpQuestion: response.followUpQuestion || 'If you want, I can show you how that works.',
                    text: response.followUpQuestion || response.text || 'If you want, I can show you how that works.'
                };
            }
        }

        return response;
    }

    _looksLikeSpeechEcho(text = '') {
        const heard = this._normalizeTranscript(text);
        const spoken = this.currentSpeechFingerprint;
        if (!heard || !spoken) return false;
        if (spoken.startsWith(heard)) return true;
        if (this._hasStrongTokenOverlap(heard, spoken)) return true;
        if (heard.length < 8) return false;
        return spoken.includes(heard);
    }

    _looksLikeRecentSpeechEcho(text = '') {
        const heard = this._normalizeTranscript(text);
        if (!heard || heard.length < 6) return false;

        const withinRecentWindow = Date.now() - this.lastSpeechEndedAt <= this.recentSpeechEchoWindowMs;
        const spoken = this.isRendererSpeaking ? this.currentSpeechFingerprint : this.lastSpeechFingerprint;
        if (!spoken) return false;
        if (!this.isRendererSpeaking && !withinRecentWindow) return false;

        if (spoken.startsWith(heard)) return true;
        if (this._hasStrongTokenOverlap(heard, spoken)) return true;
        return heard.length >= 8 && spoken.includes(heard);
    }

    _hasStrongTokenOverlap(heardText = '', spokenText = '') {
        const heardTokens = this._transcriptTokens(heardText);
        const spokenTokens = new Set(this._transcriptTokens(spokenText));
        if (heardTokens.length < 3 || spokenTokens.size < 3) return false;

        let matches = 0;
        for (const token of heardTokens) {
            if (spokenTokens.has(token)) matches += 1;
        }

        return matches >= 2 && (matches / heardTokens.length) >= 0.6;
    }

    _bindChatProviderEvents() {
        this._detachChatProviderEvents?.();
        if (!this.chatProvider?.on) {
            this._detachChatProviderEvents = null;
            return;
        }

        const disposers = [
            this.chatProvider.on('availabilitychange', detail => {
                this.dispatchEvent(new CustomEvent('chatavailabilitychange', { detail }));
            }),
            this.chatProvider.on('downloadprogress', detail => {
                this.dispatchEvent(new CustomEvent('chatdownloadprogress', { detail }));
            }),
            this.chatProvider.on('sessioncreating', detail => {
                this.dispatchEvent(new CustomEvent('chatsessioncreating', { detail }));
            }),
            this.chatProvider.on('sessionready', detail => {
                this.dispatchEvent(new CustomEvent('chatsessionready', { detail }));
            }),
            this.chatProvider.on('error', detail => {
                this.dispatchEvent(new CustomEvent('error', { detail }));
            })
        ];

        this._detachChatProviderEvents = () => disposers.forEach(dispose => dispose());
    }

    getTranscriberState() {
        return this.transcriber?.state || 'idle';
    }

    async startListening() {
        this.isSessionActive = true;
        await this.voiceActivityDetector?.start?.();
        return this.transcriber.start();
    }

    async stopListening() {
        this.isSessionActive = false;
        await this.voiceActivityDetector?.stop?.();
        return this.transcriber.stop();
    }

    async toggleListening() {
        if (this.isSessionActive) {
            await this.stopListening();
            return false;
        }
        await this.startListening();
        return true;
    }

    async prepareChat() {
        this.dispatchEvent(new CustomEvent('chatpreparestart', { detail: {} }));
        try {
            const ready = await this.chatProvider.prepare();
            this.dispatchEvent(new CustomEvent('chatprepareready', {
                detail: { ready: ready !== false }
            }));
            return ready !== false;
        } catch (error) {
            this.dispatchEvent(new CustomEvent('error', { detail: { error } }));
            this.dispatchEvent(new CustomEvent('chatprepareready', {
                detail: { ready: false, error }
            }));
            return false;
        }
    }

    setContext(context) {
        this.context = {
            ...(context || {}),
            dialogState: {
                pendingAction: this.dialogState.pendingAction,
                lastSuggestedTourKey: this.dialogState.lastSuggestedTourKey,
                activeTopic: this.dialogState.activeTopic,
                ...(context?.dialogState || {})
            }
        };
        this.dispatchEvent(new CustomEvent('contextchange', {
            detail: { context: this.context }
        }));
    }

    getContext() {
        return this.context;
    }

    async speakText(text, response = null) {
        if (!text || !this.speechRenderer) return;

        this.activeSpeechRequestId = response?.requestId || 0;
        this.currentSpeechText = text;
        this.currentSpeechFingerprint = this._normalizeTranscript(text);
        this.lastSpeechFingerprint = this.currentSpeechFingerprint;
        this.lastSpeechEndedAt = 0;
        this.speechStartedAt = Date.now();
        this.awaitingBargeInTranscriptUntil = 0;
        this.isRendererSpeaking = true;
        this.dispatchEvent(new CustomEvent('speechstart', {
            detail: { text, response }
        }));
        try {
            await this.speechRenderer.speak(text);
        } finally {
            this.isRendererSpeaking = false;
            this.activeSpeechRequestId = 0;
            this.lastSpeechEndedAt = Date.now();
            this.speechStartedAt = 0;
            this.currentSpeechText = '';
            this.currentSpeechFingerprint = '';
            this.dispatchEvent(new CustomEvent('speechend', {
                detail: { text, response }
            }));
        }
    }

    async sendUserText(text, options = {}) {
        const requestId = ++this.requestSequence;
        this.latestAcceptedRequestId = requestId;
        const context = this._getContextSnapshot(options.context || this.context);
        const responseContract = this._buildResponseContract(context);
        const orchestratedSystemPrompt = this._buildOrchestratedSystemPrompt(
            options.systemPrompt || this.systemPrompt,
            responseContract
        );
        const providerRequest = {
            text,
            conversation: [...this.conversation],
            systemPrompt: orchestratedSystemPrompt,
            metadata: {
                ...(options.metadata || {}),
                context,
                responseContract
            }
        };

        console.log('[AIVoice][sendUserText] providerRequest', providerRequest);

        this.dispatchEvent(new CustomEvent('chatrequeststart', {
            detail: { text, requestId }
        }));

        const providerResponse = await this.chatProvider.sendMessage(providerRequest);

        if (requestId !== this.latestAcceptedRequestId) {
            return {
                text: '',
                skipped: true,
                skippedReason: 'stale-request',
                requestId
            };
        }

        const response = providerResponse?.text
            ? {
                ...providerResponse,
                ...this._parseStructuredChatResponse(providerResponse.text, context),
                provider: providerResponse.provider,
                requestId
            }
            : {
                ...providerResponse,
                requestId
            };
        const policyAdjustedResponse = this._applyActionPolicy(response);

        this.dispatchEvent(new CustomEvent('chatrequestend', {
            detail: { text, response: policyAdjustedResponse, requestId }
        }));

        if (!policyAdjustedResponse?.text) return policyAdjustedResponse;

        this._updateDialogStateFromResponse(policyAdjustedResponse, context);
        this.setContext({
            ...context,
            dialogState: {
                pendingAction: this.dialogState.pendingAction,
                lastSuggestedTourKey: this.dialogState.lastSuggestedTourKey,
                activeTopic: this.dialogState.activeTopic
            }
        });

        this.conversation.push({ role: 'assistant', text: policyAdjustedResponse.text });
        this.dispatchEvent(new CustomEvent('response', {
            detail: { text: policyAdjustedResponse.text, response: policyAdjustedResponse }
        }));
        this.dispatchEvent(new CustomEvent('action', {
            detail: { action: policyAdjustedResponse.nextAction, response: policyAdjustedResponse }
        }));

        if (this.autoSpeakResponses && this.speechRenderer) {
            try {
                await this.speakText(policyAdjustedResponse.text, policyAdjustedResponse);
            } catch (error) {
                if (requestId !== this.latestAcceptedRequestId) {
                    return policyAdjustedResponse;
                }
                this.dispatchEvent(new CustomEvent('error', {
                    detail: { error }
                }));
            }
        }

        return policyAdjustedResponse;
    }

    interruptSpeech() {
        this.isRendererSpeaking = false;
        this.activeSpeechRequestId = 0;
        this.lastSpeechEndedAt = Date.now();
        this.speechStartedAt = 0;
        this.currentSpeechText = '';
        this.currentSpeechFingerprint = '';
        this.speechRenderer?.cancel();
    }

    destroy() {
        this._detachChatProviderEvents?.();
        clearTimeout(this.pendingUserTurnTimer);
        this.pendingUserTurnTimer = null;
        this.pendingUserTurns = [];
        this.transcriber?.removeEventListener('statechange', this._onTranscriberStateChange);
        this.transcriber?.removeEventListener('partialtranscript', this._onPartialTranscript);
        this.transcriber?.removeEventListener('finaltranscript', this._onFinalTranscript);
        this.transcriber?.removeEventListener('error', this._onTranscriberError);
        this.voiceActivityDetector?.removeEventListener?.('speechstart', this._onVoiceActivitySpeechStart);
        this.voiceActivityDetector?.removeEventListener?.('error', this._onVoiceActivityError);
        this.transcriber?.destroy();
        this.voiceActivityDetector?.destroy?.();
        this.speechRenderer?.cancel?.();
    }
}

export {
    AIVoice,
    BaseChatProvider,
    BaseSpeechRenderer,
    BaseTranscriber,
    BaseVoiceActivityDetector,
    BrowserSpeechRenderer,
    BrowserSpeechTranscriber,
    BrowserVoiceActivityDetector,
    ChromeNanoChatProvider,
    ElevenLabsSpeechRenderer,
    EchoChatProvider,
    HttpChatProvider,
    OpenAIChatProvider,
    NullChatProvider
};

export default AIVoice;
