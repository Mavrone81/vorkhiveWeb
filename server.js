import express from 'express';
import cors from 'cors';
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

app.use(cors());
app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Ensure the JSON file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// ... rest of the API routes ...

app.post('/api/contact', async (req, res) => {
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

// Admin endpoint to read contacts
app.get('/api/contacts', (req, res) => {
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

const SYSTEM_PROMPT = `You are Vorka, the friendly sales and support assistant for Vorkhive (https://vorkhive.com).

ABOUT VORKHIVE
Vorkhive is an all-in-one cloud platform that helps teams automate workflows, manage tasks and people, and track real-time analytics from a single dashboard. Customers save about 40% of their time on average.
Key features:
- No-code workflow automation ("if this, then that" rules, no coding required).
- Task & team management: assign work, set deadlines, track progress in one shared space.
- Real-time analytics dashboards: KPIs, team velocity, bottlenecks at a glance.
- Secure cloud: enterprise-grade encryption, SOC2-compliant, 99.99% uptime.

PRICING (per user / month, free trial, no credit card required)
- Starter: $5/user/month.
- Pro: $9/user/month (most popular).
- Business: $15/user/month.
Visitors can start a free trial or book a demo on the Contact page (/contact). Existing customers log in at https://app.vorkhive.com.

CONTACT THE TEAM
- Phone: 8969 0872
- WhatsApp: +65 8886 6506
- Email: Samuel@vorkhive.com or enquires@vorkhive.com

YOUR JOB
Answer visitor questions about Vorkhive, highlight relevant benefits, and guide interested visitors to start a free trial, book a demo, or contact the team. Be warm, concise (2-3 short sentences), and helpful. If you don't know something or the visitor wants a human, share the contact details above. Only discuss Vorkhive and related topics; politely redirect anything off-topic.`;

app.post('/api/chat', async (req, res) => {
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
                messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
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

// Handle SPA routing: ALWAYS serve index.html for non-API routes
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, HOST, () => {
    console.log(`Unified server running at http://${HOST}:${PORT}`);
    console.log(`Serving static files from ${path.join(__dirname, 'dist')}`);
    console.log(`Saving contacts to ${DATA_FILE}`);
});
