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

    if (request.method === 'GET' || request.method === 'HEAD') {
        await handleStaticRequest(requestUrl.pathname, response);
        return;
    }

    sendText(response, 405, 'Method not allowed');
});

server.listen(port, () => {
    console.log(`[openai-proxy-server] Listening on http://localhost:${port}`);
    console.log(`[openai-proxy-server] Demo: http://localhost:${port}/demos/help-demo.html`);
});
