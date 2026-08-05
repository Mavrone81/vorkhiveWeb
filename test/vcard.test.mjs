// vCard generator spec. Run with: node --test
//
// The .vcf is the actual deliverable of the digital name card — if it is
// malformed, the contact silently saves wrong (or not at all) on someone's
// phone and we would never see it. So the format rules get real assertions.
import test from 'node:test';
import assert from 'node:assert/strict';
import { toVCard, vcardFilename } from '../src/lib/vcard.js';
import { CARDS, getCard } from '../src/content/cards.js';

const eugene = getCard('eugene');
const samuel = getCard('samuel');

test('card data covers both people with the agreed details', () => {
  assert.equal(CARDS.length, 2);

  assert.equal(eugene.fullName, 'Eugene Sia');
  assert.equal(eugene.title, 'Chief Executive Officer');
  assert.equal(eugene.phone, '+6587007621');
  assert.equal(eugene.email, 'eugene@vorkhive.com');

  assert.equal(samuel.fullName, 'Samuel Fu');
  assert.equal(samuel.title, 'Chief Technology Officer');
  assert.equal(samuel.phone, '+6586068766');
  assert.equal(samuel.email, 'samuel@vorkhive.com');
});

test('getCard is case-insensitive and returns null for unknown slugs', () => {
  assert.equal(getCard('EUGENE'), eugene);
  assert.equal(getCard('nobody'), null);
  assert.equal(getCard(''), null);
  assert.equal(getCard(undefined), null);
});

test('emits a well-formed vCard 3.0 envelope', () => {
  const vcf = toVCard(eugene);
  assert.match(vcf, /^BEGIN:VCARD\r\n/);
  assert.match(vcf, /\r\nEND:VCARD\r\n$/);
  assert.match(vcf, /\r\nVERSION:3\.0\r\n/);
});

test('every line ends with CRLF, as RFC 6350 requires', () => {
  const vcf = toVCard(samuel);
  // Split on CRLF; no surviving fragment may contain a bare CR or LF.
  for (const line of vcf.split('\r\n')) {
    assert.ok(!line.includes('\n'), `bare LF in: ${JSON.stringify(line)}`);
    assert.ok(!line.includes('\r'), `bare CR in: ${JSON.stringify(line)}`);
  }
});

test('carries the identity fields a phone actually displays', () => {
  const vcf = toVCard(eugene);
  // N is what most address books sort and group by; FN is what they show.
  assert.match(vcf, /\r\nN:Sia;Eugene;;;\r\n/);
  assert.match(vcf, /\r\nFN:Eugene Sia\r\n/);
  assert.match(vcf, /\r\nORG:Vorkhive\r\n/);
  assert.match(vcf, /\r\nTITLE:Chief Executive Officer\r\n/);
});

test('carries reachable contact fields with explicit types', () => {
  const vcf = toVCard(samuel);
  assert.match(vcf, /\r\nTEL;TYPE=CELL,VOICE:\+6586068766\r\n/);
  assert.match(vcf, /\r\nEMAIL;TYPE=INTERNET,WORK:samuel@vorkhive\.com\r\n/);
  assert.match(vcf, /\r\nURL:https:\/\/vorkhive\.com\r\n/);
});

test('omits WhatsApp — it renders as junk in Outlook and CELL already covers it', () => {
  const vcf = toVCard(eugene);
  assert.ok(!/X-SOCIALPROFILE/i.test(vcf));
  assert.ok(!/whatsapp/i.test(vcf));
  assert.ok(!/wa\.me/i.test(vcf));
});

test('escapes the characters that would otherwise break field parsing', () => {
  // Backslash, semicolon and comma are vCard field delimiters: unescaped, a
  // name like "Sia; CEO, Vorkhive" would split into extra structured fields.
  const vcf = toVCard({
    slug: 'test',
    given: 'A,B',
    family: 'C;D',
    fullName: 'Back\\slash',
    title: 'Head, Comma; Semi',
    phone: '+6500000000',
    email: 't@example.com',
    website: 'https://example.com',
    note: 'line1\nline2',
  });
  assert.match(vcf, /\r\nN:C\\;D;A\\,B;;;\r\n/);
  assert.match(vcf, /\r\nFN:Back\\\\slash\r\n/);
  assert.match(vcf, /\r\nTITLE:Head\\, Comma\\; Semi\r\n/);
  // A newline inside a value must become the literal escape \n, not a real break.
  assert.match(vcf, /\r\nNOTE:line1\\nline2\r\n/);
});

test('leaves out fields that have no value rather than emitting empty ones', () => {
  const vcf = toVCard({
    slug: 'minimal',
    given: 'Solo',
    family: '',
    fullName: 'Solo',
    title: '',
    phone: '',
    email: '',
    website: '',
    note: '',
  });
  assert.ok(!/\r\nTITLE:/.test(vcf));
  assert.ok(!/\r\nTEL/.test(vcf));
  assert.ok(!/\r\nEMAIL/.test(vcf));
  assert.ok(!/\r\nURL:/.test(vcf));
  assert.ok(!/\r\nNOTE:/.test(vcf));
  // ...but the mandatory ones survive.
  assert.match(vcf, /\r\nFN:Solo\r\n/);
  assert.match(vcf, /\r\nN:;Solo;;;\r\n/);
});

test('download filename is safe and identifies the person', () => {
  assert.equal(vcardFilename(eugene), 'Eugene-Sia-Vorkhive.vcf');
  assert.equal(vcardFilename(samuel), 'Samuel-Fu-Vorkhive.vcf');
  // No quotes/spaces that would need escaping in a Content-Disposition header.
  assert.ok(!/["\s]/.test(vcardFilename(eugene)));
});
