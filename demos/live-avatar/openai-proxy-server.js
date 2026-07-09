import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

async function loadEnvFile() {
    const envPath = path.join(repoRoot, '.env');
    try {
        const raw = await fs.readFile(envPath, 'utf8');
        for (const line of raw.split(/\r?\n/)) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const separatorIndex = trimmed.indexOf('=');
            if (separatorIndex === -1) continue;

            const key = trimmed.slice(0, separatorIndex).trim();
            if (!key || process.env[key] !== undefined) continue;

            let value = trimmed.slice(separatorIndex + 1).trim();
            if (
                (value.startsWith('"') && value.endsWith('"'))
                || (value.startsWith("'") && value.endsWith("'"))
            ) {
                value = value.slice(1, -1);
            }
            process.env[key] = value;
        }
    } catch (error) {
        if (error?.code !== 'ENOENT') {
            console.warn('[openai-proxy-server] Unable to read .env file.', error);
        }
    }
}

await loadEnvFile();

const port = Number(process.env.PORT || 3000);
const openAIKey = process.env.OPENAI_API_KEY || '';
const openAIModel = process.env.OPENAI_MODEL || 'gpt-5-mini';
const openAIBaseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/responses';
const liveAvatarKey = process.env.LIVEAVATAR_API_KEY || '';
const liveAvatarBaseUrl = process.env.LIVEAVATAR_BASE_URL || 'https://api.liveavatar.com';

const MIME_TYPES = {
    '.css': 'text/css; charset=utf-8',
    '.gif': 'image/gif',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ttf': 'font/ttf',
    '.txt': 'text/plain; charset=utf-8',
    '.wav': 'audio/wav',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });
    response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, text, contentType = 'text/plain; charset=utf-8') {
    response.writeHead(statusCode, {
        'Content-Type': contentType,
        'Cache-Control': 'no-store'
    });
    response.end(text);
}

function extractOutputText(rawResponse) {
    if (!rawResponse || typeof rawResponse !== 'object') return '';
    if (typeof rawResponse.output_text === 'string' && rawResponse.output_text) {
        return rawResponse.output_text;
    }

    const output = Array.isArray(rawResponse.output) ? rawResponse.output : [];
    for (const item of output) {
        const content = Array.isArray(item?.content) ? item.content : [];
        for (const part of content) {
            if (part?.type === 'output_text' && typeof part.text === 'string' && part.text) {
                return part.text;
            }
        }
    }

    return '';
}

async function readRequestBody(request) {
    const chunks = [];
    for await (const chunk of request) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
}

async function handleChatRequest(request, response) {
    if (!openAIKey) {
        sendJson(response, 500, {
            error: 'OPENAI_API_KEY is not configured on the server.'
        });
        return;
    }

    try {
        const rawBody = await readRequestBody(request);
        const body = rawBody ? JSON.parse(rawBody) : {};
        const prompt = typeof body.prompt === 'string' ? body.prompt : '';
        const model = typeof body.model === 'string' && body.model ? body.model : openAIModel;

        if (!prompt.trim()) {
            sendJson(response, 400, { error: 'Missing prompt.' });
            return;
        }

        const upstream = await fetch(openAIBaseUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openAIKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                input: prompt
            })
        });

        const rawResponse = await upstream.json().catch(() => null);
        if (!upstream.ok) {
            sendJson(response, upstream.status, {
                error: rawResponse?.error?.message || 'OpenAI request failed.',
                rawResponse
            });
            return;
        }

        sendJson(response, 200, {
            text: extractOutputText(rawResponse),
            provider: 'openai-proxy',
            rawResponse
        });
    } catch (error) {
        sendJson(response, 500, {
            error: error?.message || String(error)
        });
    }
}

