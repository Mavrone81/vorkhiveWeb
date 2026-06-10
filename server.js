import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
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

app.use(express.json({ limit: '2mb' }));

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
Answer visitor questions about Vorkhive's HRMS (leave, claims, attendance, payroll, CPF/MOM/IRAS compliance), highlight relevant benefits for Singapore teams, and guide interested visitors to start free, book a demo, or contact the team. Be warm, concise (2-3 short sentences), and helpful. If you don't know something or the visitor wants a human, share the contact details above. Only discuss Vorkhive and Singapore HR/payroll topics; politely redirect anything off-topic.`;

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

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');

    try {
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

        if (!upstream.ok || !upstream.body) {
            console.error('Ollama responded', upstream.status);
            if (!res.headersSent) res.status(502);
            return res.end('The assistant is unavailable right now.');
        }

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
                    if (obj.message?.content) res.write(obj.message.content);
                } catch { /* ignore partial/non-JSON lines */ }
            }
        }
        res.end();
    } catch (error) {
        console.error('Error in /api/chat:', error);
        if (!res.headersSent) res.status(502);
        res.end('The assistant is unavailable right now. Please email enquires@vorkhive.com.');
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

app.get(/(.*)/, (req, res) => {
    try {
        const content = ssr ? ssr.mergeContent(ssr.defaultContent, readContent()) : null;
        const appHtml = ssr && ssr.render ? ssr.render(req.path, content) : '';
        const stateScript = content
            ? `<script>window.__CONTENT__=${JSON.stringify(content).replace(/</g, '\\u003c')}</script>`
            : '';
        const html = HTML_TEMPLATE
            .replace('<!--app-html-->', appHtml)
            .replace('<!--content-state-->', stateScript);
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
