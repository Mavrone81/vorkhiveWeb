import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import Anthropic from '@anthropic-ai/sdk';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Xendit } from 'xendit-node';
import nodemailer from 'nodemailer';

// Load .env into process.env if present (no-op when real env vars are set, e.g. in prod)
try {
    process.loadEnvFile();
} catch {
    // .env not found — rely on environment variables provided by the host
}

const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.titan.email',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const xenditClient = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4998;
const HOST = '0.0.0.0';
const DATA_FILE = path.join(__dirname, 'contacts.json');

// Token that gates the admin contacts API (set in server-side .env, never committed).
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

// Behind nginx: trust the first proxy hop so req.ip is the real client IP
// (nginx forwards X-Forwarded-For / X-Real-IP), which rate-limiting relies on.
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Restrict cross-origin reads to our own site (same-origin requests still work).
const ALLOWED_ORIGINS = ['https://vorkhive.com', 'https://www.vorkhive.com'];
app.use(cors({
    origin(origin, cb) {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
        return cb(null, false);
    },
}));

// Baseline security headers (nginx passes these through to the client).
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

app.use(express.json({ limit: '2mb', verify: (req, _res, buf) => { req.rawBody = buf; } }));

// Rate limits to curb abuse / API scraping / LLM resource exhaustion.
// Default keyGenerator uses req.ip (real client IP via trust proxy) with
// IPv6-safe normalisation.
app.use('/api/', rateLimit({ windowMs: 60_000, max: 100, standardHeaders: true, legacyHeaders: false }));
const chatLimiter = rateLimit({ windowMs: 60_000, max: 20, standardHeaders: true, legacyHeaders: false });
const contactLimiter = rateLimit({ windowMs: 60_000, max: 6, standardHeaders: true, legacyHeaders: false });

// Require the admin token (Bearer header or ?token=) to read stored contacts.
function requireAdmin(req, res, next) {
    const bearer = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
    const token = bearer || req.query.token || '';
    if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist'), { index: false }));

// Ensure the JSON file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// ---- CMS: editable content + image uploads (persistent, bind-mounted) ------
const CONTENT_FILE = path.join(__dirname, 'content.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

function readContent() {
    try {
        if (!fs.existsSync(CONTENT_FILE)) return {};
        return JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8')) || {};
    } catch {
        return {};
    }
}

// Public: the site reads saved content overrides (merged over code defaults client-side).
app.get('/api/content', (req, res) => {
    res.json(readContent());
});

// Admin: save the full content object.
app.put('/api/content', requireAdmin, (req, res) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({ error: 'Invalid content payload' });
    }
    try {
        fs.writeFileSync(CONTENT_FILE, JSON.stringify(body, null, 2));
        res.json({ ok: true });
    } catch (e) {
        console.error('Error saving content:', e);
        res.status(500).json({ error: 'Failed to save content' });
    }
});

// Serve uploaded images.
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }));

// Admin: image upload (logo / section images).
const ALLOWED_IMG = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']);
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, UPLOAD_DIR),
        filename: (req, file, cb) => {
            const ext = (path.extname(file.originalname) || '').toLowerCase().replace(/[^.a-z0-9]/g, '');
            const base = path.basename(file.originalname, path.extname(file.originalname))
                .toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'img';
            cb(null, `${base}-${Date.now()}${ext}`);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => cb(null, ALLOWED_IMG.has(file.mimetype)),
});
app.post('/api/upload', requireAdmin, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded (png/jpg/webp/gif/svg, max 5MB)' });
    res.json({ url: `/uploads/${req.file.filename}` });
});

// ... rest of the API routes ...

