import LpTemplate from "@/components/landing/LpTemplate";

const LoanForRentLP = () => (
  <LpTemplate
    role="tenant"
    product="loan-for-rent"
    eyebrow="Loan for Rent"
    headline={<>Rent due now? <span className="text-accent">We've got you.</span></>}
    subheadline="Get a same-week rent loan, repay over 12 months, and stay in your home — without breaking your budget."
    bullets={[
      "Decisions in 48 hours after document submission",
      "Repay monthly over 6 to 12 months",
      "Transparent, fixed pricing — no hidden fees",
    ]}
    ctaLabel="Apply for a rent loan"
    trust={["GTBank", "Stanbic IBTC", "MyCover.AI", "Bujeti"]}
    testimonial={{
      quote: "My landlord wouldn't take monthly. Renteaze paid him in full and I'm now paying back comfortably from salary.",
      name: "Tunde O.",
      role: "Tenant, Lekki",
    }}
    faqs={[
      { q: "What do I need to qualify?", a: "A valid NIN, BVN, recent payslip or business bank statement (3 months), and a verified employer or business." },
      { q: "How fast is approval?", a: "Most applicants get a decision within 48 hours of completing KYC. Funds are paid directly to your landlord." },
      { q: "What's the interest rate?", a: "Pricing depends on tenor and risk profile. We share full repayment schedule before you sign — no surprises." },
    ]}
  />
);

export default LoanForRentLP;
