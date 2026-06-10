import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './redesign.css';

// Small repeated icons
const Check = ({ s = 16, sw = 3 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
);
const Bell = () => (
  <svg className="bell" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 01-3.4 0" /></svg>
);
const Logo = () => (
  <Link to="/" className="logo" aria-label="Vorkhive home">
    <span className="mark" aria-hidden="true">V</span>
    <span>Vorkhive<small>SG COMPLIANCE · V2</small></span>
  </Link>
);

export default function App() {
  // Scroll-reveal: add .in when a .reveal element enters the viewport.
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.vh-root .reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="vh-root">
      <a className="skip" href="#main">Skip to content</a>

      <header>
        <div className="wrap">
          <nav aria-label="Primary">
            <Logo />
            <div className="navlinks">
              <a href="#platform">Platform</a>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
              <a href="#testimonials">Customers</a>
            </div>
            <div className="navcta">
              <a href="https://app.vorkhive.com" className="btn btn-ghost">Sign in</a>
              <Link to="/contact" className="btn btn-primary">Start free</Link>
            </div>
          </nav>
        </div>
      </header>

      <main id="main">
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-h1">
          <div className="wrap">
            <p className="eyebrow">HR · Payroll · CPF Compliance</p>
            <h1 id="hero-h1">HR &amp; payroll software built for <span className="accent">Singapore teams.</span></h1>
            <p className="sub">Vorkhive is the all-in-one HRMS for Singapore. Run leave, claims, attendance, payroll and CPF compliance from one platform — with employee self-service your whole team actually enjoys using. MOM-ready out of the box.</p>
            <div className="hero-cta">
              <Link to="/contact" className="btn btn-primary">Start free — no card needed</Link>
              <Link to="/contact" className="btn btn-ghost">Book a 15-min demo</Link>
            </div>
            <p className="trust-line">
              <Check s={17} sw={2.5} />
              CPF &amp; MOM compliant · Bank-grade security · Live in a day
            </p>

            {/* Real Vorkhive screens, recreated */}
            <div className="device-row reveal" role="img" aria-label="Vorkhive HRMS app screens: the Command Centre dashboard showing leave balances and quick actions, and the Staff Directory listing employees by department.">
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
            <p>Trusted by 10,000+ teams across Singapore &amp; the region</p>
            <div className="logo-row"><span>Acme&nbsp;Corp</span><span>Globex</span><span>Soylent</span><span>Initech</span><span>Umbrella</span></div>
          </div>
        </section>

        {/* SEO INTRO */}
        <section className="intro reveal" aria-labelledby="intro-h2">
          <div className="wrap">
            <h2 id="intro-h2">What is Vorkhive?</h2>
            <p>Vorkhive is a <strong>Singapore-compliant HR management system (HRMS)</strong> that brings leave, claims, attendance, payroll and CPF compliance together in a single platform. Instead of juggling email approvals, paper claim forms and a payroll spreadsheet, Singapore SMEs run their entire people operation from one login — with employee self-service for staff and automatic CPF calculations for HR.</p>
            <p>Explore the platform by area: <a href="#platform">leave management</a>, <a href="#platform">claims</a>, <a href="#platform">payroll &amp; CPF</a>, and <a href="#platform">attendance</a>.</p>
          </div>
        </section>

        {/* PROBLEM */}
        <section style={{ padding: '64px 0' }} aria-labelledby="prob-h2">
          <div className="problem">
            <div className="sec-head reveal">
              <p className="eyebrow">The HR admin trap</p>
              <h2 id="prob-h2">Leave on email. Claims on paper. Payroll in a spreadsheet.</h2>
              <p>When every HR task lives somewhere different, compliance gets risky, staff chase HR for answers, and payroll day becomes a scramble.</p>
            </div>
            <div className="pain-grid">
              <article className="pain reveal"><div className="ic" aria-hidden="true">📨</div><h3>Leave stuck in inboxes</h3><p>Approvals get lost in email, balances live in someone's head, and nobody knows who's off next week.</p></article>
              <article className="pain reveal"><div className="ic" aria-hidden="true">🧾</div><h3>Claims on paper</h3><p>Receipts pile up, reimbursements slip, and finance reconciles everything by hand at month end.</p></article>
              <article className="pain reveal"><div className="ic" aria-hidden="true">⚠️</div><h3>CPF &amp; compliance risk</h3><p>CPF contributions, MOM leave rules and IRAS filing are easy to get wrong when payroll runs off a manual spreadsheet.</p></article>
            </div>
          </div>
        </section>

        {/* PILLARS */}
        <section id="platform" aria-labelledby="plat-h2">
          <div className="wrap">
            <div className="sec-head reveal">
              <p className="eyebrow">One HRMS, every HR job</p>
              <h2 id="plat-h2">Leave, claims, payroll &amp; CPF in one platform</h2>
              <p>Add an employee once and everything connects — attendance, leave, claims and pay all run off the same record.</p>
            </div>
            <div className="pillars">
              <article className="pillar reveal">
                <span className="tag">People &amp; Leave</span>
                <div className="pic" aria-hidden="true">🌴</div>
                <h3>Leave management &amp; self-service</h3>
                <p>Staff apply for leave, view balances and browse the directory themselves — no HR back-and-forth.</p>
                <ul>
                  <li><Check />MOM-aligned leave entitlements</li>
                  <li><Check />Approvals &amp; balances in real time</li>
                  <li><Check />Staff directory &amp; profiles</li>
                </ul>
                <a className="more" href="#features">See self-service →</a>
              </article>
              <article className="pillar reveal">
                <span className="tag">Payroll &amp; Claims</span>
                <div className="pic" aria-hidden="true">💰</div>
                <h3>Singapore payroll with CPF</h3>
                <p>Run payroll with CPF calculated automatically, and let staff submit expense claims from their phone.</p>
                <ul>
                  <li><Check />Automatic CPF calculations</li>
                  <li><Check />Digital payslips &amp; IRAS-ready filing</li>
                  <li><Check />Expense claims &amp; approvals</li>
                </ul>
                <a className="more" href="#features">See compliance →</a>
              </article>
              <article className="pillar reveal">
                <span className="tag">Time &amp; Growth</span>
                <div className="pic" aria-hidden="true">📈</div>
                <h3>Attendance, training &amp; appraisals</h3>
                <p>Capture attendance, manage schedules, and keep training and performance reviews in one place.</p>
                <ul>
                  <li><Check />Attendance &amp; schedules</li>
                  <li><Check />Training records</li>
                  <li><Check />Appraisals &amp; surveys</li>
                </ul>
                <a className="more" href="#pricing">See pricing →</a>
              </article>
            </div>
          </div>
        </section>

        {/* FEATURE SPLITS */}
        <section id="features" style={{ paddingTop: '40px' }} aria-labelledby="feat-h2">
          <h2 id="feat-h2" className="wrap" style={{ textAlign: 'center', fontSize: 'clamp(1.6rem,3vw,2.2rem)', marginBottom: '50px' }}>Why Singapore teams choose Vorkhive</h2>
          <div className="wrap">
            <div className="feature-row reveal">
              <div className="ftext">
                <p className="eyebrow">Employee self-service</p>
                <h3>One app for every HR request</h3>
                <p>From the Command Centre, every employee applies for leave, submits a claim, views payslips, clocks attendance and completes training — without raising a single ticket to HR.</p>
                <ul>
                  <li><Check s={18} sw={2.5} />One dashboard, every HR action</li>
                  <li><Check s={18} sw={2.5} />Mobile-first, zero training needed</li>
                  <li><Check s={18} sw={2.5} />HR workload drops overnight</li>
                </ul>
              </div>
              <div className="fvisual" role="img" aria-label="Activity feed: an annual leave request approved, an expense claim submitted, and a May payslip generated with CPF auto-calculated.">
                <div className="mini-card"><div className="av" aria-hidden="true">📅</div><div className="mc"><b>Annual leave approved</b><span>Wei Jing · 12–14 Jun</span></div><span className="pill">Approved</span></div>
                <div className="mini-card"><div className="av" style={{ background: 'linear-gradient(135deg,#19B36B,#3ddc91)' }} aria-hidden="true">🧾</div><div className="mc"><b>Claim submitted</b><span>Client lunch · $84.50</span></div><span className="amt">$84.50</span></div>
                <div className="mini-card"><div className="av" style={{ background: 'linear-gradient(135deg,#FFB23E,#ff9500)' }} aria-hidden="true">💰</div><div className="mc"><b>Payslip ready — May</b><span>CPF auto-calculated</span></div><span className="pill">Sent</span></div>
              </div>
            </div>

            <div className="feature-row rev reveal">
              <div className="ftext">
                <p className="eyebrow">Singapore compliance</p>
                <h3>CPF, MOM &amp; IRAS handled for you</h3>
                <p>Vorkhive keeps CPF contributions, statutory leave and IRAS filing aligned with Singapore requirements — so you run payroll with confidence instead of cross-checking circulars.</p>
                <ul>
                  <li><Check s={18} sw={2.5} />CPF contributions auto-calculated</li>
                  <li><Check s={18} sw={2.5} />MOM-aligned leave policies</li>
                  <li><Check s={18} sw={2.5} />IRAS-ready year-end reporting (IR8A)</li>
                </ul>
              </div>
              <div className="fvisual" style={{ gap: '14px' }} role="img" aria-label="Compliance status: CPF contributions automatic, statutory leave compliant, and IRAS year-end IR8A export ready.">
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
              <div className="metric"><div className="num">40%</div><div className="lab">Less HR admin</div></div>
              <div className="metric"><div className="num">1 day</div><div className="lab">Average setup time</div></div>
              <div className="metric"><div className="num">10k+</div><div className="lab">Teams onboard</div></div>
              <div className="metric"><div className="num">99.99%</div><div className="lab">Platform uptime</div></div>
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section aria-labelledby="steps-h2">
          <div className="wrap">
            <div className="sec-head reveal">
              <p className="eyebrow">Get started</p>
              <h2 id="steps-h2">Set up your HRMS in three steps</h2>
              <p>No lengthy implementation, no consultants. Most Singapore teams are live within a day.</p>
            </div>
            <div className="steps">
              <article className="step reveal"><div className="n">1</div><h3>Import your staff</h3><p>Bring your team in from a spreadsheet and set leave entitlements in a few clicks.</p></article>
              <article className="step reveal"><div className="n">2</div><h3>Switch on self-service</h3><p>Employees apply for leave, submit claims and view payslips from day one.</p></article>
              <article className="step reveal"><div className="n">3</div><h3>Run compliant payroll</h3><p>Process pay with CPF handled automatically — and hand HR its time back.</p></article>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" style={{ paddingTop: '30px' }} aria-labelledby="test-h2">
          <div className="wrap">
            <div className="sec-head reveal">
              <p className="eyebrow">Loved by HR teams</p>
              <h2 id="test-h2">Singapore teams that ditched the spreadsheets</h2>
            </div>
            <div className="tgrid">
              <figure className="tcard reveal"><div className="stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“Leave and claims used to be a daily email pile. Now staff self-serve and our HR exec got a full day back every week.”</blockquote><figcaption className="tperson"><div className="av" aria-hidden="true">SK</div><div><b>Sarah Kline</b><span>Ops Director, VibeMedia</span></div></figcaption></figure>
              <figure className="tcard reveal"><div className="stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“Payroll with CPF used to terrify me. Vorkhive calculates it automatically and the payslips just go out. It's a ten-minute job now.”</blockquote><figcaption className="tperson"><div className="av" aria-hidden="true">MJ</div><div><b>Marcus Johnson</b><span>Founder, ScaleUp Tech</span></div></figcaption></figure>
              <figure className="tcard reveal"><div className="stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“The team adopted it in days — it feels like a consumer app, not a clunky HR system. Onboarding new hires is effortless.”</blockquote><figcaption className="tperson"><div className="av" aria-hidden="true">EP</div><div><b>Elena Patel</b><span>VP of People, CloudSync</span></div></figcaption></figure>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" aria-labelledby="price-h2">
          <div className="wrap">
            <div className="sec-head reveal">
              <p className="eyebrow">Pricing</p>
              <h2 id="price-h2">HRMS pricing for Singapore teams</h2>
              <p>One platform for leave, claims, attendance and payroll — for less than you'd pay for any one of them.</p>
            </div>
            <div className="pricing-grid">
              <article className="price reveal">
                <h3 className="pname">Starter</h3>
                <div className="pdesc">For small teams putting HR on autopilot.</div>
                <div className="amt">S$5<small> /user / mo</small></div>
                <ul>
                  <li><Check />Up to 5 users</li>
                  <li><Check />Leave &amp; staff directory</li>
                  <li><Check />Claims &amp; attendance</li>
                  <li><Check />Community support</li>
                </ul>
                <Link to="/contact" className="btn btn-ghost">Start free</Link>
              </article>
              <article className="price feat reveal">
                <div className="badge">Most popular</div>
                <h3 className="pname">Growth</h3>
                <div className="pdesc">For growing teams that need payroll &amp; compliance.</div>
                <div className="amt">S$9<small> /user / mo</small></div>
                <ul>
                  <li><Check />Unlimited users</li>
                  <li><Check />Full payroll with CPF</li>
                  <li><Check />Digital payslips &amp; IRAS export</li>
                  <li><Check />Training &amp; appraisals</li>
                  <li><Check />Priority support</li>
                </ul>
                <Link to="/contact" className="btn btn-primary">Start 14-day trial</Link>
              </article>
              <article className="price reveal">
                <h3 className="pname">Enterprise</h3>
                <div className="pdesc">Advanced security and control for larger organizations.</div>
                <div className="amt">S$15<small> /user / mo</small></div>
                <ul>
                  <li><Check />Everything in Growth</li>
                  <li><Check />Single Sign-On (SSO)</li>
                  <li><Check />Dedicated success manager</li>
                  <li><Check />Full API access</li>
                </ul>
                <Link to="/contact" className="btn btn-ghost">Contact sales</Link>
              </article>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-h2" style={{ paddingTop: '30px' }}>
          <div className="wrap">
            <div className="sec-head reveal">
              <p className="eyebrow">FAQ</p>
              <h2 id="faq-h2">Frequently asked questions</h2>
              <p>Common questions about running HR and payroll on Vorkhive in Singapore.</p>
            </div>
            <div className="faq-list reveal">
              <details className="faq"><summary>Is Vorkhive compliant with Singapore employment regulations?</summary><div className="fa">Yes. Vorkhive handles CPF calculations, MOM-aligned leave entitlements and IRAS-ready payroll reporting, so your HR stays compliant with Singapore requirements.</div></details>
              <details className="faq"><summary>What HR tasks can employees do themselves?</summary><div className="fa">Through self-service, employees apply for leave, submit claims, view payslips, clock attendance, complete training and update their profile — all from one dashboard.</div></details>
              <details className="faq"><summary>How long does it take to set up Vorkhive?</summary><div className="fa">Most teams are live within a day. You import your staff directory, set leave entitlements and run your first CPF-compliant payroll the same week.</div></details>
              <details className="faq"><summary>Does Vorkhive calculate CPF automatically?</summary><div className="fa">Yes. Vorkhive calculates employer and employee CPF contributions automatically on every payroll run and produces digital payslips ready for IRAS filing.</div></details>
              <details className="faq"><summary>How much does Vorkhive cost?</summary><div className="fa">Vorkhive starts at S$5 per user per month (Starter). The Growth plan is S$9 per user per month and includes full payroll with CPF; Enterprise is S$15 per user per month.</div></details>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="demo" style={{ padding: '40px 0 90px' }} aria-labelledby="cta-h2">
          <div className="final reveal">
            <h2 id="cta-h2">Give your HR team its time back</h2>
            <p>Join 10,000+ teams running leave, claims, payroll and CPF compliance on one HRMS built for Singapore.</p>
            <div className="hero-cta">
              <Link to="/contact" className="btn btn-lime">Start free — no card needed</Link>
              <Link to="/contact" className="btn btn-ghost" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,.4)' }}>Book a demo</Link>
            </div>
            <p className="trust-line"><Check s={17} sw={2.5} />No credit card required · Cancel anytime</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <Logo />
              <p>The Singapore-compliant HRMS for leave, claims, attendance and payroll. Run all of HR from one login.</p>
            </div>
            <nav className="foot-col" aria-label="Platform"><h4>Platform</h4><a href="#platform">Leave management</a><a href="#platform">Claims</a><a href="#platform">Payroll &amp; CPF</a><a href="#platform">Attendance</a><a href="#pricing">Pricing</a></nav>
            <nav className="foot-col" aria-label="Company"><h4>Company</h4><a href="#">About</a><a href="#">Careers</a><a href="#">Blog</a><Link to="/contact">Contact</Link></nav>
            <nav className="foot-col" aria-label="Resources"><h4>Resources</h4><a href="#">Help center</a><a href="#">Security</a><a href="#">Status</a><a href="#">CPF guide</a></nav>
          </div>
          <div className="foot-bot"><span>© 2026 Vorkhive, Inc. · Singapore. All rights reserved.</span><span>Privacy · Terms · SOC 2 Type II</span></div>
        </div>
      </footer>
    </div>
  );
}
