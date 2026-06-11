import { Link } from 'react-router-dom';
import { MarketingShell, Check, CtaButton } from './Shell.jsx';

// Content-driven SEO pillar page (payroll-singapore, cpf-payroll). Text comes
// from content.pages.* so it renders in the active language.
export default function PillarPage({ p }) {
  if (!p) return null;
  return (
    <MarketingShell>
      <section className="article">
        <p className="eyebrow">{p.eyebrow}</p>
        <h1>{p.h1}</h1>
        <p className="lede">{p.lede}</p>
        <div className="cta-row">
          <CtaButton label={p.ctaPrimary} to="register" className="btn btn-primary" />
          <CtaButton label={p.ctaSecondary} to="demo" className="btn btn-ghost" />
        </div>

        {(p.sections || []).map((s, i) => (
          <div key={i}>
            <h2>{s.h2}</h2>
            {(s.body || []).map((para, j) => <p key={j}>{para}</p>)}
            {s.bullets && <ul>{s.bullets.map((b, k) => <li key={k}><Check />{b}</li>)}</ul>}
          </div>
        ))}

        {p.faq && p.faq.length > 0 && (
          <div className="faqp">
            <h2>{p.faqHeading}</h2>
            {p.faq.map((f, i) => (
              <div key={i}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        )}

        {p.related && p.related.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <h2>{p.relatedHeading}</h2>
            <p>
              {p.related.map((r, i) => (
                <span key={i}>
                  {i > 0 && ' · '}
                  {r.href.startsWith('/') && !r.href.includes('#')
                    ? <Link to={r.href}>{r.label}</Link>
                    : <a href={r.href}>{r.label}</a>}
                </span>
              ))}
            </p>
          </div>
        )}

        <div className="cta-row" style={{ marginTop: 30 }}>
          <CtaButton label={p.finalPrimary} to="register" className="btn btn-primary" />
          <CtaButton label={p.finalSecondary} to="contact" className="btn btn-ghost" />
        </div>
      </section>
    </MarketingShell>
  );
}
