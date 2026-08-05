// vCard 3.0 generation for the digital name cards.
//
// 3.0 rather than 4.0 deliberately: iOS, Android and Outlook all import 3.0
// cleanly, whereas 4.0 still trips older Outlook builds — and a name card that
// fails to import on a prospect's machine is worse than a slightly older spec.
//
// Pure functions, no I/O, so this is unit-testable (see test/vcard.test.mjs)
// and safe to import from both the Express server and the browser bundle.

import { LOGO_PHOTO_PNG_B64 } from './logo-badge.js';

const CRLF = '\r\n';

// Escape the vCard delimiters. Order matters: backslashes first, or the
// backslashes we introduce below would themselves get escaped again.
function esc(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

// RFC 2426 content-line folding: no line may exceed 75 octets; continuation
// lines begin with a single space. Only the base64 PHOTO needs this — every
// other field here is short and pure of multi-byte surprises. Because base64
// is ASCII, string length equals octet length, so folding on characters is safe.
function fold(line) {
  if (line.length <= 75) return line;
  let out = line.slice(0, 75);
  let rest = line.slice(75);
  while (rest.length) {
    out += CRLF + ' ' + rest.slice(0, 74);
    rest = rest.slice(74);
  }
  return out;
}

export function toVCard(card) {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];

  // N (structured, drives sorting/grouping) and FN (display) are mandatory.
  lines.push(`N:${esc(card.family)};${esc(card.given)};;;`);
  lines.push(`FN:${esc(card.fullName)}`);
  lines.push('ORG:Vorkhive');

  // Everything below is optional — emit nothing rather than an empty field,
  // since some address books render a blank row for `TEL;TYPE=CELL,VOICE:`.
  if (card.title) lines.push(`TITLE:${esc(card.title)}`);
  if (card.phone) lines.push(`TEL;TYPE=CELL,VOICE:${esc(card.phone)}`);
  if (card.email) lines.push(`EMAIL;TYPE=INTERNET,WORK:${esc(card.email)}`);
  if (card.website) lines.push(`URL:${esc(card.website)}`);
  if (card.note) lines.push(`NOTE:${esc(card.note)}`);

  // The Vorkhive hexagon mark as the contact photo. vCard 3.0 inline binary:
  // ENCODING=b, folded to 75-octet lines. Shows as the contact's picture on
  // iOS/Android/Outlook.
  lines.push(fold(`PHOTO;ENCODING=b;TYPE=PNG:${LOGO_PHOTO_PNG_B64}`));

  // WhatsApp is intentionally absent: X-SOCIALPROFILE shows up as a junk row in
  // Outlook, and since the mobile above IS the WhatsApp number, saving the
  // contact already makes the person reachable there. The card page carries the
  // WhatsApp button instead.

  lines.push('END:VCARD');
  return lines.join(CRLF) + CRLF;
}

// Filename for the Content-Disposition header. Kept to [A-Za-z0-9-._] so it
// needs no quoting or escaping in the header, and no encoding on any client.
export function vcardFilename(card) {
  const stem = String(card.fullName || card.slug || 'contact')
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${stem}-Vorkhive.vcf`;
}
