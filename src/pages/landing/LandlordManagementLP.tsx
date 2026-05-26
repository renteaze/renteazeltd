import LpTemplate from "@/components/landing/LpTemplate";

const LandlordManagementLP = () => (
  <LpTemplate
    role="landlord"
    product="landlord-management"
    eyebrow="Property Management"
    headline={<>Hands-off property management — <span className="text-accent">guaranteed rent.</span></>}
    subheadline="We market, screen, collect, and maintain. You receive your rent annually — even when your tenant pays monthly."
    bullets={[
      "Guaranteed annual rent collection",
      "Vetted tenants with verified NIN, BVN & employment",
      "Maintenance, inspections, and renewals fully managed",
    ]}
    ctaLabel="List my property"
    trust={["GTBank", "Stanbic IBTC", "MyCover.AI", "Zed Crest"]}
    testimonial={{
      quote: "I haven't had to chase a single tenant in two years. Renteaze just credits my account on time, every year.",
      name: "Mr. Akin S.",
      role: "Landlord, Ikeja GRA",
    }}
    faqs={[
      { q: "What do you charge?", a: "A flat management fee taken from monthly rent. Exact rate depends on portfolio size and is agreed upfront in writing." },
      { q: "Who handles repairs?", a: "Our verified artisan network handles repairs at pre-agreed rates. You approve anything above an agreed threshold." },
      { q: "What if the tenant defaults?", a: "We carry the risk on managed properties — you continue to receive your rent annually as scheduled." },
    ]}
  />
);

export default LandlordManagementLP;
