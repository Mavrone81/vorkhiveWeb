// Default site content. This is what ships in the build and gets prerendered
// (so SEO/first paint always works). The admin saves overrides to content.json
// on the server; the ContentProvider merges those over these defaults at runtime.
export const defaultContent = {
  branding: {
    brandName: 'Vorkhive',
    brandTag: 'SG COMPLIANCE · V2',
    logoImage: '', // empty -> show the "V" mark; otherwise an uploaded image URL
  },
  seo: {
    title: 'Vorkhive — Singapore HR & Payroll Software (HRMS)',
    description: 'The all-in-one HRMS for Singapore. Run leave, claims, attendance, payroll and CPF compliance in one platform. MOM-ready. Start free — no card.',
  },
  ui: {
    nav: { platform: 'Platform', features: 'Features', pricing: 'Pricing', faq: 'FAQ', customers: 'Customers' },
    signIn: 'Sign in',
    startFree: 'Start free',
    language: 'Language',
  },
  contact: {
    phone: '+6587007621',     // tel: format
    whatsapp: '6587007621',   // wa.me format (digits only)
    email1: 'samuel@vorkhive.com',
    email2: 'enquires@vorkhive.com',
  },
  hero: {
    eyebrow: 'HR · Payroll · CPF Compliance',
    headlineLead: 'HR & payroll software built for ',
    headlineAccent: 'Singapore teams.',
    subtitle: 'Vorkhive is the all-in-one HRMS for Singapore. Run leave, claims, attendance, payroll and CPF compliance from one platform — with employee self-service your whole team actually enjoys using. MOM-ready out of the box.',
    ctaPrimary: 'Start free — no card needed',
    ctaSecondary: 'Book a 15-min demo',
    trustLine: 'CPF & MOM compliant · Bank-grade security · Live in a day',
  },
  logos: {
    caption: 'Trusted by 10,000+ teams across Singapore & the region',
    items: ['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella'],
  },
  intro: {
    heading: 'What is Vorkhive?',
    body1: 'Vorkhive is a Singapore-compliant HR management system (HRMS) that brings leave, claims, attendance, payroll and CPF compliance together in a single platform. Instead of juggling email approvals, paper claim forms and a payroll spreadsheet, Singapore SMEs run their entire people operation from one login — with employee self-service for staff and automatic CPF calculations for HR.',
    body2: 'Explore the platform by area: leave management, claims, payroll & CPF, and attendance.',
  },
  problem: {
    eyebrow: 'The HR admin trap',
    heading: 'Leave on email. Claims on paper. Payroll in a spreadsheet.',
    sub: 'When every HR task lives somewhere different, compliance gets risky, staff chase HR for answers, and payroll day becomes a scramble.',
    items: [
      { icon: '📨', title: 'Leave stuck in inboxes', text: "Approvals get lost in email, balances live in someone's head, and nobody knows who's off next week." },
      { icon: '🧾', title: 'Claims on paper', text: 'Receipts pile up, reimbursements slip, and finance reconciles everything by hand at month end.' },
      { icon: '⚠️', title: 'CPF & compliance risk', text: 'CPF contributions, MOM leave rules and IRAS filing are easy to get wrong when payroll runs off a manual spreadsheet.' },
    ],
  },
  pillars: {
    eyebrow: 'One HRMS, every HR job',
    heading: 'Leave, claims, payroll & CPF in one platform',
    sub: 'Add an employee once and everything connects — attendance, leave, claims and pay all run off the same record.',
    items: [
      { tag: 'People & Leave', icon: '🌴', title: 'Leave management & self-service', text: 'Staff apply for leave, view balances and browse the directory themselves — no HR back-and-forth.', bullets: ['MOM-aligned leave entitlements', 'Approvals & balances in real time', 'Staff directory & profiles'], moreLabel: 'See self-service →' },
      { tag: 'Payroll & Claims', icon: '💰', title: 'Singapore payroll with CPF', text: 'Run payroll with CPF calculated automatically, and let staff submit expense claims from their phone.', bullets: ['Automatic CPF calculations', 'Digital payslips & IRAS-ready filing', 'Expense claims & approvals'], moreLabel: 'See compliance →' },
      { tag: 'Time & Growth', icon: '📈', title: 'Attendance, training & appraisals', text: 'Capture attendance, manage schedules, and keep training and performance reviews in one place.', bullets: ['Attendance & schedules', 'Training records', 'Appraisals & surveys'], moreLabel: 'See pricing →' },
    ],
  },
  features: {
    heading: 'Why Singapore teams choose Vorkhive',
    items: [
      { eyebrow: 'Employee self-service', title: 'One app for every HR request', text: 'From the Command Centre, every employee applies for leave, submits a claim, views payslips, clocks attendance and completes training — without raising a single ticket to HR.', bullets: ['One dashboard, every HR action', 'Mobile-first, zero training needed', 'HR workload drops overnight'] },
      { eyebrow: 'Singapore compliance', title: 'CPF, MOM & IRAS handled for you', text: 'Vorkhive keeps CPF contributions, statutory leave and IRAS filing aligned with Singapore requirements — so you run payroll with confidence instead of cross-checking circulars.', bullets: ['CPF contributions auto-calculated', 'MOM-aligned leave policies', 'IRAS-ready year-end reporting (IR8A)'] },
    ],
  },
  metrics: [
    { num: '40%', lab: 'Less HR admin' },
    { num: '1 day', lab: 'Average setup time' },
    { num: '10k+', lab: 'Teams onboard' },
    { num: '99.99%', lab: 'Platform uptime' },
  ],
  steps: {
    eyebrow: 'Get started',
    heading: 'Set up your HRMS in three steps',
    sub: 'No lengthy implementation, no consultants. Most Singapore teams are live within a day.',
    items: [
      { title: 'Import your staff', text: 'Bring your team in from a spreadsheet and set leave entitlements in a few clicks.' },
      { title: 'Switch on self-service', text: 'Employees apply for leave, submit claims and view payslips from day one.' },
      { title: 'Run compliant payroll', text: 'Process pay with CPF handled automatically — and hand HR its time back.' },
    ],
  },
  testimonials: {
    eyebrow: 'Loved by HR teams',
    heading: 'Singapore teams that ditched the spreadsheets',
    items: [
      { quote: 'Leave and claims used to be a daily email pile. Now staff self-serve and our HR exec got a full day back every week.', initials: 'SK', name: 'Sarah Kline', role: 'Ops Director, VibeMedia' },
      { quote: 'Payroll with CPF used to terrify me. Vorkhive calculates it automatically and the payslips just go out. It’s a ten-minute job now.', initials: 'MJ', name: 'Marcus Johnson', role: 'Founder, ScaleUp Tech' },
      { quote: 'The team adopted it in days — it feels like a consumer app, not a clunky HR system. Onboarding new hires is effortless.', initials: 'EP', name: 'Elena Patel', role: 'VP of People, CloudSync' },
    ],
  },
  pricing: {
    eyebrow: 'Pricing',
    heading: 'HRMS pricing for Singapore teams',
    sub: "One platform for leave, claims, attendance and payroll — for less than you'd pay for any one of them.",
    plans: [
      { name: 'Starter', desc: 'For small teams putting HR on autopilot.', price: 'S$5', period: ' /user / mo', featured: false, badge: '', bullets: ['Up to 5 users', 'Leave & staff directory', 'Claims & attendance', 'Community support'], cta: 'Start free', ctaTo: 'register' },
      { name: 'Growth', desc: 'For growing teams that need payroll & compliance.', price: 'S$6', period: ' /user / mo', featured: true, badge: 'Most popular', bullets: ['Unlimited users', 'Full payroll with CPF', 'Digital payslips & IRAS export', 'Training & appraisals', 'Priority support'], cta: 'Start 14-day trial', ctaTo: 'register' },
      { name: 'Enterprise', desc: 'Advanced security and control for larger organizations.', price: 'S$12', period: ' /user / mo', featured: false, badge: '', bullets: ['Everything in Growth', 'Single Sign-On (SSO)', 'Dedicated success manager', 'Full API access'], cta: 'Contact sales', ctaTo: 'contact' },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    heading: 'Frequently asked questions',
    sub: 'Common questions about running HR and payroll on Vorkhive in Singapore.',
    items: [
      { q: 'Is Vorkhive compliant with Singapore employment regulations?', a: 'Yes. Vorkhive handles CPF calculations, MOM-aligned leave entitlements and IRAS-ready payroll reporting, so your HR stays compliant with Singapore requirements.' },
      { q: 'What HR tasks can employees do themselves?', a: 'Through self-service, employees apply for leave, submit claims, view payslips, clock attendance, complete training and update their profile — all from one dashboard.' },
      { q: 'How long does it take to set up Vorkhive?', a: 'Most teams are live within a day. You import your staff directory, set leave entitlements and run your first CPF-compliant payroll the same week.' },
      { q: 'Does Vorkhive calculate CPF automatically?', a: 'Yes. Vorkhive calculates employer and employee CPF contributions automatically on every payroll run and produces digital payslips ready for IRAS filing.' },
      { q: 'How much does Vorkhive cost?', a: 'Vorkhive starts at S$5 per user per month (Starter). The Growth plan is S$6 per user per month and includes full payroll with CPF; Enterprise is S$12 per user per month.' },
    ],
  },
  finalCta: {
    heading: 'Give your HR team its time back',
    sub: 'Join 10,000+ teams running leave, claims, payroll and CPF compliance on one HRMS built for Singapore.',
    ctaPrimary: 'Start free — no card needed',
    ctaSecondary: 'Book a demo',
    trustLine: 'No credit card required · Cancel anytime',
  },
  footer: {
    brandText: 'The Singapore-compliant HRMS for leave, claims, attendance and payroll. Run all of HR from one login.',
    columns: [
      { title: 'Platform', links: [{ label: 'Singapore payroll', href: '/payroll-singapore' }, { label: 'CPF payroll', href: '/cpf-payroll' }, { label: 'Leave management', href: '/#platform' }, { label: 'Attendance', href: '/#platform' }, { label: 'Pricing', href: '/#pricing' }] },
      { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Contact', href: '/contact' }] },
      { title: 'Resources', links: [{ label: 'Help center', href: '#' }, { label: 'Security', href: '#' }, { label: 'Status', href: '#' }, { label: 'CPF guide', href: '/cpf-payroll' }] },
    ],
    copyright: '© 2026 Vorkhive, Inc. · Singapore. All rights reserved.',
    legal: 'Privacy · Terms · SOC 2 Type II',
  },
  pages: {
    payroll: {
      seo: { title: 'Singapore Payroll Software with CPF | Vorkhive HRMS', description: 'Run Singapore payroll with CPF calculated automatically, digital payslips and IRAS-ready (IR8A) filing. MOM-ready payroll software from Vorkhive.' },
      eyebrow: 'Singapore Payroll',
      h1: 'Singapore payroll software with CPF built in',
      lede: 'Run accurate, MOM-ready payroll for your Singapore team — with CPF contributions calculated automatically, digital payslips, and IRAS-ready year-end filing. No spreadsheets, no manual CPF tables.',
      ctaPrimary: 'Start free — no card needed', ctaSecondary: 'Book a 15-min demo',
      sections: [
        { h2: 'Payroll built for Singapore, not retrofitted', body: ['Most payroll tools treat Singapore as an afterthought. Vorkhive is a Singapore-compliant HRMS first: every pay run accounts for CPF, statutory leave and IRAS reporting the way local regulations expect. Add an employee once and their salary, leave, claims and attendance all feed the same payroll record.'] },
        { h2: 'CPF calculated automatically on every run', body: ['Vorkhive computes both employer and employee CPF contributions for you on each payroll run, so you never maintain contribution tables or worry about wage ceilings and age bands by hand.'], bullets: ['Employer and employee CPF computed on every pay run', 'Ordinary and additional wage handled correctly', 'Itemised digital payslips employees can self-serve'] },
        { h2: 'IRAS-ready filing and digital payslips', body: ['At year end, Vorkhive produces IRAS-ready reporting (IR8A) so submission is a few clicks instead of a manual reconciliation. Throughout the year, every employee gets itemised digital payslips through self-service — no PDFs emailed around.'] },
        { h2: 'One platform — leave, claims and attendance flow into pay', body: ['Because Vorkhive is a full HRMS, approved leave, submitted claims and recorded attendance connect directly to payroll. That means fewer manual adjustments and fewer payday surprises.'] },
        { h2: 'Set up Singapore payroll in three steps', bullets: ['Import your staff and set salaries and entitlements', 'Connect leave, claims and attendance (already built in)', 'Run payroll — CPF and payslips handled automatically'] },
      ],
      faqHeading: 'Singapore payroll FAQ',
      faq: [
        { q: 'Does Vorkhive calculate CPF automatically?', a: 'Yes. Employer and employee CPF contributions are calculated automatically on every payroll run, and the figures appear on each digital payslip.' },
        { q: 'Is Vorkhive payroll IRAS compliant?', a: 'Vorkhive produces IRAS-ready year-end reporting (IR8A), so filing is straightforward.' },
        { q: 'How long does setup take?', a: 'Most Singapore teams are live within a day — import staff, set entitlements, and run your first CPF-compliant payroll the same week.' },
      ],
      relatedHeading: 'Explore more',
      related: [{ label: 'CPF payroll software', href: '/cpf-payroll' }, { label: 'Pricing', href: '/#pricing' }, { label: 'The platform', href: '/#platform' }],
      finalPrimary: 'Start free', finalSecondary: 'Talk to our team',
    },
    cpf: {
      seo: { title: 'CPF Payroll Software — Automatic CPF Calculation | Vorkhive', description: 'CPF payroll software that calculates employer and employee CPF automatically on every run, with compliant payslips and IRAS-ready (IR8A) reporting.' },
      eyebrow: 'CPF Payroll',
      h1: 'CPF payroll software that calculates contributions for you',
      lede: 'Stop reconciling CPF by hand. Vorkhive works out employer and employee CPF contributions automatically on every payroll run, produces compliant digital payslips, and keeps you ready for IRAS — so payday in Singapore is a few clicks.',
      ctaPrimary: 'Start free — no card needed', ctaSecondary: 'Book a 15-min demo',
      sections: [
        { h2: 'Automatic CPF calculation, every pay run', body: ['CPF is where most Singapore payroll goes wrong — manual tables, missed wage ceilings, the wrong age band. Vorkhive removes the guesswork: it calculates both the employer and employee CPF contribution for each employee automatically, and shows the figures clearly on every payslip.'], bullets: ['Employer and employee CPF computed automatically', 'Ordinary and additional wages handled', 'Contribution figures itemised on each digital payslip'] },
        { h2: 'Kept aligned with CPF rules', body: ['CPF rates, wage ceilings and age bands change over time. Rather than asking your HR team to track every circular, Vorkhive keeps CPF handling current so your pay runs stay compliant without manual updates. Your team focuses on people, not spreadsheets.'] },
        { h2: 'From CPF to IRAS — year-end handled', body: ['CPF and income reporting are connected. Vorkhive carries the same data through to IRAS-ready year-end reporting (IR8A), so what you run during the year is what you file at the end of it — no separate reconciliation.'] },
        { h2: 'CPF is one part of a complete HRMS', body: ["Vorkhive isn't a standalone CPF calculator — it's a full Singapore HRMS where leave, claims, attendance and payroll share one record. That's why CPF “just works”: the numbers come from the same source of truth your team already uses."] },
      ],
      faqHeading: 'CPF payroll FAQ',
      faq: [
        { q: 'Does Vorkhive calculate both employer and employee CPF?', a: 'Yes — both the employer and employee CPF contributions are calculated automatically on every payroll run.' },
        { q: 'Do I need to update CPF rates myself?', a: 'No. Vorkhive keeps CPF handling aligned with current rules so your pay runs stay compliant without manual table updates.' },
        { q: 'Is the CPF data used for IRAS filing?', a: 'Yes. The same payroll data flows into IRAS-ready year-end reporting (IR8A).' },
      ],
      relatedHeading: 'Explore more',
      related: [{ label: 'Singapore payroll software', href: '/payroll-singapore' }, { label: 'Pricing', href: '/#pricing' }, { label: 'The platform', href: '/#platform' }],
      finalPrimary: 'Start free', finalSecondary: 'Talk to our team',
    },
    book: {
      seo: { title: 'Book a Vorkhive demo', description: 'Pick a date and time for a live Vorkhive HRMS demo. We confirm by email with a calendar invite. Singapore time.' },
      eyebrow: 'Book a demo',
      h1: 'Book your Vorkhive demo',
      lede: "Pick a date and a time that suits you — we'll confirm by email with a calendar invite. All times are Singapore time (SGT).",
      loading: 'Loading the calendar…',
      step1: '1 · Choose a date', step2: '2 · Choose a time', step3: '3 · Your details',
      selectDate: 'Select a date first.', checking: 'Checking availability…', booked: 'Booked',
      phName: 'Full name *', phEmail: 'Work email *', phCompany: 'Company', phPhone: 'Phone (optional)', phNotes: "Anything you'd like us to cover? (optional)",
      submit: 'Request demo', submitting: 'Booking…',
      errSlot: 'Please choose a date and time slot.', errName: 'Please enter your name and a valid email.',
      agreePre: "No charge — we'll confirm by email with a calendar invite. By requesting a demo, you agree to our ", agreeTerms: 'Terms of Service', agreeAnd: ' and ', agreePrivacy: 'Privacy Policy', agreePost: '.',
      doneTitle: 'Request received 🎉',
      doneBody: "Thanks! We've got your demo request for {date}, {period} (SGT). We'll email {email} to confirm with a calendar invite.",
    },
    contact: {
      seo: { title: 'Start your free trial | Vorkhive', description: 'Tell us about your team and we will set up your Vorkhive HRMS free trial.' },
      heading: 'Start Your Free Trial',
      sub: 'Fill out the form below and our team will get you set up with everything you need to streamline your operations.',
      lblName: 'Full Name *', lblEmail: 'Work Email *', lblCompany: 'Company Name *', lblSize: 'Company Size', lblMessage: 'How can Vorkhive help your team?',
      sizeSelect: 'Select size…', sizeUnit: 'employees',
      submit: 'Request Free Trial', submitting: 'Submitting…',
      agreePre: 'By submitting this form, you agree to our ', agreeTerms: 'Terms of Service', agreeAnd: ' and ', agreePrivacy: 'Privacy Policy', agreePost: '.',
      doneTitle: 'Request Received!',
      doneBody: 'Thank you for your interest in Vorkhive. Our team will review your information and contact you shortly to set up your free trial.',
      doneBtn: 'Return to Homepage',
    },
  },
};

// Deep-merge overrides (from content.json) over the defaults. Arrays are
// replaced wholesale (so the admin owns list contents), objects merge by key.
export function mergeContent(base, override) {
  if (Array.isArray(override)) return override;
  if (override && typeof override === 'object' && !Array.isArray(base)) {
    const out = { ...base };
    for (const k of Object.keys(override)) {
      out[k] = k in base ? mergeContent(base[k], override[k]) : override[k];
    }
    return out;
  }
  return override === undefined ? base : override;
}
