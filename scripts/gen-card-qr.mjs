// Regenerate the name-card QR codes into public/qr-<slug>.svg.
//
//   npm install --no-save qrcode@1 && node scripts/gen-card-qr.mjs
//   # then restore the lockfile: git checkout -- package-lock.json package.json
//
// The QR encodes the CARD PAGE URL, not the raw vCard: scanning opens the card
// so the person can see who it is before saving, and a number can be corrected
// later without reprinting anything that carries the code.
//
// Each code carries the Vorkhive hexagon mark in the centre. To stay scannable
// with the middle occluded we generate at error-correction level H (recovers
// ~30% of the code) and keep the knockout badge conservatively small. After any
// change to qr-lib.mjs, decode-verify the output before committing: rasterise
// the finished SVG and read it back at the card's display size (148px) with a
// QR reader — a logo that grows too large stops scanning, and only decoding the
// composited image catches that.
//
// Output is committed to the repo, so the production build and runtime need no
// QR dependency at all — `qrcode` is only needed to regenerate.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CARDS } from '../src/content/cards.js';
import { buildCardQrSvg } from './qr-lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const BASE = 'https://vorkhive.com';

for (const card of CARDS) {
  const url = `${BASE}/card/${card.slug}`;
  const svg = await buildCardQrSvg(url);
  const out = join(PUBLIC_DIR, `qr-${card.slug}.svg`);
  writeFileSync(out, svg);
  console.log(`wrote ${out}  ->  ${url}`);
}
