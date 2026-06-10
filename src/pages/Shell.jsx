import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../redesign.css';
import { useContent } from '../content/ContentContext.jsx';

export const REGISTER_URL = 'https://app.vorkhive.com/register';

export const LANGS = [
  { code: 'en', label: 'English', path: '/' },
  { code: 'zh', label: '中文', path: '/zh' },
  { code: 'ms', label: 'Bahasa Melayu', path: '/ms' },
  { code: 'ta', label: 'தமிழ்', path: '/ta' },
  { code: 'th', label: 'ไทย', path: '/th' },
];

export const Check = ({ s = 16, sw = 3 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
);

// `to`: 'register' (sign-up), 'contact' (contact form), or 'demo' (book a demo).
export function CtaButton({ label, to = 'register', className, style }) {
  if (to === 'contact') return <Link to="/contact" className={className} style={style}>{label}</Link>;
  if (to === 'demo') return <Link to="/book" className={className} style={style}>{label}</Link>;
  return <a href={REGISTER_URL} className={className} style={style}>{label}</a>;
}

export function Logo() {
  const c = useContent();
  const b = c.branding || {};
  return (
    <Link to="/" className="logo" aria-label={`${b.brandName || 'Vorkhive'} home`}>
      {b.logoImage
        ? <img src={b.logoImage} alt={b.brandName || 'Vorkhive'} style={{ height: 36, borderRadius: 8 }} />
        : <span className="mark" aria-hidden="true">{(b.brandName || 'V').charAt(0)}</span>}
      <span>{b.brandName || 'Vorkhive'}<small>{b.brandTag || ''}</small></span>
    </Link>
  );
}

export function LanguageSwitcher() {
  const c = useContent();
  const cur = c._lang || 'en';
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.code === cur) || LANGS[0];
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen((o) => !o)} aria-haspopup="true" aria-expanded={open} aria-label="Language"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'none', border: '1.5px solid var(--line)', borderRadius: 12, padding: '9px 13px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '.9rem', color: 'var(--ink)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20" /></svg>
        {current.label}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff', border: '1px solid var(--line)', borderRadius: 12, boxShadow: 'var(--shadow)', padding: 6, minWidth: 170, zIndex: 60 }}>
          {LANGS.map((l) => (
            <a key={l.code} href={l.path} style={{ display: 'block', padding: '9px 12px', borderRadius: 8, color: l.code === cur ? 'var(--violet)' : 'var(--ink)', fontWeight: l.code === cur ? 700 : 500, fontSize: '.92rem' }}>{l.label}</a>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const c = useContent();
  const ui = c.ui || {};
  const navL = ui.nav || {};
  const lang = c._lang || 'en';
  const base = lang === 'en' ? '' : `/${lang}`;
  const [open, setOpen] = useState(false);
  const NAV = [
    [`${base}/#platform`, navL.platform || 'Platform'],
    [`${base}/#features`, navL.features || 'Features'],
    [`${base}/#pricing`, navL.pricing || 'Pricing'],
    [`${base}/#faq`, navL.faq || 'FAQ'],
    [`${base}/#testimonials`, navL.customers || 'Customers'],
  ];
  return (
    <header>
      <div className="wrap">
        <nav aria-label="Primary">
          <Logo />
          <div className="navlinks">{NAV.map(([h, l]) => <a key={h} href={h}>{l}</a>)}</div>
          <div className="navcta">
            <LanguageSwitcher />
            <a href="https://app.vorkhive.com" className="btn btn-ghost">{ui.signIn || 'Sign in'}</a>
            <CtaButton label={ui.startFree || 'Start free'} to="register" className="btn btn-primary" />
          </div>
          <button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open
              ? <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>}
          </button>
        </nav>
      </div>
      <div className={`mobile-menu${open ? ' open' : ''}`}>
        {NAV.map(([h, l]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
        <div style={{ padding: '10px 0' }}><LanguageSwitcher /></div>
        <a href="https://app.vorkhive.com" className="btn btn-ghost">{ui.signIn || 'Sign in'}</a>
        <CtaButton label={ui.startFree || 'Start free'} to="register" className="btn btn-primary" />
      </div>
    </header>
  );
}

export function SiteFooter() {
  const c = useContent();
  const footer = c.footer || {};
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Logo />
            <p>{footer.brandText}</p>
          </div>
          {(footer.columns || []).map((col, i) => (
            <nav className="foot-col" aria-label={col.title} key={i}>
              <h4>{col.title}</h4>
              {col.links.map((lnk, j) => (
                (lnk.href.startsWith('/') && !lnk.href.includes('#')) ? <Link to={lnk.href} key={j}>{lnk.label}</Link> : <a href={lnk.href} key={j}>{lnk.label}</a>
              ))}
            </nav>
          ))}
        </div>
        <div className="foot-bot"><span>{footer.copyright}</span><span>{footer.legal}</span></div>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }) {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.vh-root .reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="vh-root">
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}
