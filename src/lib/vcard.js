// vCard 3.0 generation for the digital name cards.
//
// 3.0 rather than 4.0 deliberately: iOS, Android and Outlook all import 3.0
// cleanly, whereas 4.0 still trips older Outlook builds — and a name card that
// fails to import on a prospect's machine is worse than a slightly older spec.
//
// Pure functions, no I/O, so this is unit-testable (see test/vcard.test.mjs)
// and safe to import from both the Express server and the browser bundle.

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
