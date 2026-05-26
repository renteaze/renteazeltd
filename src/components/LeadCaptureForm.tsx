import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle } from "lucide-react";

interface LeadCaptureFormProps {
  persona?: "tenant" | "landlord" | "investor" | "general";
  className?: string;
}

const enquiryTypes: Record<string, string[]> = {
  tenant: ["Save for Rent", "Loan for Rent", "Add-On Funds", "Rent Upgrade", "Save to Own", "Rent-to-Own", "Monthly Rent", "General Enquiry"],
  landlord: ["Guaranteed Rent", "Property Management", "Facility Management", "Construction Financing", "Save for My House", "General Enquiry"],
  investor: ["Joint Ventures", "Property Sales", "Facility Management", "Sponsorship & Land Reward", "General Enquiry"],
  general: ["Tenant Services", "Landlord Services", "Investment Opportunities", "Partnership", "Other"],
};

const whatsappMessages: Record<string, string> = {
  tenant: "Hello Renteaze, I'm a tenant interested in your rent solutions.",
  landlord: "Hello Renteaze, I'm a landlord interested in your property management services.",
  investor: "Hello Renteaze, I'm interested in investment opportunities in Nigerian real estate.",
  general: "Hello Renteaze, I'd like to learn more about your services.",
};

const LeadCaptureForm = ({ persona = "general", className = "" }: LeadCaptureFormProps) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", enquiryType: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll be in touch within 24 hours.", {
      description: "A member of our team will reach out to you shortly.",
    });
    setForm({ name: "", email: "", phone: "", enquiryType: "", message: "" });
  };

  const waLink = `https://wa.me/2348000000000?text=${encodeURIComponent(whatsappMessages[persona])}`;

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <Select value={form.enquiryType} onValueChange={(v) => setForm({ ...form, enquiryType: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Enquiry Type" />
            </SelectTrigger>
            <SelectContent>
              {enquiryTypes[persona].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Textarea
          placeholder="Tell us more about your needs..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="submit" className="flex-1">
            Send Enquiry
          </Button>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button type="button" variant="outline" className="w-full gap-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white">
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </Button>
          </a>
        </div>
      </form>
    </div>
  );
};

export default LeadCaptureForm;
