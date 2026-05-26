import LegalPage from "@/components/legal/LegalPage";

const toc = [
  { id: "controller", label: "1. Who we are" },
  { id: "scope", label: "2. Scope" },
  { id: "data", label: "3. Data we collect" },
  { id: "sources", label: "4. Sources" },
  { id: "purposes", label: "5. Purposes & legal bases" },
  { id: "sharing", label: "6. Sharing & processors" },
  { id: "transfers", label: "7. International transfers" },
  { id: "retention", label: "8. Retention" },
  { id: "gdpr-rights", label: "9. EU / UK rights" },
  { id: "ccpa-rights", label: "10. California rights" },
  { id: "ndpa-rights", label: "11. Nigeria rights" },
  { id: "exercise", label: "12. Exercising rights" },
  { id: "automated", label: "13. Automated decisions" },
  { id: "children", label: "14. Children" },
  { id: "security", label: "15. Security & breaches" },
  { id: "complaints", label: "16. Complaints" },
  { id: "contact", label: "17. Contact" },
  { id: "changes", label: "18. Changes" },
];

const Privacy = () => (
  <LegalPage
    title="Privacy Policy"
    description="How Renteaze collects, uses, shares, and protects your personal data — aligned with the EU/UK GDPR, California CCPA/CPRA, and the Nigeria Data Protection Act."
    effectiveDate="16 May 2026"
    version="2.0"
    tableOfContents={toc}
  >
    <h2 id="controller">1. Who we are</h2>
    <p>
      Renteaze International Limited (RC 1768094), a company incorporated in Nigeria with its
      registered office in Lagos, is the data controller responsible for the personal data
      processed through the Renteaze platform, mobile apps, and related services
      (together, the <strong>Services</strong>).
    </p>
    <p>
      Our Data Protection Officer can be reached at{" "}
      <a href="mailto:dpo@renteaze.com">dpo@renteaze.com</a>.
    </p>

    <h2 id="scope">2. Scope of this policy</h2>
    <p>
      This policy applies to all users of the Services worldwide, including tenants, landlords,
      investors, partners, and visitors. Additional product-specific notices may apply at the
      point of collection.
    </p>

    <h2 id="data">3. Personal data we collect</h2>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Examples</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Identity</td>
          <td>Full name, date of birth, gender, nationality, photo / selfie, government ID, NIN, BVN.</td>
        </tr>
        <tr>
          <td>Contact</td>
          <td>Email, phone number, residential and billing address.</td>
        </tr>
        <tr>
          <td>Financial</td>
          <td>Bank account details, card details (tokenised), income, rent history, transaction history.</td>
        </tr>
        <tr>
          <td>KYC / AML</td>
          <td>Proof of address, source-of-funds evidence, sanctions and PEP screening results.</td>
        </tr>
        <tr>
          <td>Device & usage</td>
          <td>IP address, device identifiers, browser, operating system, pages viewed, clickstream, crash logs.</td>
        </tr>
        <tr>
          <td>Cookies & similar</td>
          <td>See our <a href="/legal/cookies">Cookie Policy</a>.</td>
        </tr>
        <tr>
          <td>Communications</td>
          <td>Messages, support tickets, recorded calls (where notified).</td>
        </tr>
        <tr>
          <td>Sensitive PI (CCPA)</td>
          <td>Government ID, account credentials, precise geolocation (only where strictly required).</td>
        </tr>
      </tbody>
    </table>

    <h2 id="sources">4. Sources</h2>
    <p>
      We collect personal data directly from you, from your device, from publicly available sources,
      and from third parties such as identity-verification providers, credit reference bureaus,
      payment processors, banks, fraud-prevention services, and sanctions databases.
    </p>

    <h2 id="purposes">5. Purposes and legal bases</h2>
    <table>
      <thead>
        <tr>
          <th>Purpose</th>
          <th>Legal basis (GDPR Art. 6)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Providing the Services and managing your account</td><td>Contract</td></tr>
        <tr><td>Identity verification, KYC, AML, sanctions screening</td><td>Legal obligation</td></tr>
        <tr><td>Credit assessment and affordability checks</td><td>Contract; legitimate interests</td></tr>
        <tr><td>Processing payments, payouts and rent collection</td><td>Contract</td></tr>
        <tr><td>Customer support and service communications</td><td>Contract; legitimate interests</td></tr>
        <tr><td>Marketing communications</td><td>Consent (you may withdraw at any time)</td></tr>
        <tr><td>Product analytics and improvement</td><td>Legitimate interests</td></tr>
        <tr><td>Fraud prevention and platform security</td><td>Legal obligation; legitimate interests</td></tr>
        <tr><td>Regulatory, tax and accounting obligations</td><td>Legal obligation</td></tr>
        <tr><td>Establishing, exercising or defending legal claims</td><td>Legitimate interests</td></tr>
      </tbody>
    </table>

    <h2 id="sharing">6. Sharing and processors</h2>
    <p>We share personal data with the following categories of recipients:</p>
    <ul>
      <li>Regulated service providers: banks, payment processors, KYC/identity vendors, credit bureaus, fraud-prevention partners.</li>
      <li>Cloud infrastructure, hosting, email, and analytics processors acting on our documented instructions.</li>
      <li>Professional advisers (auditors, lawyers, insurers) under duties of confidentiality.</li>
      <li>Regulators, courts, and law-enforcement agencies where required by law.</li>
      <li>A buyer or successor in the event of a merger, acquisition, or reorganisation.</li>
    </ul>
    <p><strong>We do not sell personal data</strong> and we do not "share" personal data for cross-context behavioural advertising as defined under the CCPA/CPRA.</p>

    <h2 id="transfers">7. International transfers</h2>
    <p>
      Renteaze is based in Nigeria and uses processors located in the European Economic Area,
      United Kingdom, United States, and other jurisdictions. Where personal data is transferred
      outside your country, we rely on appropriate safeguards including the European Commission's
      Standard Contractual Clauses, the UK International Data Transfer Addendum, adequacy decisions
      where available, and equivalent measures under the Nigeria Data Protection Act.
    </p>

    <h2 id="retention">8. Retention</h2>
    <table>
      <thead>
        <tr><th>Record type</th><th>Retention period</th></tr>
      </thead>
      <tbody>
        <tr><td>Account and profile data</td><td>Duration of relationship + 7 years</td></tr>
        <tr><td>KYC and AML records</td><td>5 years after account closure (MLPPA 2022)</td></tr>
        <tr><td>Transaction and tax records</td><td>7 years (statutory)</td></tr>
        <tr><td>Marketing preferences</td><td>Until you withdraw consent</td></tr>
        <tr><td>Support communications</td><td>3 years</td></tr>
        <tr><td>Cookie data</td><td>See <a href="/legal/cookies">Cookie Policy</a></td></tr>
      </tbody>
    </table>

    <h2 id="gdpr-rights">9. Your rights under the EU / UK GDPR</h2>
    <p>If you are in the EEA, UK, or Switzerland, you have the right to:</p>
    <ul>
      <li>access a copy of your personal data;</li>
      <li>rectify inaccurate or incomplete data;</li>
      <li>erase your data ("right to be forgotten") in certain circumstances;</li>
      <li>restrict processing while we investigate;</li>
      <li>data portability for data you have provided;</li>
      <li>object to processing based on legitimate interests, including profiling;</li>
      <li>withdraw consent at any time without affecting prior lawful processing;</li>
      <li>not be subject to a solely automated decision with legal or similarly significant effects.</li>
    </ul>

    <h2 id="ccpa-rights">10. Your rights under California law (CCPA/CPRA)</h2>
    <p>If you are a California resident you have the right to:</p>
    <ul>
      <li>know what personal information we collect, use, disclose, and (where applicable) sell or share;</li>
      <li>delete personal information we have collected, subject to legal exceptions;</li>
      <li>correct inaccurate personal information;</li>
      <li>opt out of the "sale" or "sharing" of personal information — Renteaze does not sell or share;</li>
      <li>limit the use of sensitive personal information to permitted purposes;</li>
      <li>non-discrimination for exercising any of these rights.</li>
    </ul>
    <p>
      We honor Global Privacy Control (GPC) browser signals as a valid opt-out of sale and sharing.
      You may also designate an authorised agent in writing to exercise rights on your behalf.
    </p>

    <h2 id="ndpa-rights">11. Your rights under the Nigeria Data Protection Act</h2>
    <p>If you are a data subject in Nigeria you have rights to access, rectification, erasure,
      restriction, portability, objection, and to withdraw consent. You may also lodge a complaint
      with the Nigeria Data Protection Commission.</p>

    <h2 id="exercise">12. Exercising your rights</h2>
    <p>
      Submit requests to <a href="mailto:dpo@renteaze.com">dpo@renteaze.com</a>. We will respond
      within one month (GDPR), 45 days (CCPA), or as required by the NDPA. We may need to verify
      your identity before acting. Where a request is manifestly unfounded or excessive we may
      charge a reasonable fee or refuse.
    </p>

    <h2 id="automated">13. Automated decision-making</h2>
    <p>
      We use automated processes for fraud detection, sanctions screening, and credit scoring
      (including for Loan for Rent and Save for Rent). These decisions may significantly affect
      you. You have the right to request human review, express your point of view, and contest
      the decision by contacting <a href="mailto:dpo@renteaze.com">dpo@renteaze.com</a>.
    </p>

    <h2 id="children">14. Children</h2>
    <p>
      The Services are not directed to anyone under 18. We do not knowingly collect personal data
      from children. If you believe a minor has provided us data, contact us so we can delete it.
    </p>

    <h2 id="security">15. Security and breach notification</h2>
    <p>
      We apply encryption in transit (TLS 1.2+) and at rest, role-based access controls, network
      segmentation, vulnerability management, and continuous monitoring. No system is perfectly
      secure. Where a breach is likely to result in a risk to your rights, we will notify you and
      the relevant regulator(s) without undue delay and, where feasible, within 72 hours as
      required by the GDPR and NDPA.
    </p>

    <h2 id="complaints">16. Complaints</h2>
    <p>We encourage you to contact us first, but you have the right to complain to your local authority:</p>
    <ul>
      <li><strong>Nigeria:</strong> Nigeria Data Protection Commission (NDPC)</li>
      <li><strong>UK:</strong> Information Commissioner's Office (ICO) — ico.org.uk</li>
      <li><strong>EU:</strong> your national supervisory authority — edpb.europa.eu</li>
      <li><strong>California:</strong> California Privacy Protection Agency (CPPA) and California Attorney General</li>
    </ul>

    <h2 id="contact">17. Contact</h2>
    <p>
      Renteaze International Limited<br />
      Data Protection Officer<br />
      <a href="mailto:dpo@renteaze.com">dpo@renteaze.com</a>
    </p>

    <h2 id="changes">18. Changes to this policy</h2>
    <p>
      We may update this policy as our Services or applicable law evolve. Material changes will be
      notified through the platform or by email at least 30 days before they take effect.
    </p>
  </LegalPage>
);

export default Privacy;