app.post('/api/contact', contactLimiter, async (req, res) => {
    try {
        const newContact = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...req.body
        };

        // Read existing contacts
        const fileData = fs.readFileSync(DATA_FILE, 'utf8');
        const contacts = JSON.parse(fileData);

        // Add new contact
        contacts.push(newContact);

        // Save back to file
        fs.writeFileSync(DATA_FILE, JSON.stringify(contacts, null, 2));

        console.log('New contact saved:', newContact.email);

        const { name, email, company, employees, message } = newContact;
        await mailer.sendMail({
            from: '"Vorkhive Website" <Dev@vorkhive.com>',
            to: 'samuel@vorkhive.com, enquires@vorkhive.com',
            subject: `New Free Trial Request from ${name} (${company})`,
            text: `New free trial request received.\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\nCompany Size: ${employees || 'Not specified'}\nMessage:\n${message || 'None'}\n\nSubmitted: ${newContact.timestamp}`,
            html: `<h2>New Free Trial Request</h2><table style="border-collapse:collapse;width:100%"><tr><td style="padding:8px;border:1px solid #ddd"><strong>Name</strong></td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Company</strong></td><td style="padding:8px;border:1px solid #ddd">${company}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Company Size</strong></td><td style="padding:8px;border:1px solid #ddd">${employees || 'Not specified'}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Message</strong></td><td style="padding:8px;border:1px solid #ddd">${message || 'None'}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Submitted</strong></td><td style="padding:8px;border:1px solid #ddd">${newContact.timestamp}</td></tr></table>`
        });
        console.log('Notification email sent to samuel@vorkhive.com, enquires@vorkhive.com');

        res.status(201).json({ message: 'Contact saved successfully', id: newContact.id });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Failed to save contact information' });
    }
});

