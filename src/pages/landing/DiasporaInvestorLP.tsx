import LpTemplate from "@/components/landing/LpTemplate";

const DiasporaInvestorLP = () => (
  <LpTemplate
    role="investor"
    product="diaspora-investor"
    eyebrow="Diaspora Investing"
    headline={<>Invest in Lagos real estate — <span className="text-accent">without the headaches.</span></>}
    subheadline="From verified listings to title checks, financing, and ongoing management — Renteaze handles every step on the ground while you stay in control from anywhere."
    bullets={[
      "Vetted properties with full title due diligence",
      "Transparent reporting and quarterly performance updates",
      "Local team handles tenants, repairs and remittance",
    ]}
    ctaLabel="Speak with an investment advisor"
    trust={["GTBank", "Stanbic IBTC", "MyCover.AI", "Bujeti", "Zed Crest"]}
    testimonial={{
      quote: "I bought my first Lagos property from London in three months. Everything from inspection to title was handled professionally.",
      name: "Dr. Ngozi E.",
      role: "Investor, London",
    }}
    faqs={[
      { q: "Can I invest from abroad legally?", a: "Yes. Nigerians and non-Nigerians can hold property. We facilitate compliant FX inflow and proper documentation in your name or your company's." },
      { q: "How do I get my returns?", a: "Rental income and any sale proceeds are remitted to your nominated account. Reporting is sent monthly with full transaction history." },
      { q: "What if I want to sell?", a: "We market your property through our buyer network and handle the full sale process — including title transfer and remittance." },
    ]}
  />
);

export default DiasporaInvestorLP;
