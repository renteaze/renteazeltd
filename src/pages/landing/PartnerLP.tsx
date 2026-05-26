import LpTemplate from "@/components/landing/LpTemplate";

const PartnerLP = () => (
  <LpTemplate
    role="professional"
    product="partner"
    eyebrow="Partner Programme"
    headline={<>Refer clients. <span className="text-accent">Earn commissions.</span></>}
    subheadline="Estate agents, lawyers, surveyors, engineers, and artisans — partner with Renteaze and earn for every successful referral."
    bullets={[
      "Earn commission on every closed deal",
      "Free training, marketing materials & a partner dashboard",
      "Priority support from a dedicated partner manager",
    ]}
    ctaLabel="Join the partner programme"
    trust={["GTBank", "Stanbic IBTC", "MyCover.AI", "Bujeti", "Zed Crest"]}
    testimonial={{
      quote: "I closed three deals through Renteaze referrals in my first quarter. Payouts came on time and the dashboard is excellent.",
      name: "Bisi K.",
      role: "Estate Agent, Lagos",
    }}
    faqs={[
      { q: "Who can join?", a: "Estate agents, surveyors, lawyers, QS, civil and land surveyors, architects, agricultural consultants, and verified artisans." },
      { q: "How are commissions paid?", a: "Commissions are paid into your nominated bank account within 7 working days of the deal closing and Renteaze receiving funds." },
      { q: "Is there a fee to join?", a: "No. Joining and certification training are free for verified professionals." },
    ]}
  />
);

export default PartnerLP;