// Admin endpoint to read contacts (token-protected; was previously public).
app.get('/api/contacts', requireAdmin, (req, res) => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return res.json([]);
        }
        const fileData = fs.readFileSync(DATA_FILE, 'utf8');
        const contacts = JSON.parse(fileData);

        // Sort newest first
        contacts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// Create Xendit Invoice Session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const origin = req.headers.origin || `http://localhost:${PORT}`;
        const invoiceData = {
            externalId: `vorkhive-trial-${Date.now()}`,
            amount: 29, 
            currency: 'USD',
            description: 'Vorkhive Pro Plan Trial (First Month)',
            successRedirectUrl: `${origin}/success`,
            failureRedirectUrl: `${origin}/contact`,
            customer: {
                givenNames: req.body?.name || 'Customer',
                email: req.body?.email || 'customer@example.com'
            }
        };

        const response = await xenditClient.Invoice.createInvoice({ data: invoiceData });

        // Return the required invoice URL for the frontend to redirect
        res.json({ url: response.invoiceUrl });
    } catch (error) {
        console.error('Error creating Xendit invoice:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- AI chat bot (sales & support), backed by local Ollama -----------------
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://host.docker.internal:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:1.5b';
const OLLAMA_KEEPALIVE = process.env.OLLAMA_KEEPALIVE || '15m';

// Build the prompt fresh each request so contact details stay in sync with the
// content the admin edits (single source of truth).
function buildSystemPrompt() {
    const c = readContent();
    const ct = (c && c.contact) || {};
    const phone = ct.phone || '+6587007621';
    const wa = ct.whatsapp ? `+${String(ct.whatsapp).replace(/\D/g, '')}` : '+6587007621';
    const e1 = ct.email1 || 'samuel@vorkhive.com';
    const e2 = ct.email2 || 'enquires@vorkhive.com';
    return SYSTEM_PROMPT_HEAD + `

CONTACT THE TEAM
- Phone: ${phone}
- WhatsApp: ${wa}
- Email: ${e1} or ${e2}
` + SYSTEM_PROMPT_TAIL;
}

const SYSTEM_PROMPT_HEAD = `You are Vorka, the friendly sales and support assistant for Vorkhive (https://vorkhive.com).

ABOUT VORKHIVE
Vorkhive is the all-in-one, Singapore-compliant HRMS (HR Management System). It runs leave, claims, attendance, payroll and CPF compliance from one platform, with employee self-service your whole team actually enjoys using. MOM-ready out of the box. Most teams are live within a day and cut HR admin by about 40%.
Key capabilities:
- Leave & self-service: staff apply for leave, view balances, submit claims, view payslips and browse the staff directory themselves — MOM-aligned entitlements.
- Singapore payroll with CPF: employer & employee CPF contributions calculated automatically, digital payslips, IRAS-ready year-end filing (IR8A).
- Time & growth: attendance, schedules, training records, appraisals and surveys.
- Secure: bank-grade encryption, SOC 2, 99.99% uptime.

PRICING (per user / month, in SGD; free to start, no credit card)
- Starter: S$5/user/month — leave, staff directory, claims & attendance (up to 5 users).
- Growth: S$9/user/month (most popular) — unlimited users, full payroll with CPF, IRAS export, training & appraisals.
- Enterprise: S$15/user/month — everything in Growth plus SSO, dedicated success manager and full API access.
Visitors can start free or book a demo on the Contact page (/contact). Existing customers log in at https://app.vorkhive.com.`;

const SYSTEM_PROMPT_TAIL = `YOUR JOB
Answer visitor questions about Vorkhive's HRMS (leave, claims, attendance, payroll, CPF/MOM/IRAS compliance), highlight relevant benefits for Singapore teams, and guide interested visitors to start free, book a demo, or contact the team. Be warm, concise (2-3 short sentences), and helpful. If you don't know something or the visitor wants a human, share the contact details above. Only discuss Vorkhive and Singapore HR/payroll topics; politely redirect anything off-topic.

Reply in plain conversational text. Do NOT use markdown formatting — no **bold**, no #headings, no bullet asterisks, no backticks. Write prices and details inline in normal sentences.`;

// ---- Live human handoff via Slack -----------------------------------------
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || '';
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET || '';
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID || '';
const slackEnabled = !!(SLACK_BOT_TOKEN && SLACK_CHANNEL_ID);

// In-memory conversation state (single-process app). sessionId -> conversation;
// threadIndex maps a Slack thread back to its session.
const convos = new Map();
const threadIndex = new Map();
const CONVO_TTL_MS = 2 * 60 * 60 * 1000;
function getConvo(id) {
    let c = convos.get(id);
    if (!c) { c = { id, mode: 'bot', threadTs: null, agentMsgs: [], lastSeen: Date.now() }; convos.set(id, c); }
    c.lastSeen = Date.now();
    return c;
}
setInterval(() => {
    const now = Date.now();
    for (const [id, c] of convos) {
        if (now - c.lastSeen > CONVO_TTL_MS) { convos.delete(id); if (c.threadTs) threadIndex.delete(c.threadTs); }
    }
}, 10 * 60 * 1000).unref?.();

async function slackPost(text, threadTs) {
    const r = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8', Authorization: `Bearer ${SLACK_BOT_TOKEN}` },
        body: JSON.stringify({ channel: SLACK_CHANNEL_ID, text, thread_ts: threadTs }),
    });
    const j = await r.json();
    if (!j.ok) throw new Error(`Slack ${j.error}`);
    return j.ts;
}
function verifySlackSignature(req) {
    if (!SLACK_SIGNING_SECRET) return false;
    const ts = req.get('x-slack-request-timestamp');
    const sig = req.get('x-slack-signature') || '';
    if (!ts || Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
    const base = `v0:${ts}:${req.rawBody ? req.rawBody.toString('utf8') : ''}`;
    const mine = 'v0=' + crypto.createHmac('sha256', SLACK_SIGNING_SECRET).update(base).digest('hex');
    try { return crypto.timingSafeEqual(Buffer.from(mine), Buffer.from(sig)); } catch { return false; }
}

// Claude API (preferred): fast, high quality. Falls back to local Ollama if the
// key is unset or the API errors before any text streams.
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-4-5';
const anthropic = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null;

// Self-tracked Claude usage tally (persisted) powering the admin readout.
const USAGE_FILE = path.join(__dirname, 'usage.json');
const MODEL_PRICES = { // USD per 1M tokens: [input, output]
    'claude-haiku-4-5': [1, 5],
    'claude-sonnet-4-6': [3, 15],
    'claude-opus-4-8': [5, 25],
};
function readUsage() {
    try { return JSON.parse(fs.readFileSync(USAGE_FILE, 'utf8')) || {}; } catch { return {}; }
}
function recordUsage(inTok, outTok) {
    try {
        const u = readUsage();
        const month = new Date().toISOString().slice(0, 7); // YYYY-MM (UTC)
        const m = u[month] || (u[month] = { messages: 0, inputTokens: 0, outputTokens: 0 });
        m.messages += 1;
        m.inputTokens += inTok || 0;
        m.outputTokens += outTok || 0;
        fs.writeFileSync(USAGE_FILE, JSON.stringify(u));
    } catch (e) { console.error('usage write:', e.message); }
}

async function streamClaude(history, write) {
    const stream = anthropic.messages.stream({
        model: CLAUDE_MODEL,
        max_tokens: 400,
        system: buildSystemPrompt(),
        messages: history.map((m) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
        })),
    });
    stream.on('text', (t) => write(t));
    const final = await stream.finalMessage();
    if (final?.usage) recordUsage(final.usage.input_tokens, final.usage.output_tokens);
}

