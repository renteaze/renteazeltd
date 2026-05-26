import { Link } from "react-router-dom";
import { Shield, Building2, Wrench, Home, PiggyBank, Hammer, HardHat, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import LeadCaptureForm from "@/components/LeadCaptureForm";

const products = [
  { icon: Shield, title: "Guaranteed Rent", slug: "guaranteed-rent", desc: "Receive your rent on time, every time — even when tenants default. We guarantee your income and handle collections." },
  { icon: PiggyBank, title: "Save for My House", slug: "save-for-my-house", desc: "Use your rental income as a savings vehicle. Structured savings plans to help you build or buy your next property." },
  { icon: Building2, title: "Property Management", slug: "property-management", desc: "Full-service management: tenant screening, rent collection, lease management, and regular property inspections." },
  { icon: Wrench, title: "Facility Management", slug: "facility-management", desc: "Keep your property in top condition. We handle maintenance, repairs, and facility upkeep with trusted vendors." },
  { icon: Hammer, title: "Construction Financing", slug: "construction-financing", desc: "Access financing for new construction projects. Build your property portfolio with structured repayment plans." },
  { icon: HardHat, title: "Renovation Financing", slug: "renovation-financing", desc: "Upgrade your property to command higher rents. We finance renovations and improvements with flexible terms." },
  { icon: Home, title: "Repair Financing", slug: "repair-financing", desc: "Don't let deferred maintenance eat into your returns. Finance essential repairs and spread costs over time." },
];

const stats = [
  { value: "500+", label: "Properties Under Management" },
  { value: "98%", label: "Rent Collection Rate" },
  { value: "95%", label: "Client Satisfaction" },
  { value: "24hrs", label: "Maintenance Response" },
];

const ForLandlords = () => (
  <Layout>
    <section className="bg-navy text-navy-foreground py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">For Landlords</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Protect Your Income. <span className="text-accent">Grow Your Portfolio.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Renteaze gives landlords guaranteed rent, professional property management, and financing for construction and renovations — all from one platform.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a href="#contact">
              <Button size="lg" className="bg-accent text-accent-foreground hover:opacity-90">
                List Your Property
              </Button>
            </a>
            <Link to="/signup?role=landlord">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary/20">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-3xl md:text-4xl font-bold">{s.value}</p>
            <p className="text-sm mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="Landlord Solutions" subtitle="Everything you need to maximize returns and minimize headaches." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Card key={p.title} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="h-12 w-12 rounded-lg bg-light-blue flex items-center justify-center mb-4">
                  <p.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{p.desc}</p>
                <Link to={`/signup?role=landlord&product=${p.slug}`}>
                  <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-1.5">
                    Get Started <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Why Renteaze */}
    <section className="py-16 md:py-20 bg-muted">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <SectionHeading title="Why Landlords Choose Renteaze" />
        <div className="space-y-4">
          {[
            "Guaranteed rent income — no more chasing tenants",
            "Professional tenant screening reduces bad tenants by 90%",
            "24-hour maintenance response with vetted vendors",
            "Digital dashboard to track income, expenses, and occupancy",
            "Licensed and registered (RC 1768094) with 15+ years expertise",
            "Financing options to grow your property portfolio",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <p className="text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="contact" className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        <SectionHeading title="Let's Manage Your Property" subtitle="Share your property details and our team will create a custom management plan." />
        <LeadCaptureForm persona="landlord" />
      </div>
    </section>
  </Layout>
);

export default ForLandlords;
