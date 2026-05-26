import LegalPage from "@/components/legal/LegalPage";

const toc = [
  { id: "acceptance", label: "1. Acceptance" },
  { id: "definitions", label: "2. Definitions" },
  { id: "eligibility", label: "3. Eligibility" },
  { id: "accounts", label: "4. Accounts & security" },
  { id: "electronic", label: "5. Electronic contracting" },
  { id: "tenant", label: "6. Tenant products" },
  { id: "landlord", label: "7. Landlord services" },
  { id: "investor", label: "8. Investor services" },
  { id: "partner", label: "9. Partner programme" },
  { id: "fees", label: "10. Fees & payments" },
  { id: "refunds", label: "11. Refunds & chargebacks" },
  { id: "use", label: "12. Acceptable use" },
  { id: "ip", label: "13. Intellectual property" },
  { id: "third-party", label: "14. Third-party services" },
  { id: "suspension", label: "15. Suspension & termination" },
  { id: "consumer", label: "16. Consumer rights" },
  { id: "warranty", label: "17. Disclaimers" },
  { id: "liability", label: "18. Limitation of liability" },
  { id: "indemnity", label: "19. Indemnity" },
  { id: "force", label: "20. Force majeure" },
  { id: "changes", label: "21. Changes" },
  { id: "disputes", label: "22. Disputes" },
  { id: "general", label: "23. General" },
  { id: "contact", label: "24. Contact" },
];

