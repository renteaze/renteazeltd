import LegalPage from "@/components/legal/LegalPage";

const toc = [
  { id: "purpose", label: "1. Purpose & scope" },
  { id: "framework", label: "2. Regulatory framework" },
  { id: "governance", label: "3. Governance" },
  { id: "rba", label: "4. Risk-based approach" },
  { id: "cdd", label: "5. Customer due diligence" },
  { id: "edd", label: "6. Enhanced due diligence" },
  { id: "pep", label: "7. PEPs & sanctions" },
  { id: "sof", label: "8. Source of funds" },
  { id: "monitoring", label: "9. Ongoing monitoring" },
  { id: "str", label: "10. Suspicious transaction reporting" },
  { id: "records", label: "11. Record retention" },
  { id: "training", label: "12. Training & culture" },
  { id: "cooperation", label: "13. Customer cooperation" },
  { id: "refusal", label: "14. Refusal & exit" },
  { id: "contact", label: "15. Contact" },
];

const AmlKyc = () => (
  <LegalPage
    title="AML / KYC Policy"
    description="Our framework for preventing money laundering, terrorism financing, and financial crime — aligned with FATF Recommendations and applicable Nigerian, EU, UK, and US sanctions regimes."
    effectiveDate="16 May 2026"
    version="2.0"
    tableOfContents={toc}
  >
    <h2 id="purpose">1. Purpose and scope</h2>
    <p>
      Renteaze is committed to preventing the use of its Services for money laundering, terrorism
      financing, proliferation financing, fraud, bribery, tax evasion, and the evasion of
      international sanctions. This policy applies to all customers, employees, contractors, and
      third-party partners.
    </p>

    <h2 id="framework">2. Regulatory framework</h2>
    <ul>
      <li>Nigeria: Money Laundering (Prevention and Prohibition) Act 2022, Terrorism (Prevention and Prohibition) Act 2022, CBN AML/CFT/CPF Regulations, SEC AML/CFT Regulations, and NFIU guidance.</li>
      <li>International standards: FATF 40 Recommendations.</li>
      <li>Sanctions: UN Security Council, US OFAC, EU Council, UK OFSI / HMT consolidated lists.</li>
      <li>Where applicable to in-scope users: EU AMLD, UK MLR 2017, US Bank Secrecy Act / USA PATRIOT Act principles.</li>
    </ul>

    <h2 id="governance">3. Governance</h2>
    <p>
      The Board has overall responsibility for the AML/CFT framework. A Money Laundering Reporting
      Officer (MLRO) and Chief Compliance Officer oversee day-to-day implementation, file
      regulatory reports, and report to the Board. The framework is independently reviewed at
      least annually.
    </p>

    <h2 id="rba">4. Risk-based approach</h2>
    <p>
      We assess customer, product, geographic, channel, and transaction risk and calibrate
      controls accordingly. Our enterprise-wide risk assessment is reviewed at least annually and
      whenever there is a material change in business or regulation.
    </p>

    <h2 id="cdd">5. Customer due diligence (CDD)</h2>
    <p>Before establishing a business relationship we collect and verify:</p>
    <ul>
      <li><strong>Individuals:</strong> full legal name, date of birth, residential address, government-issued photo ID, NIN, BVN (Nigerian residents), tax identification where applicable, and a liveness/biometric check.</li>
      <li><strong>Entities:</strong> certificate of incorporation, constitutional documents, ownership and control structure, ultimate beneficial owners (UBOs ≥ 25% or otherwise exercising control), directors, and authorised signatories.</li>
      <li><strong>Purpose & intended nature</strong> of the relationship.</li>
    </ul>

    <h2 id="edd">6. Enhanced due diligence (EDD)</h2>
    <p>EDD applies to higher-risk relationships, including:</p>
    <ul>
      <li>Politically Exposed Persons (PEPs), their family members, and close associates;</li>
      <li>Customers from higher-risk jurisdictions identified by FATF or our internal assessment;</li>
      <li>Complex, unusual, or large transactions without an apparent economic or lawful purpose;</li>
      <li>High-net-worth and high-volume investors;</li>
      <li>Any case where standard CDD raises concerns.</li>
    </ul>
    <p>EDD measures include senior-management approval, additional source-of-funds and source-of-wealth evidence, and increased monitoring frequency.</p>

    <h2 id="pep">7. PEP and sanctions screening</h2>
    <p>
      All customers, UBOs, and connected parties are screened at on-boarding and on an ongoing
      basis against PEP and sanctions lists (UN, OFAC, EU, UK HMT, and local equivalents). Hits
      are reviewed by Compliance; confirmed sanctions matches result in immediate blocking and
      regulatory reporting.
    </p>

    <h2 id="sof">8. Source of funds and source of wealth</h2>
    <p>
      We require credible documentary evidence of the origin of funds used in significant or
      higher-risk transactions, and, where appropriate, the overall economic activity that
      generated the customer's wealth.
    </p>

    <h2 id="monitoring">9. Ongoing monitoring</h2>
    <p>
      We monitor transactions and customer activity throughout the relationship using automated
      rules, behavioural analytics, and human review. Triggered alerts are investigated and
      documented. We refresh CDD on a periodic, risk-based cadence and whenever a trigger event
      occurs.
    </p>

    <h2 id="str">10. Suspicious transaction reporting</h2>
    <p>
      Where Compliance forms a suspicion of money laundering, terrorism financing, or other
      financial crime, we file a Suspicious Transaction Report (STR) with the Nigerian Financial
      Intelligence Unit (NFIU) and any other competent authority, in line with statutory
      deadlines. <strong>Tipping off the customer is a criminal offence and is strictly
      prohibited.</strong>
    </p>

    <h2 id="records">11. Record retention</h2>
    <p>
      We retain CDD records, transaction records, and internal investigation files for at least
      five (5) years after the end of the business relationship or completion of the transaction,
      and longer where required by law or regulator.
    </p>

    <h2 id="training">12. Training and culture</h2>
    <p>
      All employees receive mandatory AML/CFT and sanctions training at induction and at least
      annually, with role-specific training for higher-risk functions. We maintain a confidential
      whistle-blowing channel and protect those who report concerns in good faith.
    </p>

    <h2 id="cooperation">13. Customer cooperation</h2>
    <p>
      You agree to provide all information and documents we reasonably request to meet our AML/KYC
      obligations and to keep that information up to date. Failure to do so may result in us being
      unable to provide, or continue providing, the Services.
    </p>

    <h2 id="refusal">14. Refusal and exit</h2>
    <p>
      We may decline to on-board, suspend, restrict, or terminate the relationship where we cannot
      complete required checks, where there is unacceptable financial-crime risk, or where
      required by law or regulator. Where lawful, we will explain the action taken.
    </p>

    <h2 id="contact">15. Contact</h2>
    <p>
      Compliance / MLRO: <a href="mailto:compliance@renteaze.com">compliance@renteaze.com</a>.
    </p>
  </LegalPage>
);

export default AmlKyc;
