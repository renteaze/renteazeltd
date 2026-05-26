import LegalPage from "@/components/legal/LegalPage";

const AmlKyc = () => (
  <LegalPage
    title="AML &amp; KYC Policy"
    description="Renteaze's commitment to anti-money laundering, counter-terrorism financing, and Know Your Customer obligations."
  >
    <h2>1. Our Commitment</h2>
    <p>
      Renteaze is committed to complying with Nigerian AML/CFT regulations, including the Money
      Laundering (Prevention and Prohibition) Act and applicable CBN, NFIU, and SEC guidelines.
    </p>

    <h2>2. Customer Identification (KYC)</h2>
    <p>
      Before activating financial features (Save for Rent, Loan for Rent, Investments, Payouts), we
      verify customer identity using:
    </p>
    <ul>
      <li>Government-issued identifiers (NIN, BVN).</li>
      <li>Bank account verification.</li>
      <li>Proof of address where required.</li>
      <li>Source-of-funds checks for large or unusual transactions.</li>
    </ul>

    <h2>3. Sanctions &amp; PEP Screening</h2>
    <p>
      We screen customers against domestic and international sanctions lists and assess politically
      exposed persons (PEPs) for enhanced due diligence.
    </p>

    <h2>4. Ongoing Monitoring</h2>
    <p>
      Customer activity is monitored for unusual patterns. Suspicious transactions are escalated and
      reported to the appropriate regulatory authorities as required by law.
    </p>

    <h2>5. Record-Keeping</h2>
    <p>
      We retain KYC and transaction records for the minimum period required by law (currently 5
      years from the end of the relationship or transaction, whichever is later).
    </p>

    <h2>6. Refusal &amp; Termination</h2>
    <p>
      We may decline to onboard or may terminate accounts where verification fails, where we are
      unable to satisfy AML/CFT requirements, or where activity is suspected of being unlawful.
    </p>

    <h2>7. Reporting Concerns</h2>
    <p>
      To report a compliance concern, email{" "}
      <a href="mailto:compliance@renteaze.com">compliance@renteaze.com</a>.
    </p>
  </LegalPage>
);

export default AmlKyc;
