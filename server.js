import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Xendit } from 'xendit-node';

const xenditClient = new Xendit({
    secretKey: 'xnd_development_MockXenditSecretKeyForVorkhiveDemo123456789'
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

app.post('/api/contact', (req, res) => {
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

// Handle SPA routing: ALWAYS serve index.html for non-API routes
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, HOST, () => {
    console.log(`Unified server running at http://${HOST}:${PORT}`);
    console.log(`Serving static files from ${path.join(__dirname, 'dist')}`);
    console.log(`Saving contacts to ${DATA_FILE}`);
});
