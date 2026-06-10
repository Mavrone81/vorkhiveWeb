import { Link } from 'react-router-dom';
import { MarketingShell, Check, CtaButton } from './Shell.jsx';

export default function CpfPayroll() {
  return (
    <MarketingShell>
      <section className="article">
        <p className="eyebrow">CPF Payroll</p>
        <h1>CPF payroll software that calculates contributions for you</h1>
        <p className="lede">
          Stop reconciling CPF by hand. Vorkhive works out employer and employee CPF
          contributions automatically on every payroll run, produces compliant digital
          payslips, and keeps you ready for IRAS — so payday in Singapore is a few clicks.
        </p>
        <div className="cta-row">
          <CtaButton label="Start free — no card needed" className="btn btn-primary" />
          <CtaButton label="Book a 15-min demo" className="btn btn-ghost" />
        </div>

        <h2>Automatic CPF calculation, every pay run</h2>
        <p>
          CPF is where most Singapore payroll goes wrong — manual tables, missed wage ceilings,
          the wrong age band. Vorkhive removes the guesswork: it calculates both the employer
          and employee CPF contribution for each employee automatically, and shows the figures
          clearly on every payslip.
        </p>
        <ul>
          <li><Check />Employer and employee CPF computed automatically</li>
          <li><Check />Ordinary and additional wages handled</li>
          <li><Check />Contribution figures itemised on each digital payslip</li>
        </ul>

        <h2>Kept aligned with CPF rules</h2>
        <p>
          CPF rates, wage ceilings and age bands change over time. Rather than asking your HR
          team to track every circular, Vorkhive keeps CPF handling current so your pay runs
          stay compliant without manual updates. Your team focuses on people, not spreadsheets.
        </p>

        <h2>From CPF to IRAS — year-end handled</h2>
        <p>
          CPF and income reporting are connected. Vorkhive carries the same data through to
          IRAS-ready year-end reporting (IR8A), so what you run during the year is what you
          file at the end of it — no separate reconciliation. See the full{' '}
          <Link to="/payroll-singapore">Singapore payroll software</Link> overview.
        </p>

        <h2>CPF is one part of a complete HRMS</h2>
        <p>
          Vorkhive isn't a standalone CPF calculator — it's a full Singapore HRMS where leave,
          claims, attendance and payroll share one record. That's why CPF "just works": the
          numbers come from the same source of truth your team already uses. Explore the{' '}
          <a href="/#platform">platform</a> or view <a href="/#pricing">pricing</a>.
        </p>

        <div className="faqp">
          <h2>CPF payroll FAQ</h2>
          <h3>Does Vorkhive calculate both employer and employee CPF?</h3>
          <p>Yes — both the employer and employee CPF contributions are calculated automatically on every payroll run.</p>
          <h3>Do I need to update CPF rates myself?</h3>
          <p>No. Vorkhive keeps CPF handling aligned with current rules so your pay runs stay compliant without manual table updates.</p>
          <h3>Is the CPF data used for IRAS filing?</h3>
          <p>Yes. The same payroll data flows into IRAS-ready year-end reporting (IR8A).</p>
        </div>

        <div className="cta-row" style={{ marginTop: 30 }}>
          <CtaButton label="Start free" className="btn btn-primary" />
          <CtaButton label="Talk to our team" className="btn btn-ghost" />
        </div>
      </section>
    </MarketingShell>
  );
}
