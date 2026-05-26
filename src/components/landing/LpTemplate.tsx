import { ReactNode } from "react";
import { Check } from "lucide-react";
import LandingShell from "@/components/landing/LandingShell";
import LandingForm, { LandingRole } from "@/components/landing/LandingForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface LpFaq { q: string; a: string }
export interface LpTestimonial { quote: string; name: string; role: string }

interface LpTemplateProps {
  role: LandingRole;
  product: string;
  eyebrow: string;
  headline: ReactNode;
  subheadline: string;
  bullets: string[];
  ctaLabel: string;
  testimonial: LpTestimonial;
  faqs: LpFaq[];
  trust?: string[];
  extraFields?: ReactNode;
}

const LpTemplate = ({
  role, product, eyebrow, headline, subheadline, bullets,
  ctaLabel, testimonial, faqs, trust, extraFields,
}: LpTemplateProps) => (
  <LandingShell>
    {/* Hero + form */}
    <section className="bg-navy text-navy-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-14 md:py-20 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <p className="text-accent text-sm font-semibold uppercase tracking-wide">{eyebrow}</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-tight">{headline}</h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl">{subheadline}</p>
          <ul className="mt-7 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 h-6 w-6 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-navy-foreground/90">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <LandingForm
            role={role}
            product={product}
            ctaLabel={ctaLabel}
            extraFields={extraFields}
          />
        </div>
      </div>
    </section>

    {/* Trust strip */}
    {trust && trust.length > 0 && (
      <section className="border-y bg-muted/40">
        <div className="container mx-auto px-4 lg:px-8 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs uppercase tracking-wide text-muted-foreground font-medium">
          <span className="text-foreground/70">In good company:</span>
          {trust.map((t) => <span key={t}>{t}</span>)}
        </div>
      </section>
    )}

    {/* Testimonial */}
    <section className="py-14 md:py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
        <p className="text-2xl md:text-3xl font-semibold leading-snug">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <p className="mt-5 text-sm text-muted-foreground">
          — {testimonial.name}, <span className="text-foreground">{testimonial.role}</span>
        </p>
      </div>
    </section>

    {/* FAQ */}
    <section className="py-14 md:py-16 bg-muted/40">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Common questions</h2>
        <Accordion type="single" collapsible className="bg-background rounded-lg border">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`q-${i}`} className="px-4">
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  </LandingShell>
);

export default LpTemplate;
