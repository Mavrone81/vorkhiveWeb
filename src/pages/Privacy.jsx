import { Link } from 'react-router-dom';
import { MarketingShell } from './Shell.jsx';

export default function Privacy() {
  return (
    <MarketingShell>
      <section className="article legal">
        <p className="eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: 11 June 2026</p>
        <p className="lede">This Privacy Policy explains how Vorkhive ("Vorkhive", "we", "us") collects, uses, discloses and protects personal data when you use our website and platform (the "Service"). We handle personal data in line with Singapore's Personal Data Protection Act (PDPA) and applicable laws.</p>

        <h2>1. Scope</h2>
        <p>This policy covers personal data we process as a business — for example, data of website visitors, prospects and account administrators. Where we process personal data on behalf of a customer (for instance, the employee records a customer enters into the platform), we act as a data intermediary and process that data under the customer's instructions and our agreement with them.</p>

        <h2>2. Information we collect</h2>
        <ul>
          <li><strong>Information you provide:</strong> name, work email, company, phone number, and any message or notes you submit when you book a demo, start a trial, contact us, or create an account.</li>
          <li><strong>Account &amp; usage data:</strong> details about how you interact with the Service, such as log data, device and browser information, and pages viewed.</li>
          <li><strong>Cookies &amp; similar technologies:</strong> used to keep the Service working, remember preferences (such as language) and understand usage.</li>
          <li><strong>Customer Data:</strong> data your organisation uploads into the platform, processed on your behalf as described in section 1.</li>
        </ul>

        <h2>3. How we use information</h2>
        <ul>
          <li>To provide, operate, secure and improve the Service;</li>
          <li>To respond to demo requests, enquiries and support;</li>
          <li>To process bookings and send confirmations and calendar invitations;</li>
          <li>To send service-related and, where permitted, marketing communications (you can opt out at any time);</li>
          <li>To comply with legal obligations and enforce our terms.</li>
        </ul>

        <h2>4. Legal basis and consent</h2>
        <p>We collect and use personal data with your consent (which you may withdraw), to perform a contract with you, to pursue legitimate interests such as running and improving our business, and to meet legal obligations. By submitting a form, you consent to our use of the information for the purposes described here.</p>

        <h2>5. How we share information</h2>
        <p>We do not sell your personal data. We may share it with: (a) trusted service providers who help us run the Service (such as hosting, email delivery and analytics), under appropriate confidentiality obligations; (b) authorities or third parties where required by law or to protect rights and safety; and (c) a successor entity in connection with a merger, acquisition or asset sale.</p>

        <h2>6. Data retention</h2>
        <p>We keep personal data only for as long as necessary for the purposes set out above, to comply with legal obligations, resolve disputes and enforce agreements. When no longer needed, we delete or anonymise it.</p>

        <h2>7. Data security</h2>
        <p>We use reasonable administrative, technical and physical safeguards — including encryption in transit and access controls — to protect personal data. No method of transmission or storage is completely secure, however, and we cannot guarantee absolute security.</p>

        <h2>8. International transfers</h2>
        <p>Where personal data is transferred or stored outside Singapore, we take steps to ensure it receives a standard of protection comparable to that under the PDPA.</p>

        <h2>9. Your rights</h2>
        <p>Subject to applicable law, you may request access to, or correction of, the personal data we hold about you, and you may withdraw consent to our use of it. To make a request, email <a href="mailto:enquires@vorkhive.com">enquires@vorkhive.com</a>. We may need to verify your identity before acting on a request.</p>

        <h2>10. Cookies</h2>
        <p>We use cookies and similar technologies to operate the site, remember your preferences and measure usage. You can control cookies through your browser settings; disabling some cookies may affect how the site works.</p>

        <h2>11. Children</h2>
        <p>The Service is intended for businesses and is not directed to children. We do not knowingly collect personal data from children.</p>

        <h2>12. Changes to this policy</h2>
        <p>We may update this Privacy Policy from time to time. We will post the updated version here and revise the "Last updated" date above. Material changes may be notified by email or through the Service.</p>

        <h2>13. Contact us</h2>
        <p>For privacy questions or to reach our data protection contact, email <a href="mailto:enquires@vorkhive.com">enquires@vorkhive.com</a>. You may also write to us at our registered address in Singapore.</p>
      </section>
    </MarketingShell>
  );
}
