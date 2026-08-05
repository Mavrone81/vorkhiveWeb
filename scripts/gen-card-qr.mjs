// Regenerate the name-card QR codes into public/qr-<slug>.svg.
//
//   npx --yes qrcode@1 --version >/dev/null && node scripts/gen-card-qr.mjs
//
// The QR encodes the CARD PAGE URL, not the raw vCard: scanning opens the card
// so the person can see who it is before saving, and a number can be corrected
// later without reprinting anything that carries the code.
//
// Output is committed to the repo, so the production build and runtime need no
// QR dependency at all — `qrcode` is pulled on demand via npx, never installed
// into package.json.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

import { CARDS } from '../src/content/cards.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const BASE = 'https://vorkhive.com';

// Resolve `qrcode` from wherever npx cached it, without adding a repo dependency.
function loadQrcode() {
  const require = createRequire(import.meta.url);
  try {
    return require('qrcode');
  } catch {
    const root = execSync('npm root -g', { encoding: 'utf8' }).trim();
    return createRequire(join(root, 'noop.js'))('qrcode');
  }
}

const QRCode = loadQrcode();

for (const card of CARDS) {
  const url = `${BASE}/card/${card.slug}`;
  const svg = await QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 1,
    color: { dark: '#0E2A4CFF', light: '#00000000' }, // navy on transparent
  });
  const out = join(PUBLIC_DIR, `qr-${card.slug}.svg`);
  writeFileSync(out, svg);
  console.log(`wrote ${out}  ->  ${url}`);
}
