import { Link } from "react-router-dom";
import {
  Share2, BadgeCheck, Send, Wallet, Users, BookOpen, Headphones, FileText,
  Building2, Scale, Compass, Hammer, Ruler, TreePine, Wrench, ArrowRight, CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const professions = [
  { icon: Users, label: "Estate Agents" },
  { icon: Ruler, label: "Estate Surveyors & Valuers" },
  { icon: Scale, label: "Lawyers" },
  { icon: FileText, label: "Quantity Surveyors" },
  { icon: Hammer, label: "Civil Engineers" },
  { icon: Compass, label: "Land Surveyors" },
  { icon: Building2, label: "Architects" },
  { icon: TreePine, label: "Agricultural Consultants" },
  { icon: Wrench, label: "Artisans" },
];

const steps = [
  { icon: BadgeCheck, title: "Register & get verified", desc: "Sign up with your professional credentials. Approval typically within 24 hours." },
  { icon: Share2, title: "Get your unique referral code", desc: "We issue you a personal code (e.g. PRO-ADEKOLA-12) and a shareable link." },
  { icon: Send, title: "Share with clients", desc: "Recommend Renteaze products to clients who need flexible rent, financing, or property management." },
  { icon: Wallet, title: "Earn commission", desc: "Get paid every time a referred client converts. Track everything in your dashboard." },
];

const commissions = [
  { client: "Tenant — Save for Rent or Loan for Rent", trigger: "Client funds first month / loan disbursed", commission: "Tiered, based on rent value" },
  { client: "Landlord — Property or Facility Management", trigger: "Management agreement signed", commission: "% of first-year management fee" },
  { client: "Investor — Joint Venture or Property Sale", trigger: "EOI converts to committed deal", commission: "Negotiated per deal value" },
  { client: "Landlord — Construction or Renovation Financing", trigger: "Loan disbursed", commission: "% of disbursed amount" },
];

const benefits = [
  { icon: Users, title: "Your own dashboard", desc: "Real-time visibility on referrals, conversions, and commissions earned." },
  { icon: FileText, title: "Marketing materials", desc: "Brochures, WhatsApp templates, and social captions you can share immediately." },
  { icon: BookOpen, title: "Free training & certification", desc: "Live sessions and resources so you can pitch every Renteaze product confidently." },
  { icon: Headphones, title: "Priority support", desc: "Dedicated partnerships team for fast answers and deal escalations." },
];

const faqs = [
  { q: "Who can join the partner programme?", a: "Any Nigerian real estate professional — estate agents, surveyors, lawyers, architects, engineers, and certified artisans. We verify your credentials before activation." },
  { q: "How much can I earn?", a: "Commissions vary by product and deal size. Tenant referrals typically earn flat fees; landlord and investor referrals earn percentages that scale with deal value. Exact rates are confirmed on approval." },
  { q: "When are commissions paid?", a: "Commissions are approved as soon as the referred deal closes. You can request payout once your approved balance hits the minimum threshold (currently ₦10,000), processed within 5 business days." },
  { q: "Do I need to be a licensed estate agent to join?", a: "No. Lawyers, surveyors, engineers, architects, and other professionals who interact with property clients are all welcome." },
  { q: "How do you track my referrals?", a: "Every referral uses your unique code or link. When a client signs up using it, the entire journey — registration, application, conversion — is attributed to you automatically." },
];

const ForProfessionals = () => (
  <Layout>
    <section className="bg-navy text-navy-foreground py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">For Professionals</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Refer Clients. <span className="text-accent">Earn Commissions.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Join the Renteaze partner network — estate agents, lawyers, surveyors, architects, and every kind of real estate professional are welcome.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link to="/signup?role=professional">
              <Button size="lg" className="bg-accent text-accent-foreground hover:opacity-90 gap-2">
                Join the Programme <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary/20">
                See How It Works
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>

    {/* Who can join */}
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="Who Can Join" subtitle="If your work touches Nigerian property, there's a place for you in the Renteaze partner network." />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {professions.map((p) => (
            <Card key={p.label} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-light-blue flex items-center justify-center shrink-0">
                  <p.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium text-sm">{p.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section id="how-it-works" className="py-16 md:py-20 bg-muted">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="How It Works" subtitle="Four simple steps from sign-up to earning." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <Card key={s.title} className="relative border-none shadow-md">
              <CardContent className="p-6">
                <span className="absolute -top-3 -right-3 h-9 w-9 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center shadow">
                  {i + 1}
                </span>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Commissions */}
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="Commission Overview" subtitle="What you can earn — across every Renteaze product line." />
        <div className="max-w-4xl mx-auto rounded-xl overflow-hidden border shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-navy text-navy-foreground">
              <tr>
                <th className="text-left p-4 font-semibold">Referred Client Type</th>
                <th className="text-left p-4 font-semibold">Trigger Event</th>
                <th className="text-left p-4 font-semibold">Commission</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((c, i) => (
                <tr key={c.client} className={i % 2 === 0 ? "bg-background" : "bg-muted/40"}>
                  <td className="p-4 font-medium">{c.client}</td>
                  <td className="p-4 text-muted-foreground">{c.trigger}</td>
                  <td className="p-4 text-primary font-semibold">{c.commission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Exact rates are confirmed on approval and visible in your partner dashboard.
        </p>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-16 md:py-20 bg-muted">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="What You Get as a Partner" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => (
            <Card key={b.title} className="border-none shadow-md">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <b.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonial */}
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <Card className="border-l-4 border-l-accent shadow-md">
          <CardContent className="p-8">
            <p className="text-lg italic text-muted-foreground leading-relaxed">
              "I refer three or four tenants a month to Renteaze. The dashboard is honest, the commissions land
              when they say they will, and my clients actually thank me afterwards. That last part is the win."
            </p>
            <div className="flex items-center gap-3 mt-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center">CA</div>
              <div>
                <p className="font-semibold text-sm">Chioma Adekola</p>
                <p className="text-xs text-muted-foreground">Estate Agent · Lekki</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 md:py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 text-center max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold">Start Earning Today</h2>
        <p className="mt-4 text-lg opacity-90">
          Sign up in minutes. Once approved, your unique referral code is live and the meter starts running.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup?role=professional">
            <Button size="lg" className="bg-accent text-accent-foreground hover:opacity-90 gap-2">
              Apply to Join <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              Talk to Partnerships
            </Button>
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm opacity-90">
          {["Free to join", "Approval within 24 hours", "Transparent payouts"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-accent" /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <SectionHeading title="Partner FAQs" />
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  </Layout>
);

export default ForProfessionals;
