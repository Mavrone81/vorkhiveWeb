// Digital name cards — the single source of truth for both the card page
// (src/pages/NameCard.jsx) and the .vcf download (server.js). Keeping one
// copy means the page someone reads and the contact they save can't drift.
//
// Plain ESM with no JSX or React import, so the Express server can import it
// directly at runtime as well as the browser bundle.

export const COMPANY = {
  name: 'Vorkhive',
  strapline: 'CRM · HR · PAYROLL',
  tagline: 'The all-in-one HRMS for Singapore',
  website: 'https://vorkhive.com',
  websiteLabel: 'vorkhive.com',
};

export const CARDS = [
  {
    slug: 'eugene',
    given: 'Eugene',
    family: 'Sia',
    fullName: 'Eugene Sia',
    initials: 'ES',
    title: 'Chief Executive Officer',
    phone: '+6587007621',          // tel: / vCard format
    phoneDisplay: '+65 8700 7621', // what the card shows
    whatsapp: '6587007621',        // wa.me format, digits only
    email: 'eugene@vorkhive.com',
    website: COMPANY.website,
    note: 'CRM · HR · Payroll — Singapore HRMS',
  },
  {
    slug: 'samuel',
    given: 'Samuel',
    family: 'Fu',
    fullName: 'Samuel Fu',
    initials: 'SF',
    title: 'Chief Technology Officer',
    phone: '+6586068766',
    phoneDisplay: '+65 8606 8766',
    whatsapp: '6586068766',
    email: 'samuel@vorkhive.com',
    website: COMPANY.website,
    note: 'CRM · HR · Payroll — Singapore HRMS',
  },
];

// Look up a card by slug. Tolerant of case and of a missing/odd value, because
// this runs against whatever a stranger typed into the URL bar.
export function getCard(slug) {
  if (typeof slug !== 'string' || !slug) return null;
  const want = slug.toLowerCase();
  return CARDS.find((c) => c.slug === want) || null;
}
