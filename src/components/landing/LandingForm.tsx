import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type LandingRole = "tenant" | "landlord" | "investor" | "professional";

interface LandingFormProps {
  product: string;
  role: LandingRole;
  ctaLabel?: string;
  whatsappNumber?: string;
  extraFields?: ReactNode;
  successTitle?: string;
  successDescription?: string;
}

const LandingForm = ({
  product,
  role,
  ctaLabel = "Get started",
  whatsappNumber = "2348000000000",
  extraFields,
  successTitle = "Thanks — we'll be in touch shortly.",
  successDescription = "Continue to create your account and finish setup.",
}: LandingFormProps) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    toast.success(successTitle, { description: successDescription });
    setTimeout(() => {
      navigate(`/signup?role=${role}&product=${product}`);
    }, 600);
  };

  const waMessage = encodeURIComponent(
    `Hi Renteaze, I'm interested in ${product.replace(/-/g, " ")}.`
  );

  return (
    <div className="bg-card rounded-xl shadow-lg border p-6 md:p-7">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="lp-name">Full name</Label>
          <Input id="lp-name" required placeholder="Your name" className="mt-1" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="lp-phone">Phone</Label>
            <Input id="lp-phone" required type="tel" placeholder="+234…" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="lp-email">Email</Label>
            <Input id="lp-email" required type="email" placeholder="you@example.com" className="mt-1" />
          </div>
        </div>
        <div>
          <Label htmlFor="lp-city">City</Label>
          <Input id="lp-city" required placeholder="Lagos" className="mt-1" />
        </div>
        {extraFields}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-primary-foreground h-11 text-base"
        >
          {submitting ? "Sending..." : ctaLabel}
        </Button>
      </form>
      <div className="mt-3 text-center">
        <a
          href={`https://wa.me/${whatsappNumber}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <MessageCircle className="h-4 w-4" />
          Or chat with us on WhatsApp
        </a>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground text-center">
        By submitting you agree to be contacted about Renteaze {product.replace(/-/g, " ")}.
      </p>
    </div>
  );
};

export default LandingForm;
