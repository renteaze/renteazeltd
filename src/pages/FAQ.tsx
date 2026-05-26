import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const faqData = {
  Tenants: [
    { q: "How does Save for Rent work?", a: "Save for Rent allows you to break your annual rent into monthly savings. You set your target amount and savings period (3-12 months), and we help you save consistently. When your rent is due, the funds are available to pay your landlord." },
    { q: "Can I get a loan for my rent?", a: "Yes! Our Loan for Rent product provides rent financing with flexible repayment plans. We assess your income and provide an affordable rent loan that you repay over 3-12 months." },
    { q: "What is Monthly Rent?", a: "Monthly Rent allows you to pay your rent on a monthly basis instead of the traditional annual payment. We negotiate with your landlord and handle all the payment logistics." },
    { q: "How does Rent-to-Own work?", a: "With Rent-to-Own, you live in the property while making payments toward ownership. A portion of your monthly payment goes toward equity, and over a set period, you become the property owner." },
    { q: "Is my savings money safe?", a: "Absolutely. All funds are held in regulated financial accounts with bank-grade security. Your savings are protected and accessible when your rent is due." },
    { q: "What happens if I can't complete my savings plan?", a: "If you need to adjust your plan, contact us and we'll work out a modified schedule. You can also use our Add-On Funds feature to top up your savings at any time." },
  ],
  Landlords: [
    { q: "How does Guaranteed Rent work?", a: "We guarantee your rental income regardless of tenant payment behavior. We pay you the agreed rent amount on schedule, and we handle tenant collections and defaults." },
    { q: "What does Property Management include?", a: "Our full-service property management covers tenant screening, lease management, rent collection, regular inspections, maintenance coordination, and financial reporting." },
    { q: "How do you screen tenants?", a: "We conduct comprehensive background checks including employment verification, credit assessment, previous landlord references, and identity verification." },
    { q: "What are your management fees?", a: "Our fees vary based on the services you choose. Contact us for a customized quote based on your property and needs. We're transparent — no hidden charges." },
    { q: "Can I get financing for property renovation?", a: "Yes. We offer renovation and repair financing to help you upgrade your property and command higher rents. Repayment is flexible and can be structured around your rental income." },
  ],
  Investors: [
    { q: "How do Joint Ventures work?", a: "In a Joint Venture, you provide the investment capital while we provide market expertise, project management, and operational support. Returns are shared based on agreed terms." },
    { q: "Is it safe to invest from abroad?", a: "We provide full transparency with dedicated diaspora relationship managers, video property tours, monthly digital reports, legal protections, and documented agreements for every investment." },
    { q: "What is the minimum investment amount?", a: "Investment minimums vary by product and opportunity. Contact our investment team for current opportunities and their requirements." },
    { q: "How do I receive returns on my investment?", a: "Returns are disbursed according to the terms of your investment agreement — typically through bank transfer (domestic or international). We provide detailed financial statements." },
    { q: "What legal protections are in place?", a: "All investments are backed by legal agreements prepared by licensed solicitors. Properties are verified, insured, and we maintain full regulatory compliance (RC 1768094)." },
  ],
};

const FAQ = () => {
  const [activeTab, setActiveTab] = useState<keyof typeof faqData>("Tenants");
  const [search, setSearch] = useState("");

  const filtered = faqData[activeTab].filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <section className="bg-navy text-navy-foreground py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Frequently Asked <span className="text-accent">Questions</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about Renteaze services.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Persona tabs */}
          <div className="flex gap-2 mb-8">
            {(Object.keys(faqData) as (keyof typeof faqData)[]).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No FAQs match your search.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filtered.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
