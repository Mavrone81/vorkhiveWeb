import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../redesign.css';
import { useContent } from '../content/ContentContext.jsx';

export const REGISTER_URL = 'https://app.vorkhive.com/register';

export const Check = ({ s = 16, sw = 3 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
);

export function CtaButton({ label, className, style }) {
  const toContact = /contact|sales|demo|talk/i.test(label || '');
  return toContact
    ? <Link to="/contact" className={className} style={style}>{label}</Link>
    : <a href={REGISTER_URL} className={className} style={style}>{label}</a>;
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

const NAV = [['/#platform', 'Platform'], ['/#features', 'Features'], ['/#pricing', 'Pricing'], ['/#faq', 'FAQ'], ['/#testimonials', 'Customers']];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <div className="wrap">
        <nav aria-label="Primary">
          <Logo />
          <div className="navlinks">{NAV.map(([h, l]) => <a key={h} href={h}>{l}</a>)}</div>
          <div className="navcta">
            <a href="https://app.vorkhive.com" className="btn btn-ghost">Sign in</a>
            <CtaButton label="Start free" className="btn btn-primary" />
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
        <a href="https://app.vorkhive.com" className="btn btn-ghost">Sign in</a>
        <CtaButton label="Start free" className="btn btn-primary" />
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

// Wrapper for standalone marketing/SEO pages (header + footer + scroll reveal).
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
