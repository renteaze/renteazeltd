import LpTemplate from "@/components/landing/LpTemplate";

const SaveForRentLP = () => (
  <LpTemplate
    role="tenant"
    product="save-for-rent"
    eyebrow="Save for Rent"
    headline={<>Save monthly. <span className="text-accent">Pay rent stress-free.</span></>}
    subheadline="Put a small amount aside every month and Renteaze tops up your annual rent when it's due — no more last-minute scramble."
    bullets={[
      "Auto-debit weekly or monthly — as low as ₦15,000",
      "We hold your funds in a regulated trust account",
      "When rent is due, we pay your landlord directly",
    ]}
    ctaLabel="Start saving for rent"
    trust={["GTBank", "Stanbic IBTC", "MyCover.AI", "Bujeti", "Zed Crest"]}
    testimonial={{
      quote: "I used to dread December. Now my rent is settled before it's even due — I just keep saving small monthly.",
      name: "Chioma A.",
      role: "Tenant, Yaba",
    }}
    faqs={[
      { q: "What happens if I can't keep up with savings?", a: "You can pause anytime. We'll only make the rent payment when your savings cover it — no penalties for missed contributions." },
      { q: "Is my money safe?", a: "Yes. Funds sit in a regulated, audited trust account with our banking partners. You can withdraw if you change plans." },
      { q: "Can I use it for any landlord?", a: "Yes. We pay your landlord directly via bank transfer with a receipt — even if they're not on Renteaze." },
    ]}
  />
);

export default SaveForRentLP;
