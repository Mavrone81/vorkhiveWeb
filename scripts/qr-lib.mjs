// Build a branded name-card QR as a self-contained SVG string:
// navy modules on a transparent ground, with the Vorkhive hexagon mark set in
// a rounded badge at the centre. Pure string assembly so it can be unit-tested.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

// Brand tokens (kept in step with src/card.css / redesign.css).
const NAVY = '#0E2A4C';
const GOLD = '#B6893F';
const SURFACE = '#FFFFFF'; // the card renders the QR on a white tile

// The hexagon mark, identical to <HexMark> in src/pages/Shell.jsx so the QR
// badge matches the card masthead exactly. Drawn in a 0 0 48 48 box.
function hexMark(color) {
  return (
    `<g fill="none" stroke="${color}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">` +
    `<polygon points="24,3 42.6,13.5 42.6,34.5 24,45 5.4,34.5 5.4,13.5" />` +
    `<path d="M13 19 L24 27 L35 19" />` +
    `<path d="M13 26 L24 34 L35 26" />` +
    `</g>`
  );
}

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

  // Hexagon inset within the badge, scaled from its native 48-unit box.
  const hexSize = side * 0.64;
  const hexPos = (N - hexSize) / 2;
  const hexScale = hexSize / 48;

  const badge =
    `<rect x="${pos}" y="${pos}" width="${side}" height="${side}" rx="${rx}" ` +
    `fill="${SURFACE}" stroke="${GOLD}" stroke-width="${border}" />` +
    `<g transform="translate(${hexPos} ${hexPos}) scale(${hexScale})">${hexMark(NAVY)}</g>`;

  return base.replace('</svg>', `${badge}</svg>`);
}
