import { Link } from "react-router-dom";
import { TrendingUp, Building, Wrench, Gift, ShieldCheck, Globe, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import LeadCaptureForm from "@/components/LeadCaptureForm";

const products = [
  { icon: TrendingUp, title: "Joint Ventures", slug: "joint-ventures", desc: "Partner with us on premium real estate projects. We bring the market expertise, you bring the capital — shared risk, shared returns." },
  { icon: Building, title: "Property Sales", slug: "property-sales", desc: "Access curated, vetted properties across Lagos for purchase. Complete due diligence, legal verification, and end-to-end transaction support." },
  { icon: Wrench, title: "Facility Management", slug: "facility-management", desc: "Invest in property and let us handle the operations. Full facility management for your investment portfolio." },
  { icon: Gift, title: "Sponsorship & Land Reward", slug: "sponsorship-land-reward", desc: "Sponsor real estate developments and receive land allocations as returns. A unique asset-backed investment model." },
];

const trustSignals = [
  "Registered with CAC — RC 1768094",
  "Subsidiary of Dapo Okunogbe & Partners (Est. 2009)",
  "Licensed estate surveyors and valuers",
  "Transparent reporting and regular updates",
  "Legal safeguards on all investments",
  "Dedicated diaspora relationship managers",
];

const ForInvestors = () => (
  <Layout>
    <section className="bg-navy text-navy-foreground py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">For Investors</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Invest in Nigeria's <span className="text-accent">Real Estate Boom</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Whether you're in Lagos or London, Renteaze gives you access to premium Nigerian real estate investment opportunities with full transparency and professional management.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a href="#contact">
              <Button size="lg" className="bg-accent text-accent-foreground hover:opacity-90">
                Explore Opportunities
              </Button>
            </a>
            <Link to="/signup?role=investor">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary/20">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>

    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="Investment Products" subtitle="Multiple ways to grow your wealth through Nigerian real estate." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((p) => (
            <Card key={p.title} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="h-12 w-12 rounded-lg bg-light-blue flex items-center justify-center mb-4">
                  <p.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{p.desc}</p>
                <Link to={`/signup?role=investor&product=${p.slug}`}>
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

    {/* Diaspora Section */}
    <section className="py-16 md:py-20 bg-muted">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-6 w-6 text-primary" />
              <p className="text-accent font-semibold uppercase text-sm tracking-wide">Diaspora Investors</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Invest Back Home with Confidence</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We understand the challenges of investing in Nigerian real estate from abroad — trust issues, management concerns, and lack of transparency. Renteaze eliminates these barriers with:
            </p>
            <ul className="space-y-3">
              {["Dedicated diaspora relationship managers", "Video property tours and virtual inspections", "Monthly digital reports on your investments", "Transparent fee structures with no hidden costs", "Legal protections and documented agreements"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Card className="border-2 border-primary">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" />
                Trust & Credentials
              </h3>
              <ul className="space-y-3">
                {trustSignals.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <section id="contact" className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        <SectionHeading title="Start Your Investment Journey" subtitle="Tell us about your investment goals and we'll create a personalized portfolio plan." />
        <LeadCaptureForm persona="investor" />
      </div>
    </section>
  </Layout>
);

export default ForInvestors;
