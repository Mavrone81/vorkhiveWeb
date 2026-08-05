// Build a branded name-card QR as a self-contained SVG string:
// navy modules on a transparent ground, with the real Vorkhive hexagon mark
// (from public/logo.png) set in a rounded badge at the centre. Pure string
// assembly so it can be unit-tested.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

import { LOGO_QR_DATA_URI } from '../src/lib/logo-badge.js';

// Brand tokens (kept in step with src/card.css / redesign.css).
const NAVY = '#0E2A4C';
const GOLD = '#B6893F';
const SURFACE = '#FFFFFF'; // the card renders the QR on a white tile

// Resolve `qrcode` (a regen-only dependency, never added to package.json):
// from node_modules if `npm install --no-save qrcode` was run, else globally.
function loadQrcode() {
  const require = createRequire(import.meta.url);
  try {
    return require('qrcode');
  } catch {
    const root = execSync('npm root -g', { encoding: 'utf8' }).trim();
    return createRequire(join(root, 'noop.js'))('qrcode');
  }
}

export async function buildCardQrSvg(data) {
  const QRCode = loadQrcode();

  // Level H recovers ~30% of the code, which buys the room to occlude the
  // centre with a logo. margin:1 keeps the mandatory quiet zone minimal.
  const base = await QRCode.toString(data, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 1,
    color: { dark: `${NAVY}FF`, light: '#00000000' }, // navy on transparent
  });

  // The generated SVG is `<svg ... viewBox="0 0 N N" ...><path .../></svg>`.
  // N = module count + 2 (the margin), and is our coordinate space.
  const N = Number(base.match(/viewBox="0 0 (\d+(?:\.\d+)?) /)[1]);

  // Centre badge. side ≈ 30% of the code → ~9% of area occluded, comfortably
  // inside level-H's headroom, while still large enough to read the mark.
  const side = N * 0.30;
  const pos = (N - side) / 2;
  const rx = side * 0.24;
  const border = Math.max(N * 0.014, 0.35);

  // The logo mark, inset within the badge so it isn't edge-to-edge.
  const logo = side * 0.70;
  const logoPos = (N - logo) / 2;

  const badge =
    `<rect x="${pos}" y="${pos}" width="${side}" height="${side}" rx="${rx}" ` +
    `fill="${SURFACE}" stroke="${GOLD}" stroke-width="${border}" />` +
    `<image href="${LOGO_QR_DATA_URI}" x="${logoPos}" y="${logoPos}" ` +
    `width="${logo}" height="${logo}" preserveAspectRatio="xMidYMid meet" />`;

  return base.replace('</svg>', `${badge}</svg>`);
}
