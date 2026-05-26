import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, PiggyBank, Banknote, Plus, ArrowUpCircle, Building, Key, CalendarDays, Calculator, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import LeadCaptureForm from "@/components/LeadCaptureForm";

const products = [
  { icon: PiggyBank, title: "Save for Rent", slug: "save-for-rent", desc: "Break your annual rent into manageable monthly savings. Start small, stay consistent, and never scramble for rent again.", highlight: true },
  { icon: Banknote, title: "Loan for Rent", slug: "loan-for-rent", desc: "Need rent now? Access affordable rent financing with flexible repayment plans tailored to your income cycle." },
  { icon: Plus, title: "Add-On Funds", slug: "add-on-funds", desc: "Top up your rent savings when you're short. Bridge the gap between what you've saved and what you need." },
  { icon: ArrowUpCircle, title: "Rent Upgrade", slug: "rent-upgrade", desc: "Ready for a better space? Upgrade your apartment with our financing support — move first, pay over time." },
  { icon: Building, title: "Save to Own", slug: "save-to-own", desc: "Transform your rent payments into equity. Save consistently toward owning your own home." },
  { icon: Key, title: "Rent-to-Own", slug: "rent-to-own", desc: "Live in the property while paying toward ownership. Your rent becomes your mortgage." },
  { icon: CalendarDays, title: "Monthly Rent", slug: "monthly-rent", desc: "Pay rent monthly instead of annually. We negotiate with landlords and handle the payments." },
];

const testimonials = [
  { name: "Adunni O.", location: "Lekki", text: "The Save for Rent plan was a game-changer. I saved ₦1.2M over 10 months without stress!" },
  { name: "Femi A.", location: "Yaba", text: "Loan for Rent helped me secure my dream apartment. The repayment plan was very manageable." },
  { name: "Grace I.", location: "Ikeja", text: "Monthly Rent is genius! I no longer have to come up with a full year's rent at once." },
];

const RentCalculator = () => {
  const [annualRent, setAnnualRent] = useState(1200000);
  const [months, setMonths] = useState(10);

  const monthly = annualRent / months;
  const biWeekly = annualRent / (months * 2);

  return (
    <Card className="border-2 border-primary">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Calculator className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-bold">Rent Savings Calculator</h3>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Annual Rent (₦)</label>
            <Input
              type="number"
              value={annualRent}
              onChange={(e) => setAnnualRent(Number(e.target.value))}
              className="text-lg font-semibold"
              min={100000}
              step={50000}
            />
            <p className="text-xs text-muted-foreground mt-1">
              ₦{annualRent.toLocaleString()} per year
            </p>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Savings Period: {months} months</label>
            <Slider
              value={[months]}
              onValueChange={(v) => setMonths(v[0])}
              min={3}
              max={12}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>3 months</span><span>12 months</span>
            </div>
          </div>
          <div className="bg-light-blue rounded-lg p-5 space-y-3">
            <h4 className="font-semibold text-primary">Your Savings Breakdown</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-primary">₦{Math.round(monthly).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Monthly savings</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">₦{Math.round(biWeekly).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Bi-weekly savings</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Save ₦{Math.round(monthly).toLocaleString()}/month for {months} months to cover your ₦{annualRent.toLocaleString()} annual rent.
            </p>
            <Link to="/signup?role=tenant&product=save-for-rent">
              <Button className="w-full mt-2 bg-accent text-accent-foreground hover:opacity-90 gap-2">
                Start Saving Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ForTenants = () => (
  <Layout>
    {/* Hero */}
    <section className="bg-navy text-navy-foreground py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">For Tenants</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Stop Struggling with <span className="text-accent">Annual Rent</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Renteaze gives you 7 powerful ways to manage your rent — from monthly savings plans to rent financing and even a path to homeownership.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a href="#calculator">
              <Button size="lg" className="bg-accent text-accent-foreground hover:opacity-90 gap-2">
                Calculate Your Savings <Calculator className="h-4 w-4" />
              </Button>
            </a>
            <Link to="/signup?role=tenant">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary/20">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Products */}
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="7 Ways We Help You Rent" subtitle="From saving to owning — choose the plan that fits your life." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Card key={p.title} className={`hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${p.highlight ? "border-2 border-accent" : ""}`}>
              <CardContent className="p-6 flex flex-col h-full">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 ${p.highlight ? "bg-accent/10" : "bg-light-blue"}`}>
                  <p.icon className={`h-6 w-6 ${p.highlight ? "text-accent" : "text-primary"}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{p.desc}</p>
                <Link to={`/signup?role=tenant&product=${p.slug}`}>
                  <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-1.5">
                    Apply Now <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Calculator */}
    <section id="calculator" className="py-16 md:py-20 bg-muted">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <SectionHeading title="Save for Rent Calculator" subtitle="See how easy it is to break your annual rent into small monthly savings." centered={false} />
            <ul className="space-y-3 mt-6">
              {["No interest charges — just disciplined savings", "Automated reminders & tracking", "Funds locked until rent is due", "Top up anytime with Add-On Funds"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 text-accent shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <RentCalculator />
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="Tenant Success Stories" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-none shadow-md">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground italic mb-4">"{t.text}"</p>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Contact */}
    <section id="contact" className="py-16 md:py-20 bg-muted">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        <SectionHeading title="Get Started Today" subtitle="Tell us about your rent needs and we'll match you with the perfect solution." />
        <LeadCaptureForm persona="tenant" />
      </div>
    </section>
  </Layout>
);

export default ForTenants;