async function liveAvatarRequest(pathname, { method = 'GET', body, apiKey } = {}) {
    const resolvedApiKey = apiKey || liveAvatarKey;
    if (!resolvedApiKey) {
        throw new Error('LIVEAVATAR_API_KEY is not configured on the server.');
    }

    const upstream = await fetch(`${liveAvatarBaseUrl}${pathname}`, {
        method,
        headers: {
            'X-API-KEY': resolvedApiKey,
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    });

    const rawResponse = await upstream.json().catch(() => null);
    if (!upstream.ok) {
        const message = rawResponse?.message || rawResponse?.error?.message || 'LiveAvatar request failed.';
        const error = new Error(`${message}`);
        error.status = upstream.status;
        error.rawResponse = rawResponse;
        throw error;
    }

    return rawResponse;
}

async function stopLiveAvatarSession(sessionId, apiKey) {
    return liveAvatarRequest('/v1/sessions/stop', {
        method: 'POST',
        body: { session_id: sessionId },
        apiKey
    });
}

async function stopActiveLiveAvatarSessions(apiKey) {
    try {
        const list = await liveAvatarRequest('/v1/sessions?type=active', { apiKey });
        const sessions = list?.data?.results || [];
        for (const session of sessions) {
            if (!session?.id || session.is_sandbox === false) continue;
            try {
                await stopLiveAvatarSession(session.id, apiKey);
                console.log('[openai-proxy-server] stopped stale LiveAvatar session', session.id);
            } catch (error) {
                console.warn('[openai-proxy-server] could not stop session', session.id, error?.message);
            }
        }
    } catch (error) {
        console.warn('[openai-proxy-server] could not list active sessions', error?.message);
    }
}

async function handleLiveAvatarStopRequest(request, response) {
    try {
        const rawBody = await readRequestBody(request);
        const body = rawBody ? JSON.parse(rawBody) : {};
        const sessionId = typeof body.sessionId === 'string' ? body.sessionId : '';
        const apiKey = typeof body.apiKey === 'string' && body.apiKey ? body.apiKey : '';
        if (!sessionId) {
            sendJson(response, 400, { error: 'sessionId is required.' });
            return;
        }
        await stopLiveAvatarSession(sessionId, apiKey);
        sendJson(response, 200, { ok: true });
    } catch (error) {
        sendJson(response, error?.status || 500, { error: error?.message || String(error) });
    }
}

async function handleLiveAvatarKeepAliveRequest(request, response) {
    try {
        const rawBody = await readRequestBody(request);
        const body = rawBody ? JSON.parse(rawBody) : {};
        const sessionId = typeof body.sessionId === 'string' ? body.sessionId : '';
        const apiKey = typeof body.apiKey === 'string' && body.apiKey ? body.apiKey : '';
        if (!sessionId) {
            sendJson(response, 400, { error: 'sessionId is required.' });
            return;
        }
        await liveAvatarRequest('/v1/sessions/keep-alive', {
            method: 'POST',
            body: { session_id: sessionId },
            apiKey
        });
        sendJson(response, 200, { ok: true });
    } catch (error) {
        sendJson(response, error?.status || 500, { error: error?.message || String(error) });
    }
}

async function handleLiveAvatarSessionRequest(request, response) {
    try {
        const rawBody = await readRequestBody(request);
        const body = rawBody ? JSON.parse(rawBody) : {};
        const apiKey = typeof body.apiKey === 'string' && body.apiKey ? body.apiKey : '';
        const avatarId = typeof body.avatarId === 'string' ? body.avatarId : '';
        const contextId = typeof body.contextId === 'string' ? body.contextId : '';
        const voiceId = typeof body.voiceId === 'string' ? body.voiceId : '';
        const language = typeof body.language === 'string' && body.language ? body.language : 'en';
        const isSandbox = Boolean(body.isSandbox);
        const prompt = typeof body.instructions === 'string' ? body.instructions : '';
        // Distinguish "not provided" (keep existing) from an explicit "" (suppress the
        // greeting) — a reconnect sends "" so the resumed avatar doesn't re-greet.
        const openingProvided = typeof body.openingText === 'string';
        const openingText = openingProvided ? body.openingText : '';
        const contextName = typeof body.contextName === 'string' ? body.contextName : '';

        if (!avatarId || !contextId || !voiceId) {
            sendJson(response, 400, { error: 'avatarId, contextId, and voiceId are required.' });
            return;
        }

        if (prompt || openingProvided || contextName) {
            // LiveAvatar's context PATCH requires name, prompt, AND opening_text — omitting
            // any one makes the API reject the whole request and kill the session. Fetch the
            // current context and merge the caller's overrides on top so every required field
            // is always present (a caller may legitimately send only a subset).
            const existing = await liveAvatarRequest(`/v1/contexts/${contextId}`, { apiKey });
            const current = existing?.data || existing || {};

            await liveAvatarRequest(`/v1/contexts/${contextId}`, {
                method: 'PATCH',
                body: {
                    name: contextName || current.name || 'Live Avatar Session',
                    prompt: prompt || current.prompt || '',
                    opening_text: openingProvided ? openingText : (current.opening_text || '')
                },
                apiKey
            });
        }

        // One attempt at the full token → start handshake. Throws (with .status /
        // .rawResponse) on any failure so the caller can decide whether to retry.
        const runTokenAndStart = async () => {
            const tokenPayload = await liveAvatarRequest('/v1/sessions/token', {
                method: 'POST',
                body: {
                    mode: 'FULL',
                    avatar_id: avatarId,
                    is_sandbox: isSandbox,
                    avatar_persona: {
                        voice_id: voiceId,
                        context_id: contextId,
                        language
                    }
                },
                apiKey
            });

            const sessionToken = tokenPayload?.session_token || tokenPayload?.data?.session_token;
            const sessionId = tokenPayload?.session_id || tokenPayload?.data?.session_id || null;
            if (!sessionToken) {
                const error = new Error('LiveAvatar did not return a session token.');
                error.status = 502;
                error.rawResponse = tokenPayload;
                throw error;
            }

            const startResponse = await fetch(`${liveAvatarBaseUrl}/v1/sessions/start`, {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${sessionToken}`,
                    'accept': 'application/json'
                }
            });
            const sessionPayload = await startResponse.json().catch(() => null);
            if (!startResponse.ok) {
                const error = new Error(sessionPayload?.message || sessionPayload?.error?.message || 'LiveAvatar session start failed.');
                error.status = startResponse.status;
                error.rawResponse = sessionPayload;
                throw error;
            }
            return { sessionId, tokenPayload, sessionPayload };
        };

        // The sandbox allows a single concurrent session, so a leftover session (dropped
        // renderer, closed tab, crashed test) blocks every new one — and the limit is
        // enforced at the /start step, not /token. On a concurrency failure, clear stale
        // sandbox sessions and retry once. Gated on isSandbox so real sessions are safe.
        let result;
        try {
            result = await runTokenAndStart();
        } catch (error) {
            if (isSandbox && /concurrency/i.test(error?.message || '')) {
                console.log('[openai-proxy-server] concurrency limit hit — clearing stale sessions and retrying.');
                await stopActiveLiveAvatarSessions(apiKey);
                await new Promise(resolve => setTimeout(resolve, 1500));
                result = await runTokenAndStart();
            } else {
                throw error;
            }
        }

        const { sessionId, tokenPayload, sessionPayload } = result;
        const liveKitUrl = sessionPayload?.livekit_url || sessionPayload?.data?.livekit_url || '';
        const liveKitToken = sessionPayload?.livekit_client_token || sessionPayload?.data?.livekit_client_token || '';
        const url = liveKitUrl && liveKitToken
            ? `https://meet.livekit.io/custom?liveKitUrl=${encodeURIComponent(liveKitUrl)}&token=${encodeURIComponent(liveKitToken)}`
            : '';

        sendJson(response, 200, {
            url,
            sessionId,
            liveKitUrl,
            liveKitToken,
            rawResponse: {
                token: tokenPayload,
                session: sessionPayload
            }
        });
    } catch (error) {
        sendJson(response, error?.status || 500, {
            error: error?.message || String(error),
            rawResponse: error?.rawResponse || null
        });
    }
}

async function handleLiveAvatarTranscriptRequest(requestUrl, response) {
    const sessionId = requestUrl.pathname.split('/').pop() || '';
    const apiKey = requestUrl.searchParams.get('apiKey') || '';
    if (!sessionId) {
        sendJson(response, 400, { error: 'Missing session id.' });
        return;
    }

    try {
        const transcriptPayload = await liveAvatarRequest(`/v1/sessions/${sessionId}/transcript`, {
            method: 'GET',
            apiKey
        });
        sendJson(response, 200, transcriptPayload);
    } catch (error) {
        sendJson(response, error?.status || 500, {
            error: error?.message || String(error),
            rawResponse: error?.rawResponse || null
        });
    }
}

function resolveStaticPath(urlPathname) {
    const decodedPath = decodeURIComponent(urlPathname.split('?')[0]);
    let relativePath = decodedPath === '/' ? '/index.html' : decodedPath;
    if (relativePath.endsWith('/')) {
        relativePath = `${relativePath}index.html`;
    }

    const absolutePath = path.resolve(repoRoot, `.${relativePath}`);
    if (!absolutePath.startsWith(repoRoot)) return null;
    return absolutePath;
}

async function handleStaticRequest(urlPathname, response) {
    const absolutePath = resolveStaticPath(urlPathname);
    if (!absolutePath) {
        sendText(response, 403, 'Forbidden');
        return;
    }

    try {
        const file = await fs.readFile(absolutePath);
        const extension = path.extname(absolutePath).toLowerCase();
        const contentType = MIME_TYPES[extension] || 'application/octet-stream';
        response.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-store'
        });
        response.end(file);
    } catch {
        sendText(response, 404, 'Not found');
    }
}

const server = http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url || '/', `http://${request.headers.host || `localhost:${port}`}`);

    if (request.method === 'GET' && requestUrl.pathname === '/api/health') {
        sendJson(response, 200, {
            ok: true,
            model: openAIModel
        });
        return;
    }

    if (request.method === 'POST' && requestUrl.pathname === '/api/chat') {
        await handleChatRequest(request, response);
        return;
    }

    if (request.method === 'POST' && requestUrl.pathname === '/api/liveavatar/session') {
        await handleLiveAvatarSessionRequest(request, response);
        return;
    }

    if (request.method === 'POST' && requestUrl.pathname === '/api/liveavatar/session/stop') {
        await handleLiveAvatarStopRequest(request, response);
        return;
    }

    if (request.method === 'POST' && requestUrl.pathname === '/api/liveavatar/session/keep-alive') {
        await handleLiveAvatarKeepAliveRequest(request, response);
        return;
    }

    if (request.method === 'GET' && requestUrl.pathname.startsWith('/api/liveavatar/transcript/')) {
        await handleLiveAvatarTranscriptRequest(requestUrl, response);
        return;
    }

    if (request.method === 'GET' || request.method === 'HEAD') {
        await handleStaticRequest(requestUrl.pathname, response);
        return;
    }

    sendText(response, 405, 'Method not allowed');
});

server.listen(port, () => {
    console.log(`[openai-proxy-server] Listening on http://localhost:${port}`);
    console.log(`[openai-proxy-server] Live avatar: http://localhost:${port}/demos/live-avatar/live-avatar.html`);
});
