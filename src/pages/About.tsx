import { Users, Target, Eye, Award, CheckCircle2, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const values = [
  { icon: Target, title: "Innovation", desc: "We leverage technology to solve real estate problems that have persisted for decades in Nigeria." },
  { icon: Users, title: "Accessibility", desc: "Making property services available to everyone — regardless of income level or location." },
  { icon: Award, title: "Integrity", desc: "Transparency in every transaction. No hidden fees, no surprises — just honest service." },
  { icon: Eye, title: "Excellence", desc: "We deliver premium service quality backed by 15+ years of real estate expertise." },
];

const team = [
  { name: "Dapo Okunogbe", role: "Founder & CEO", bio: "Licensed estate surveyor & valuer with 15+ years of experience in Nigerian real estate. Founded Dapo Okunogbe & Partners in 2009." },
  { name: "Operations Team", role: "Property Management", bio: "A dedicated team of property managers, facility engineers, and client relationship officers across Lagos." },
  { name: "Technology Team", role: "Platform Development", bio: "Engineers and product designers building the technology that powers Renteaze's PropTech ecosystem." },
];

const About = () => (
  <Layout>
    <section className="bg-navy text-navy-foreground py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">About Us</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl mx-auto">
          Making Real Estate <span className="text-accent">Work for Everyone</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Born from 15+ years of Nigerian real estate expertise, Renteaze is transforming how people rent, own, and invest in property.
        </p>
        <p className="mt-4 text-xs text-muted-foreground/80">
          Renteaze is operated by Renteaze International Limited (RC 1768094).
        </p>
      </div>
    </section>

    {/* Story */}
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <SectionHeading title="Our Story" />
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
          <p>
            Renteaze is a subsidiary of Dapo Okunogbe & Partners, a firm established in 2009 with a vision to professionalize real estate services in Nigeria. Over 15 years, we've managed hundreds of properties, served thousands of clients, and built deep expertise in the Lagos real estate market.
          </p>
          <p>
            In 2024, we launched Renteaze to bring technology into the equation — combining our real estate knowledge with fintech, AI, and digital platforms to create a PropTech company that truly serves every stakeholder in the property ecosystem.
          </p>
          <p>
            Our mission is simple: make renting affordable, property ownership achievable, and real estate investment accessible — for every Nigerian, at home and abroad.
          </p>
        </div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="py-16 md:py-20 bg-muted">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-2 border-primary">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" /> Our Mission
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                To democratize access to real estate services in Nigeria through technology, making renting, owning, and investing accessible, transparent, and efficient for everyone.
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 border-accent">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Eye className="h-6 w-6 text-accent" /> Our Vision
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                To become Africa's leading PropTech platform — the trusted destination for every property need, powered by innovation and grounded in integrity.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="Our Values" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <Card key={v.title} className="border-none shadow-md text-center">
              <CardContent className="p-6">
                <v.icon className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="py-16 md:py-20 bg-muted">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="Our Team" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {team.map((t) => (
            <Card key={t.name} className="text-center">
              <CardContent className="p-6">
                <div className="h-20 w-20 rounded-full bg-light-blue flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-accent font-medium mb-2">{t.role}</p>
                <p className="text-sm text-muted-foreground">{t.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Credentials */}
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <SectionHeading title="Credentials & Accreditations" />
        <div className="space-y-3">
          {[
            "Corporate Affairs Commission — RC 1768094",
            "Licensed Estate Surveyors and Valuers",
            "Member, Nigerian Institution of Estate Surveyors and Valuers (NIESV)",
            "Member, Real Estate Developers Association of Nigeria (REDAN)",
            "15+ years in Nigerian real estate market",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
              <p className="text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
