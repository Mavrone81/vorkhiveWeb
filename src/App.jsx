import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './redesign.css';
import { useContent } from './content/ContentContext.jsx';

const Check = ({ s = 16, sw = 3 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
);
const Bell = () => (
  <svg className="bell" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 01-3.4 0" /></svg>
);
function Logo() {
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

const REGISTER_URL = 'https://app.vorkhive.com/register';
// "Start free" / "Start trial" CTAs go straight to sign-up; "Book a demo" /
// "Contact sales" go to the contact form.
function CtaButton({ label, className, style }) {
  const toContact = /contact|sales|demo|talk/i.test(label || '');
  return toContact
    ? <Link to="/contact" className={className} style={style}>{label}</Link>
    : <a href={REGISTER_URL} className={className} style={style}>{label}</a>;
}

export default function App() {
  const c = useContent();
  const { hero, logos, intro, problem, pillars, features, metrics, steps, testimonials, pricing, faq, finalCta, footer } = c;
  const [mobileOpen, setMobileOpen] = useState(false);
  const NAV = [['#platform', 'Platform'], ['#features', 'Features'], ['#pricing', 'Pricing'], ['#faq', 'FAQ'], ['#testimonials', 'Customers']];

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.vh-root .reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [c]);

  return (
    <div className="vh-root">
      <a className="skip" href="#main">Skip to content</a>

      <header>
        <div className="wrap">
          <nav aria-label="Primary">
            <Logo />
            <div className="navlinks">
              {NAV.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
            </div>
            <div className="navcta">
              <a href="https://app.vorkhive.com" className="btn btn-ghost">Sign in</a>
              <CtaButton label="Start free" className="btn btn-primary" />
            </div>
            <button className="menu-toggle" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((o) => !o)}>
              {mobileOpen
                ? <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>}
            </button>
          </nav>
        </div>
        <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
          {NAV.map(([href, label]) => <a key={href} href={href} onClick={() => setMobileOpen(false)}>{label}</a>)}
          <a href="https://app.vorkhive.com" className="btn btn-ghost">Sign in</a>
          <CtaButton label="Start free" className="btn btn-primary" />
        </div>
      </header>

      <main id="main">
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-h1">
          <div className="wrap">
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 id="hero-h1">{hero.headlineLead}<span className="accent">{hero.headlineAccent}</span></h1>
            <p className="sub">{hero.subtitle}</p>
            <div className="hero-cta">
              <CtaButton label={hero.ctaPrimary} className="btn btn-primary" />
              <CtaButton label={hero.ctaSecondary} className="btn btn-ghost" />
            </div>
            <p className="trust-line"><Check s={17} sw={2.5} />{hero.trustLine}</p>

            {/* Decorative product mockups */}
            <div className="device-row reveal" role="img" aria-label="Vorkhive HRMS app screens: Command Centre dashboard and Staff Directory.">
              <div className="phone">
                <div className="screen">
                  <div className="app-top"><span className="ttl">COMMAND CENTRE</span><Bell /></div>
                  <div className="app-scroll">
                    <div className="greet">Good morning, Test 👋</div>
                    <div className="gd">WEDNESDAY, 10 JUNE 2026</div>
                    <div className="app-card"><div className="ch"><b>Leave Balances</b><span className="lnk">APPLY →</span></div><div className="cs">2026 entitlements</div></div>
                    <div className="app-card"><div className="ch"><b>My Leave Requests</b><span className="lnk">VIEW ALL →</span></div><div className="cs">Recent applications</div></div>
                    <div className="qa-title">Quick Actions</div>
                    <div className="qa-grid">
                      <div className="qa v"><span className="em" aria-hidden="true">📅</span>APPLY LEAVE</div>
                      <div className="qa g"><span className="em" aria-hidden="true">💳</span>SUBMIT CLAIM</div>
                      <div className="qa n"><span className="em" aria-hidden="true">👤</span>MY PROFILE</div>
                      <div className="qa y"><span className="em" aria-hidden="true">💰</span>PAYSLIPS</div>
                      <div className="qa b"><span className="em" aria-hidden="true">🕐</span>ATTENDANCE</div>
                      <div className="qa p"><span className="em" aria-hidden="true">📚</span>TRAINING</div>
                    </div>
                  </div>
                  <div style={{ position: 'relative' }}><div className="float-chat" aria-hidden="true">💬</div></div>
                </div>
              </div>
              <div className="phone">
                <div className="screen">
                  <div className="app-top"><span className="ttl">STAFF</span><Bell /></div>
                  <div className="app-scroll">
                    <div className="sd-eyebrow">● INTERNAL DIRECTORY</div>
                    <div className="sd-title">Staff <span className="v">Directory</span></div>
                    <div className="sd-count">27 OF 27 ACTIVE PERSONNEL</div>
                    <div className="sd-search"><span>Search name, role, department…</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8B4D0" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
                    </div>
                    <div className="sd-chips"><span className="sd-chip on">ALL</span><span className="sd-chip">ENGINEERING</span><span className="sd-chip">FINANCE</span><span className="sd-chip">HR</span><span className="sd-chip">IT</span><span className="sd-chip">SALES</span></div>
                    <div className="emp">
                      <div className="eh"><span className="av">WJ</span><div><div className="en">Wei Jing Lim</div><div className="er">Senior Software Engineer</div></div></div>
                      <div className="ed"><span>DEPT</span><span className="badge">ENGINEERING</span></div>
                      <div className="ed"><span>EMPLOYEE ID</span><b>EMP-0001</b></div>
                      <div className="ed"><span>CONTRACT</span><b>FULL TIME</b></div>
                    </div>
                    <div className="emp">
                      <div className="eh"><span className="av">PN</span><div><div className="en">Priya Nair</div><div className="er">Frontend Engineer</div></div></div>
                      <div className="ed"><span>DEPT</span><span className="badge">ENGINEERING</span></div>
                      <div className="ed"><span>EMPLOYEE ID</span><b>EMP-0002</b></div>
                    </div>
                  </div>
                  <div style={{ position: 'relative' }}><div className="float-chat" aria-hidden="true">💬</div></div>
                </div>
              </div>
            </div>
            <p className="shot-caption">Actual Vorkhive screens — Command Centre &amp; Staff Directory</p>
          </div>
        </section>

        {/* LOGOS */}
        <section className="logos reveal" aria-label="Customers" style={{ paddingTop: '48px' }}>
          <div className="wrap">
            <p>{logos.caption}</p>
            <div className="logo-row">{logos.items.map((l, i) => <span key={i}>{l}</span>)}</div>
          </div>
        </section>

        {/* SEO INTRO */}
        <section className="intro reveal" aria-labelledby="intro-h2">
          <div className="wrap">
            <h2 id="intro-h2">{intro.heading}</h2>
            <p>{intro.body1}</p>
            <p>{intro.body2}</p>
          </div>
        </section>

        {/* PROBLEM */}
        <section style={{ padding: '64px 0' }} aria-labelledby="prob-h2">
          <div className="problem">
            <div className="sec-head reveal">
              <p className="eyebrow">{problem.eyebrow}</p>
              <h2 id="prob-h2">{problem.heading}</h2>
              <p>{problem.sub}</p>
            </div>
            <div className="pain-grid">
              {problem.items.map((it, i) => (
                <article className="pain reveal" key={i}><div className="ic" aria-hidden="true">{it.icon}</div><h3>{it.title}</h3><p>{it.text}</p></article>
              ))}
            </div>
          </div>
        </section>

        {/* PILLARS */}
        <section id="platform" aria-labelledby="plat-h2">
          <div className="wrap">
            <div className="sec-head reveal">
              <p className="eyebrow">{pillars.eyebrow}</p>
              <h2 id="plat-h2">{pillars.heading}</h2>
              <p>{pillars.sub}</p>
            </div>
            <div className="pillars">
              {pillars.items.map((p, i) => (
                <article className="pillar reveal" key={i}>
                  <span className="tag">{p.tag}</span>
                  <div className="pic" aria-hidden="true">{p.icon}</div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  <ul>{p.bullets.map((b, j) => <li key={j}><Check />{b}</li>)}</ul>
                  <a className="more" href="#features">{p.moreLabel}</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURE SPLITS */}
        <section id="features" style={{ paddingTop: '40px' }} aria-labelledby="feat-h2">
          <h2 id="feat-h2" className="wrap" style={{ textAlign: 'center', fontSize: 'clamp(1.6rem,3vw,2.2rem)', marginBottom: '50px' }}>{features.heading}</h2>
          <div className="wrap">
            <div className="feature-row reveal">
              <div className="ftext">
                <p className="eyebrow">{features.items[0].eyebrow}</p>
                <h3>{features.items[0].title}</h3>
                <p>{features.items[0].text}</p>
                <ul>{features.items[0].bullets.map((b, j) => <li key={j}><Check s={18} sw={2.5} />{b}</li>)}</ul>
              </div>
              <div className="fvisual" role="img" aria-label="Activity feed: leave approved, claim submitted, payslip generated.">
                <div className="mini-card"><div className="av" aria-hidden="true">📅</div><div className="mc"><b>Annual leave approved</b><span>Wei Jing · 12–14 Jun</span></div><span className="pill">Approved</span></div>
                <div className="mini-card"><div className="av" style={{ background: 'linear-gradient(135deg,#19B36B,#3ddc91)' }} aria-hidden="true">🧾</div><div className="mc"><b>Claim submitted</b><span>Client lunch · $84.50</span></div><span className="amt">$84.50</span></div>
                <div className="mini-card"><div className="av" style={{ background: 'linear-gradient(135deg,#FFB23E,#ff9500)' }} aria-hidden="true">💰</div><div className="mc"><b>Payslip ready — May</b><span>CPF auto-calculated</span></div><span className="pill">Sent</span></div>
              </div>
            </div>

            <div className="feature-row rev reveal">
              <div className="ftext">
                <p className="eyebrow">{features.items[1].eyebrow}</p>
                <h3>{features.items[1].title}</h3>
                <p>{features.items[1].text}</p>
                <ul>{features.items[1].bullets.map((b, j) => <li key={j}><Check s={18} sw={2.5} />{b}</li>)}</ul>
              </div>
              <div className="fvisual" style={{ gap: '14px' }} role="img" aria-label="Compliance: CPF automatic, statutory leave compliant, IRAS export ready.">
                <div className="mini-card"><div className="av" style={{ background: '#16142E', color: '#a48bff', fontSize: '.7rem' }} aria-hidden="true">CPF</div><div className="mc"><b>CPF contribution</b><span>Employer + employee</span></div><span className="amt">Auto</span></div>
                <div className="mini-card"><div className="av" style={{ background: '#16142E', color: '#a48bff', fontSize: '.62rem' }} aria-hidden="true">MOM</div><div className="mc"><b>Statutory leave</b><span>Entitlements aligned</span></div><span className="pill">Compliant</span></div>
                <div className="mini-card"><div className="av" style={{ background: '#16142E', color: '#a48bff', fontSize: '.6rem' }} aria-hidden="true">IRAS</div><div className="mc"><b>Year-end filing</b><span>IR8A export ready</span></div><span className="pill">Ready</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS */}
        <section style={{ padding: '30px 0 70px' }} aria-label="Key results">
          <div className="wrap">
            <div className="metrics reveal">
              {metrics.map((m, i) => <div className="metric" key={i}><div className="num">{m.num}</div><div className="lab">{m.lab}</div></div>)}
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section aria-labelledby="steps-h2">
          <div className="wrap">
            <div className="sec-head reveal">
              <p className="eyebrow">{steps.eyebrow}</p>
              <h2 id="steps-h2">{steps.heading}</h2>
              <p>{steps.sub}</p>
            </div>
            <div className="steps">
              {steps.items.map((s, i) => <article className="step reveal" key={i}><div className="n">{i + 1}</div><h3>{s.title}</h3><p>{s.text}</p></article>)}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" style={{ paddingTop: '30px' }} aria-labelledby="test-h2">
          <div className="wrap">
            <div className="sec-head reveal">
              <p className="eyebrow">{testimonials.eyebrow}</p>
              <h2 id="test-h2">{testimonials.heading}</h2>
            </div>
            <div className="tgrid">
              {testimonials.items.map((t, i) => (
                <figure className="tcard reveal" key={i}>
                  <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
                  <blockquote>{t.quote}</blockquote>
                  <figcaption className="tperson"><div className="av" aria-hidden="true">{t.initials}</div><div><b>{t.name}</b><span>{t.role}</span></div></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" aria-labelledby="price-h2">
          <div className="wrap">
            <div className="sec-head reveal">
              <p className="eyebrow">{pricing.eyebrow}</p>
              <h2 id="price-h2">{pricing.heading}</h2>
              <p>{pricing.sub}</p>
            </div>
            <div className="pricing-grid">
              {pricing.plans.map((p, i) => (
                <article className={`price reveal${p.featured ? ' feat' : ''}`} key={i}>
                  {p.badge ? <div className="badge">{p.badge}</div> : null}
                  <h3 className="pname">{p.name}</h3>
                  <div className="pdesc">{p.desc}</div>
                  <div className="amt">{p.price}<small>{p.period}</small></div>
                  <ul>{p.bullets.map((b, j) => <li key={j}><Check />{b}</li>)}</ul>
                  <CtaButton label={p.cta} className={`btn ${p.featured ? 'btn-primary' : 'btn-ghost'}`} />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-h2" style={{ paddingTop: '30px' }}>
          <div className="wrap">
            <div className="sec-head reveal">
              <p className="eyebrow">{faq.eyebrow}</p>
              <h2 id="faq-h2">{faq.heading}</h2>
              <p>{faq.sub}</p>
            </div>
            <div className="faq-list reveal">
              {faq.items.map((f, i) => (
                <details className="faq" key={i}><summary>{f.q}</summary><div className="fa">{f.a}</div></details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="demo" style={{ padding: '40px 0 90px' }} aria-labelledby="cta-h2">
          <div className="final reveal">
            <h2 id="cta-h2">{finalCta.heading}</h2>
            <p>{finalCta.sub}</p>
            <div className="hero-cta">
              <CtaButton label={finalCta.ctaPrimary} className="btn btn-lime" />
              <CtaButton label={finalCta.ctaSecondary} className="btn btn-ghost" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,.4)' }} />
            </div>
            <p className="trust-line"><Check s={17} sw={2.5} />{finalCta.trustLine}</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <Logo />
              <p>{footer.brandText}</p>
            </div>
            {footer.columns.map((col, i) => (
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
    </div>
  );
}