async function streamOllama(history, write) {
    const upstream = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            stream: true,
            keep_alive: OLLAMA_KEEPALIVE,
            messages: [{ role: 'system', content: buildSystemPrompt() }, ...history],
            options: { temperature: 0.4, num_predict: 220, num_ctx: 2048 },
        }),
    });
    if (!upstream.ok || !upstream.body) throw new Error(`Ollama responded ${upstream.status}`);

    // Ollama streams newline-delimited JSON; forward only the text content.
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buffer.indexOf('\n')) >= 0) {
            const line = buffer.slice(0, nl).trim();
            buffer = buffer.slice(nl + 1);
            if (!line) continue;
            try {
                const obj = JSON.parse(line);
                if (obj.message?.content) write(obj.message.content);
            } catch { /* ignore partial/non-JSON lines */ }
        }
    }
}

app.post('/api/chat', chatLimiter, async (req, res) => {
    const incoming = Array.isArray(req.body?.messages) ? req.body.messages : [];
    // Keep the last 10 turns, sanitise roles/content, cap length.
    const history = incoming.slice(-10).map((m) => ({
        role: m?.role === 'assistant' ? 'assistant' : 'user',
        content: String(m?.content ?? '').slice(0, 2000),
    })).filter((m) => m.content);

    if (!history.length) {
        return res.status(400).json({ error: 'No message provided' });
    }

    // If a human has taken over this conversation, relay the message to the
    // Slack thread instead of answering with the bot.
    const sessionId = String(req.body?.sessionId || '').slice(0, 64);
    if (sessionId && slackEnabled) {
        const c = convos.get(sessionId);
        if (c && c.mode === 'human' && c.threadTs) {
            const last = history[history.length - 1];
            if (last && last.role === 'user') {
                slackPost(`💬 Visitor: ${last.content}`, c.threadTs).catch((e) => console.error('relay error:', e.message));
            }
            return res.status(204).end();
        }
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');

    let wroteAny = false;
    const write = (t) => { if (t) { wroteAny = true; res.write(t); } };

    // 1) Try Claude first.
    if (anthropic) {
        try {
            await streamClaude(history, write);
            return res.end();
        } catch (error) {
            console.error('Claude API error, falling back to Ollama:', error?.message || error);
            if (wroteAny) return res.end(); // partial output already sent; can't restart
        }
    }

    // 2) Fall back to local Ollama.
    try {
        await streamOllama(history, write);
        res.end();
    } catch (error) {
        console.error('Error in /api/chat:', error);
        if (!res.headersSent) res.status(502);
        res.end('The assistant is unavailable right now. Please email enquires@vorkhive.com.');
    }
});

// Admin: self-tracked Claude API usage + estimated cost (Console is authoritative).
app.get('/api/usage', requireAdmin, (req, res) => {
    const u = readUsage();
    const [pin, pout] = MODEL_PRICES[CLAUDE_MODEL] || MODEL_PRICES['claude-haiku-4-5'];
    const rows = Object.keys(u)
        .filter((k) => /^\d{4}-\d{2}$/.test(k))
        .sort().reverse()
        .map((month) => {
            const m = u[month];
            const estCost = (m.inputTokens / 1e6) * pin + (m.outputTokens / 1e6) * pout;
            return { month, messages: m.messages, inputTokens: m.inputTokens, outputTokens: m.outputTokens, estCost };
        });
    res.json({ model: CLAUDE_MODEL, prices: { input: pin, output: pout }, rows });
});

// ---- Human handoff endpoints ----------------------------------------------
// Visitor requests a human: open (or reuse) a Slack thread with the transcript.
app.post('/api/handoff', async (req, res) => {
    const sessionId = String(req.body?.sessionId || '').slice(0, 64);
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    if (!slackEnabled) return res.json({ ok: false, fallback: true });
    const c = getConvo(sessionId);
    try {
        if (!c.threadTs) {
            const hist = Array.isArray(req.body?.messages) ? req.body.messages.slice(-12) : [];
            const transcript = hist
                .map((m) => `${m.role === 'assistant' ? 'Bot' : 'Visitor'}: ${String(m.content || '').slice(0, 500)}`)
                .join('\n');
            const header = `:large_green_circle: New website chat needs a human.\nReply *in this thread* to talk to the visitor live.\n\n${transcript || '(no messages yet)'}`;
            c.threadTs = await slackPost(header);
            threadIndex.set(c.threadTs, sessionId);
        }
        c.mode = 'human';
        res.json({ ok: true });
    } catch (e) {
        console.error('handoff error:', e.message);
        res.status(502).json({ ok: false, fallback: true });
    }
});

// Widget polls for new agent (human) messages since `cursor`.
app.get('/api/poll', (req, res) => {
    const sessionId = String(req.query.sessionId || '').slice(0, 64);
    const cursor = Math.max(0, parseInt(req.query.cursor, 10) || 0);
    const c = convos.get(sessionId);
    if (!c) return res.json({ mode: 'bot', messages: [], cursor: 0 });
    c.lastSeen = Date.now();
    res.json({ mode: c.mode, messages: c.agentMsgs.slice(cursor), cursor: c.agentMsgs.length });
});

// Slack Events API: a human reply in the thread -> deliver to the visitor.
app.post('/api/slack/events', (req, res) => {
    const body = req.body || {};
    if (body.type === 'url_verification') return res.json({ challenge: body.challenge });
    if (!verifySlackSignature(req)) return res.status(401).end();
    res.json({ ok: true }); // ack within Slack's 3s window
    try {
        const e = body.event;
        if (!e || e.type !== 'message' || e.bot_id || e.subtype) return; // ignore bot/system/edits
        const threadTs = e.thread_ts;
        if (!threadTs) return;
        const sessionId = threadIndex.get(threadTs);
        const c = sessionId && convos.get(sessionId);
        if (!c) return;
        const text = String(e.text || '').trim();
        if (!text) return;
        c.agentMsgs.push({ text });
        c.lastSeen = Date.now();
    } catch (err) {
        console.error('slack event error:', err.message);
    }
});

// SSR: render each page on request with the live (admin-edited) content so
// crawlers and the first paint get the real, current content. Falls back to a
// client-rendered shell if the SSR bundle is unavailable or rendering throws.
const DIST = path.join(__dirname, 'dist');
let HTML_TEMPLATE = '<!doctype html><html><head><!--content-state--></head><body><div id="root"><!--app-html--></div><script type="module" src="/assets/main.js"></script></body></html>';
try { HTML_TEMPLATE = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8'); } catch (e) { console.error('index.html template not found:', e.message); }
// Load the SSR bundle without blocking startup (avoids top-level await).
let ssr = null;
import('./dist-ssr/entry-server.js')
    .then((m) => { ssr = m; console.log('SSR bundle loaded'); })
    .catch((e) => console.error('SSR bundle not available, using client-render fallback:', e.message));

// Per-route SEO (unique title/meta/canonical + FAQ schema) for content pages.
const ROUTE_SEO = {
    '/payroll-singapore': {
        title: 'Singapore Payroll Software with CPF | Vorkhive HRMS',
        description: 'Run Singapore payroll with CPF calculated automatically, digital payslips and IRAS-ready (IR8A) filing. MOM-ready payroll software from Vorkhive.',
        canonical: 'https://vorkhive.com/payroll-singapore',
        faq: [
            ['Does Vorkhive calculate CPF automatically?', 'Yes. Employer and employee CPF contributions are calculated automatically on every payroll run, and appear on each digital payslip.'],
            ['Is Vorkhive payroll IRAS compliant?', 'Vorkhive produces IRAS-ready year-end reporting (IR8A), so filing is straightforward.'],
            ['How long does setup take?', 'Most Singapore teams are live within a day and run their first CPF-compliant payroll the same week.'],
        ],
    },
    '/cpf-payroll': {
        title: 'CPF Payroll Software — Automatic CPF Calculation | Vorkhive',
        description: 'CPF payroll software that calculates employer and employee CPF automatically on every run, with compliant payslips and IRAS-ready (IR8A) reporting.',
        canonical: 'https://vorkhive.com/cpf-payroll',
        faq: [
            ['Does Vorkhive calculate both employer and employee CPF?', 'Yes — both are calculated automatically on every payroll run.'],
            ['Do I need to update CPF rates myself?', 'No. Vorkhive keeps CPF handling aligned with current rules without manual table updates.'],
            ['Is the CPF data used for IRAS filing?', 'Yes. The same payroll data flows into IRAS-ready year-end reporting (IR8A).'],
        ],
    },
};
const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => escHtml(s).replace(/"/g, '&quot;');
function applyRouteSeo(html, route) {
    const s = ROUTE_SEO[route];
    if (!s) return html;
    const faqJson = s.faq
        ? JSON.stringify({
            '@context': 'https://schema.org', '@type': 'FAQPage',
            mainEntity: s.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
        }).replace(/</g, '\\u003c')
        : '';
    return html
        .replace(/<title>[^<]*<\/title>/, `<title>${escHtml(s.title)}</title>`)
        .replace(/(<meta name="description" content=")[^"]*(")/, `$1${escAttr(s.description)}$2`)
        .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${s.canonical}$2`)
        .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escAttr(s.title)}$2`)
        .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escAttr(s.description)}$2`)
        .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${s.canonical}$2`)
        .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${escAttr(s.title)}$2`)
        .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${escAttr(s.description)}$2`)
        .replace('</head>', `${faqJson ? `<script type="application/ld+json">${faqJson}</script>` : ''}</head>`);
}

app.get(/(.*)/, (req, res) => {
    try {
        const content = ssr ? ssr.mergeContent(ssr.defaultContent, readContent()) : null;
        const appHtml = ssr && ssr.render ? ssr.render(req.path, content) : '';
        const stateScript = content
            ? `<script>window.__CONTENT__=${JSON.stringify(content).replace(/</g, '\\u003c')}</script>`
            : '';
        const html = applyRouteSeo(
            HTML_TEMPLATE
                .replace('<!--app-html-->', appHtml)
                .replace('<!--content-state-->', stateScript),
            req.path,
        );
        res.set('Content-Type', 'text/html; charset=utf-8').send(html);
    } catch (e) {
        console.error('SSR render error:', e);
        res.set('Content-Type', 'text/html; charset=utf-8')
            .send(HTML_TEMPLATE.replace('<!--app-html-->', '').replace('<!--content-state-->', ''));
    }
});

app.listen(PORT, HOST, () => {
    console.log(`Unified server running at http://${HOST}:${PORT}`);
    console.log(`Serving static files from ${path.join(__dirname, 'dist')}`);
    console.log(`Saving contacts to ${DATA_FILE}`);
});
