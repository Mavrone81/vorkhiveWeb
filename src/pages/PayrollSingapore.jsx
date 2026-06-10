import { Link } from 'react-router-dom';
import { MarketingShell, Check, CtaButton } from './Shell.jsx';

export default function PayrollSingapore() {
  return (
    <MarketingShell>
      <section className="article">
        <p className="eyebrow">Singapore Payroll</p>
        <h1>Singapore payroll software with CPF built in</h1>
        <p className="lede">
          Run accurate, MOM-ready payroll for your Singapore team — with CPF contributions
          calculated automatically, digital payslips, and IRAS-ready year-end filing. No
          spreadsheets, no manual CPF tables.
        </p>
        <div className="cta-row">
          <CtaButton label="Start free — no card needed" className="btn btn-primary" />
          <CtaButton label="Book a 15-min demo" className="btn btn-ghost" />
        </div>

        <h2>Payroll built for Singapore, not retrofitted</h2>
        <p>
          Most payroll tools treat Singapore as an afterthought. Vorkhive is a
          Singapore-compliant HRMS first: every pay run accounts for CPF, statutory leave and
          IRAS reporting the way local regulations expect. Add an employee once and their
          salary, leave, claims and attendance all feed the same payroll record.
        </p>

        <h2>CPF calculated automatically on every run</h2>
        <p>
          Vorkhive computes both employer and employee CPF contributions for you on each
          payroll run, so you never maintain contribution tables or worry about wage ceilings
          and age bands by hand. For a full breakdown of how CPF is handled, see our{' '}
          <Link to="/cpf-payroll">CPF payroll software</Link> page.
        </p>
        <ul>
          <li><Check />Employer and employee CPF computed on every pay run</li>
          <li><Check />Ordinary and additional wage handled correctly</li>
          <li><Check />Itemised digital payslips employees can self-serve</li>
        </ul>

        <h2>IRAS-ready filing and digital payslips</h2>
        <p>
          At year end, Vorkhive produces IRAS-ready reporting (IR8A) so submission is a few
          clicks instead of a manual reconciliation. Throughout the year, every employee gets
          itemised digital payslips through self-service — no PDFs emailed around.
        </p>

        <h2>One platform — leave, claims and attendance flow into pay</h2>
        <p>
          Because Vorkhive is a full HRMS, approved leave, submitted claims and recorded
          attendance connect directly to payroll. That means fewer manual adjustments and fewer
          payday surprises. Explore the <a href="/#platform">full platform</a> or compare{' '}
          <a href="/#pricing">pricing</a>.
        </p>

        <h2>Set up Singapore payroll in three steps</h2>
        <ul>
          <li><Check />Import your staff and set salaries and entitlements</li>
          <li><Check />Connect leave, claims and attendance (already built in)</li>
          <li><Check />Run payroll — CPF and payslips handled automatically</li>
        </ul>

        <div className="faqp">
          <h2>Singapore payroll FAQ</h2>
          <h3>Does Vorkhive calculate CPF automatically?</h3>
          <p>Yes. Employer and employee CPF contributions are calculated automatically on every payroll run, and the figures appear on each digital payslip.</p>
          <h3>Is Vorkhive payroll IRAS compliant?</h3>
          <p>Vorkhive produces IRAS-ready year-end reporting (IR8A), so filing is straightforward.</p>
          <h3>How long does setup take?</h3>
          <p>Most Singapore teams are live within a day — import staff, set entitlements, and run your first CPF-compliant payroll the same week.</p>
        </div>

        <div className="cta-row" style={{ marginTop: 30 }}>
          <CtaButton label="Start free" className="btn btn-primary" />
          <CtaButton label="Talk to our team" className="btn btn-ghost" />
        </div>
      </section>
    </MarketingShell>
  );
}