const Terms = () => (
  <LegalPage
    title="Terms of Service"
    description="The legally binding agreement between you and Renteaze for use of our tenant, landlord, investor, and partner products."
    effectiveDate="16 May 2026"
    version="2.0"
    tableOfContents={toc}
  >
    <h2 id="acceptance">1. Acceptance of these terms</h2>
    <p>
      These Terms of Service (the <strong>Terms</strong>) form a binding contract between you and
      Renteaze International Limited (<strong>"Renteaze"</strong>, <strong>"we"</strong>,{" "}
      <strong>"us"</strong>). By creating an account, accessing, or using any Renteaze product, you
      confirm that you have read, understood, and agreed to these Terms and our{" "}
      <a href="/legal/privacy">Privacy Policy</a>.
    </p>

    <h2 id="definitions">2. Definitions</h2>
    <ul>
      <li><strong>Services</strong> — the Renteaze website, mobile apps, dashboards, APIs, and all related products.</li>
      <li><strong>Account</strong> — your authenticated profile on the Services.</li>
      <li><strong>Content</strong> — text, files, listings, images, and other material submitted to the Services.</li>
      <li><strong>Product Terms</strong> — additional terms presented when you enroll in a specific product (Save for Rent, Loan for Rent, Property Management, Investments, Partner Programme).</li>
    </ul>

    <h2 id="eligibility">3. Eligibility</h2>
    <p>
      You must be at least 18 years old and legally able to enter into a binding contract under the
      laws of your jurisdiction.
    </p>
    <p>
      Some products require additional verification and may be restricted to verified Nigerian
      residents or, where applicable, Nigerians in the diaspora.
    </p>
    <p>
      You confirm you are not located in, or a national or resident of, a jurisdiction subject to
      comprehensive sanctions, and you are not on any sanctions or denied-party list.
    </p>

    <h2 id="accounts">4. Accounts and security</h2>
    <ul>
      <li>Keep your login credentials confidential and enable any available multi-factor protections.</li>
      <li>Provide accurate, current, and complete information and update it promptly.</li>
      <li>You are responsible for all activity under your Account.</li>
      <li>Notify us immediately at <a href="mailto:security@renteaze.com">security@renteaze.com</a> of any unauthorised access.</li>
    </ul>

    <h2 id="electronic">5. Electronic contracting</h2>
    <p>
      You agree that electronic signatures, click-through acceptance, and records have the same
      legal effect as handwritten signatures and paper records, to the extent permitted by
      applicable law (including the Nigerian Evidence Act 2011, the EU eIDAS Regulation, the UK
      Electronic Communications Act 2000, and the US ESIGN Act).
    </p>

    <h2 id="tenant">6. Tenant products — Save for Rent & Loan for Rent</h2>
    <p>
      Tenant products are subject to credit assessment, KYC checks, and the applicable Product
      Terms presented at sign-up.
    </p>
    <p>
      Savings contributions are held in segregated accounts. Loan terms, interest, fees, and
      repayment schedules are disclosed before you accept and form a separate credit agreement.
    </p>

    <h2 id="landlord">7. Landlord services — Property Management</h2>
    <p>
      Landlords appoint Renteaze to market and manage listed properties under a separate Management
      Agreement. Service fees, payout schedules, and termination conditions are described in that
      agreement and reflected in your dashboard.
    </p>

    <h2 id="investor">8. Investor services</h2>
    <p>
      Investment opportunities are offered to qualifying investors and are governed by the
      deal-specific subscription documents, risk disclosures, and our{" "}
      <a href="/legal/disclaimer">Investment Disclaimer</a>. <strong>Investments involve risk,
      including total loss of capital.</strong> Past performance is not a reliable indicator of
      future results.
    </p>

    <h2 id="partner">9. Partner programme</h2>
    <p>
      Professional partners earn commissions on closed deals attributed to their referral code,
      under the Partner Programme Agreement. Commissions, payout terms, conduct standards, and
      claw-back conditions are detailed in that agreement.
    </p>

    <h2 id="fees">10. Fees and payments</h2>
    <p>
      Fees applicable to each product are disclosed before you accept the relevant Product Terms.
      You authorise Renteaze and its payment processors to debit and credit your designated
      account in accordance with those Product Terms.
    </p>
    <p>
      All amounts are payable in Nigerian Naira unless otherwise stated; foreign-currency
      conversions use the rate applied by our processor at the time of settlement.
    </p>

    <h2 id="refunds">11. Refunds and chargebacks</h2>
    <p>
      Eligibility for refunds is set out in the relevant Product Terms and, where applicable, by
      mandatory consumer-protection law.
    </p>
    <p>
      Initiating a chargeback without first contacting us may result in suspension while we
      investigate. Misuse of chargebacks may be reported to your card issuer and to fraud
      databases.
    </p>

    <h2 id="use">12. Acceptable use</h2>
    <p>You agree not to:</p>
    <ul>
      <li>use the Services for fraud, money laundering, terrorism financing, or any unlawful purpose;</li>
      <li>impersonate another person or misrepresent your affiliation;</li>
      <li>upload viruses, scrape, reverse-engineer, or interfere with the Services;</li>
      <li>circumvent security, rate limits, or access controls;</li>
      <li>harass, threaten, or discriminate against other users or our staff;</li>
      <li>post content that infringes intellectual property or privacy rights.</li>
    </ul>

    <h2 id="ip">13. Intellectual property</h2>
    <p>
      Renteaze, our logos, designs, and platform content are owned by Renteaze International
      Limited or our licensors and protected by intellectual-property laws.
    </p>
    <p>
      We grant you a limited, revocable, non-exclusive, non-transferable licence to use the
      Services for their intended purpose.
    </p>
    <p>
      You retain ownership of Content you submit, but grant us a worldwide, royalty-free licence
      to host, store, reproduce, and display it solely to operate the Services.
    </p>

    <h2 id="third-party">14. Third-party services</h2>
    <p>
      The Services may integrate third-party services (banks, payment processors, identity
      providers, maps). Your use of those services is governed by their own terms, and Renteaze
      is not responsible for third-party content or conduct.
    </p>

    <h2 id="suspension">15. Suspension and termination</h2>
    <p>
      We may suspend or terminate your Account, with or without notice, if you breach these Terms
      or any Product Terms, if we suspect fraud or illegal activity, if required by law or
      regulator, or if continued provision would create unacceptable risk.
    </p>
    <p>
      You may close your Account at any time, subject to settling outstanding obligations.
    </p>
    <p>
      Sections that by their nature should survive termination (IP, liability, indemnity,
      disputes) will survive.
    </p>

    <h2 id="consumer">16. Consumer rights</h2>
    <p>
      Nothing in these Terms limits any non-waivable statutory rights you have as a consumer,
      including under the Nigerian Federal Competition and Consumer Protection Act 2018, the
      UK Consumer Rights Act 2015, EU consumer-protection directives, or equivalent laws.
    </p>

    <h2 id="warranty">17. Disclaimers</h2>
    <p>
      The Services are provided <strong>"as is"</strong> and <strong>"as available"</strong>. To
      the maximum extent permitted by law, Renteaze disclaims all implied warranties including
      merchantability, fitness for a particular purpose, and non-infringement. We do not warrant
      uninterrupted or error-free operation.
    </p>

    <h2 id="liability">18. Limitation of liability</h2>
    <p>
      To the maximum extent permitted by law, Renteaze's aggregate liability arising out of or
      related to the Services in any 12-month period will not exceed the greater of: (a) the fees
      you paid us in that period; or (b) NGN 100,000.
    </p>
    <p>
      We will not be liable for indirect, incidental, consequential, special, exemplary, or
      punitive damages, or for lost profits, revenue, data, or goodwill.
    </p>
    <p>
      <strong>Nothing in these Terms excludes liability for fraud, death or personal injury
      caused by negligence, or any liability that cannot lawfully be excluded.</strong>
    </p>

    <h2 id="indemnity">19. Indemnity</h2>
    <p>
      You will indemnify and hold harmless Renteaze, its affiliates, and personnel from claims and
      losses arising out of your breach of these Terms, your Content, or your unlawful use of the
      Services.
    </p>

    <h2 id="force">20. Force majeure</h2>
    <p>
      Neither party is liable for failure or delay caused by events beyond reasonable control,
      including natural disasters, war, terrorism, civil unrest, strikes, pandemics, regulatory
      action, internet or power outages, or third-party infrastructure failures.
    </p>

    <h2 id="changes">21. Changes to these terms</h2>
    <p>
      We may update these Terms from time to time. Material changes will be notified through the
      Services or by email at least 30 days before they take effect.
    </p>
    <p>
      Continued use after the effective date constitutes acceptance. If you do not agree, you
      should stop using the Services and close your Account.
    </p>

    <h2 id="disputes">22. Dispute resolution</h2>
    <p>
      Please contact <a href="mailto:legal@renteaze.com">legal@renteaze.com</a> first so we can try
      to resolve any dispute informally.
    </p>
    <p>
      If we cannot resolve a dispute within 30 days, the dispute will be referred to mediation in
      Lagos, and failing settlement, to the courts of Lagos State, Nigeria.
    </p>
    <p>
      Where mandatory law gives you the right to bring proceedings in your country of residence,
      that right is preserved.
    </p>

    <h2 id="general">23. General</h2>
    <ul>
      <li><strong>Governing law:</strong> the laws of the Federal Republic of Nigeria, without regard to conflict-of-laws rules.</li>
      <li><strong>Assignment:</strong> you may not assign these Terms; we may assign to an affiliate or successor.</li>
      <li><strong>Severability:</strong> if any provision is unenforceable, the rest remain in effect.</li>
      <li><strong>No waiver:</strong> failure to enforce a provision is not a waiver.</li>
      <li><strong>Entire agreement:</strong> these Terms plus the applicable Product Terms form the entire agreement.</li>
      <li><strong>Notices:</strong> we may notify you in the Services or by email; you may notify us at <a href="mailto:legal@renteaze.com">legal@renteaze.com</a>.</li>
    </ul>

    <h2 id="contact">24. Contact</h2>
    <p>
      Renteaze International Limited<br />
      Legal Department<br />
      <a href="mailto:legal@renteaze.com">legal@renteaze.com</a>
    </p>
  </LegalPage>
);

export default Terms;
