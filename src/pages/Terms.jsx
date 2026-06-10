import { Link } from 'react-router-dom';
import { MarketingShell } from './Shell.jsx';

export default function Terms() {
  return (
    <MarketingShell>
      <section className="article legal">
        <p className="eyebrow">Legal</p>
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: 11 June 2026</p>
        <p className="lede">These Terms of Service ("Terms") govern your access to and use of the Vorkhive website and the Vorkhive human-resources platform (together, the "Service"), operated by Vorkhive ("Vorkhive", "we", "us"). By accessing or using the Service, you agree to these Terms.</p>

        <h2>1. Agreement to these Terms</h2>
        <p>By creating an account, starting a trial, booking a demo, or otherwise using the Service, you confirm that you have read, understood and agree to be bound by these Terms and our <Link to="/privacy">Privacy Policy</Link>. If you are using the Service on behalf of an organisation, you represent that you are authorised to bind that organisation to these Terms.</p>

        <h2>2. The Service</h2>
        <p>Vorkhive provides a cloud-based HR management system (HRMS) for managing functions such as leave, claims, attendance, payroll and related compliance tasks. Features, plans and pricing may change over time. We may add, modify or discontinue parts of the Service, and will use reasonable efforts to notify you of material changes.</p>

        <h2>3. Accounts and eligibility</h2>
        <p>You must provide accurate information when registering and keep it up to date. You are responsible for safeguarding your login credentials and for all activity that occurs under your account. Notify us promptly at <a href="mailto:enquires@vorkhive.com">enquires@vorkhive.com</a> of any unauthorised use. You must be at least 18 years old and able to form a binding contract to use the Service.</p>

        <h2>4. Acceptable use</h2>
        <p>You agree not to: (a) use the Service unlawfully or in breach of any applicable regulation; (b) upload malicious code or attempt to gain unauthorised access to the Service or other accounts; (c) interfere with or disrupt the integrity or performance of the Service; (d) reverse engineer or copy the Service except as permitted by law; or (e) use the Service to store or transmit content that infringes the rights of others.</p>

        <h2>5. Subscriptions, fees and payment</h2>
        <p>Paid plans are billed in advance on a recurring basis (monthly or as otherwise agreed) at the prices displayed at the time of purchase. Unless stated otherwise, fees are exclusive of applicable taxes. Fees are non-refundable except where required by law. We may revise pricing on renewal with prior notice.</p>

        <h2>6. Free trials</h2>
        <p>We may offer free trials. At the end of a trial, paid charges may begin unless you cancel beforehand, in line with the terms presented when you start the trial. We may modify or withdraw trials at any time.</p>

        <h2>7. Your data</h2>
        <p>As between you and Vorkhive, you retain all rights to the data you and your users submit to the Service ("Customer Data"). You grant us a limited licence to host, process and use Customer Data solely to provide and improve the Service and as described in our <Link to="/privacy">Privacy Policy</Link>. You are responsible for the accuracy and lawfulness of Customer Data and for obtaining any necessary consents from your personnel.</p>

        <h2>8. Compliance is your responsibility</h2>
        <p>Vorkhive provides tools to help you manage HR, payroll and statutory obligations (including CPF, MOM-related and IRAS-related tasks). However, you remain solely responsible for your own legal and regulatory compliance, for verifying outputs, and for any filings or payments you make. The Service is provided as a tool and does not constitute legal, tax or accounting advice.</p>

        <h2>9. Intellectual property</h2>
        <p>The Service, including its software, design, trademarks and content (excluding Customer Data), is owned by Vorkhive or its licensors and is protected by intellectual-property laws. Except for the rights expressly granted to you, no rights are transferred.</p>

        <h2>10. Third-party services</h2>
        <p>The Service may integrate with or link to third-party services. We are not responsible for third-party services, and your use of them is governed by their own terms.</p>

        <h2>11. Disclaimers</h2>
        <p>The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose and non-infringement. We do not warrant that the Service will be uninterrupted, error-free or that it will meet every requirement.</p>

        <h2>12. Limitation of liability</h2>
        <p>To the maximum extent permitted by law, Vorkhive will not be liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of profits, revenue or data. Our total aggregate liability arising out of or relating to the Service will not exceed the amounts you paid to us for the Service in the twelve (12) months preceding the claim.</p>

        <h2>13. Indemnity</h2>
        <p>You agree to indemnify and hold Vorkhive harmless from claims arising out of your Customer Data, your use of the Service, or your breach of these Terms or applicable law.</p>

        <h2>14. Suspension and termination</h2>
        <p>You may stop using the Service at any time. We may suspend or terminate access if you breach these Terms, fail to pay fees, or where required to protect the Service or comply with law. On termination, your right to use the Service ceases; provisions that by their nature should survive will survive.</p>

        <h2>15. Changes to these Terms</h2>
        <p>We may update these Terms from time to time. If we make material changes, we will take reasonable steps to notify you (for example, by email or via the Service). Your continued use after changes take effect constitutes acceptance.</p>

        <h2>16. Governing law</h2>
        <p>These Terms are governed by the laws of Singapore, and the courts of Singapore have exclusive jurisdiction over any dispute, without regard to conflict-of-laws principles.</p>

        <h2>17. Contact</h2>
        <p>Questions about these Terms? Email <a href="mailto:enquires@vorkhive.com">enquires@vorkhive.com</a>.</p>
      </section>
    </MarketingShell>
  );
}
