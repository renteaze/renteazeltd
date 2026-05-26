import LegalPage from "@/components/legal/LegalPage";

const Privacy = () => (
  <LegalPage
    title="Privacy Policy"
    description="How Renteaze collects, uses, stores, and protects your personal data — aligned with the Nigeria Data Protection Act (NDPA)."
  >
    <h2>1. Who We Are</h2>
    <p>
      Renteaze International Limited (RC 1768094) is the data controller responsible for the personal
      data processed through our platform.
    </p>

    <h2>2. Data We Collect</h2>
    <ul>
      <li><strong>Identity:</strong> name, date of birth, gender, NIN, BVN.</li>
      <li><strong>Contact:</strong> email, phone, residential and office address.</li>
      <li><strong>Financial:</strong> bank account details, income, rent history, savings activity.</li>
      <li><strong>Usage:</strong> device information, IP address, pages visited, cookies.</li>
      <li><strong>Survey responses:</strong> answers you provide in our onboarding survey.</li>
    </ul>

    <h2>3. How We Use Your Data</h2>
    <ul>
      <li>To deliver and improve Renteaze products (Save for Rent, Loan for Rent, Property Management, Investments, Partner Programme).</li>
      <li>To verify identity and run KYC, AML, and credit checks.</li>
      <li>To process payments, payouts, and rent collections.</li>
      <li>To communicate with you about your account and (with consent) marketing.</li>
      <li>To meet legal, regulatory, and tax obligations.</li>
    </ul>

    <h2>4. Lawful Basis</h2>
    <p>
      We process personal data on the basis of contract performance, legal obligation, your consent,
      and our legitimate business interests in operating a secure platform.
    </p>

    <h2>5. Sharing</h2>
    <p>
      We share data with regulated service providers (banks, KYC providers, payment processors,
      hosting and analytics vendors), and with regulators or law enforcement where required. We do
      not sell your personal data.
    </p>

    <h2>6. Data Retention</h2>
    <p>
      We retain personal data for as long as needed to provide the services and to comply with legal
      and regulatory obligations.
    </p>

    <h2>7. Your Rights (NDPA)</h2>
    <ul>
      <li>Right to access, correct, or delete your personal data.</li>
      <li>Right to object to or restrict certain processing.</li>
      <li>Right to data portability where applicable.</li>
      <li>Right to withdraw consent and to lodge a complaint with the Nigeria Data Protection Commission.</li>
    </ul>
    <p>
      To exercise these rights, email <a href="mailto:privacy@renteaze.com">privacy@renteaze.com</a>.
    </p>

    <h2>8. Cookies</h2>
    <p>
      We use cookies and similar technologies as described in our <a href="/legal/cookies">Cookie Policy</a>.
    </p>

    <h2>9. Security</h2>
    <p>
      We use encryption in transit and at rest, role-based access, and regular reviews to protect
      your data. No system is completely secure; report concerns to{" "}
      <a href="mailto:security@renteaze.com">security@renteaze.com</a>.
    </p>

    <h2>10. International Transfers</h2>
    <p>
      Some of our service providers operate outside Nigeria. Where data is transferred abroad, we use
      contractual and technical safeguards consistent with the NDPA.
    </p>

    <h2>11. Updates</h2>
    <p>
      We may update this policy as our services evolve. Material changes will be notified through the
      platform or by email.
    </p>
  </LegalPage>
);

export default Privacy;
