import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

type Role = "tenant" | "landlord" | "investor" | "professional";

const PROFESSIONS = [
  "Estate Agent", "Estate Surveyor & Valuer", "Lawyer", "Quantity Surveyor",
  "Civil Engineer", "Land Surveyor", "Architect", "Agricultural Consultant",
  "Artisan", "Other",
];
const YEARS = ["Under 2", "2–5", "5–10", "10+"];

const schema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(255),
  phone: z.string().regex(/^\d{10}$/, "Enter 10 digits after +234"),
  password: z.string().min(8).regex(/[A-Za-z]/, "Include a letter").regex(/\d/, "Include a number"),
  terms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
});

const SignUpDetails = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const role = (params.get("role") as Role) || "tenant";

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "",
    profession: "", association: "", years: "", terms: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    try {
      const fullPhone = `+234${form.phone}`;
      const ref = sessionStorage.getItem("rz_ref") || undefined;
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/signin`,
          data: {
            first_name: form.firstName,
            last_name: form.lastName,
            phone: fullPhone,
            role,
            referred_by: ref,
            ...(role === "professional" ? {
              profession_type: form.profession,
              professional_association: form.association,
              years_experience: form.years,
            } : {}),
          },
        },
      });
      if (error) throw error;
      const userId = data.user?.id;

      // Persist any extra professional fields (trigger only saves the basic ones)
      if (role === "professional" && userId) {
        await supabase.from("profiles").update({
          profession_type: form.profession,
          professional_association: form.association,
          years_experience: form.years,
        }).eq("id", userId);
      }

      // Mock phase: skip phone/email OTP and go straight to the in-platform survey.
      // (VerifyPhone screen + verify-otp edge fn stay in place for when SMS goes live.)
      sessionStorage.setItem("rz_email", form.email);
      if (userId) sessionStorage.setItem("rz_user", userId);
      toast.success("Account created — let's personalise your experience");
      navigate("/signup/survey");
    } catch (err) {
      toast.error((err as Error).message || "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell step={{ current: 2, total: 2 }}>
      <h1 className="text-3xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Takes less than 60 seconds.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-card border rounded-xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="fn">First Name</Label>
            <Input id="fn" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="mt-1" required />
          </div>
          <div>
            <Label htmlFor="ln">Last Name</Label>
            <Input id="ln" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="mt-1" required />
          </div>
        </div>
        <div>
          <Label htmlFor="em">Email</Label>
          <Input id="em" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" required />
        </div>
        <div>
          <Label htmlFor="ph">Phone Number</Label>
          <div className="mt-1 flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-sm">+234</span>
            <Input id="ph" inputMode="numeric" maxLength={10} value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
              className="rounded-l-none" required placeholder="8012345678" />
          </div>
        </div>
        <div>
          <Label htmlFor="pw">Password</Label>
          <Input id="pw" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1" required />
          <p className="mt-1 text-xs text-muted-foreground">Min 8 chars with at least one letter and one number.</p>
        </div>

        {role === "professional" && (
          <div className="space-y-3 border-t pt-4">
            <p className="text-sm font-medium">Professional details</p>
            <div>
              <Label htmlFor="prof">Profession Type</Label>
              <Select value={form.profession} onValueChange={(v) => setForm({ ...form, profession: v })}>
                <SelectTrigger id="prof" className="mt-1"><SelectValue placeholder="Select profession" /></SelectTrigger>
                <SelectContent>
                  {PROFESSIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assoc">Professional Association</Label>
              <Input id="assoc" value={form.association} onChange={(e) => setForm({ ...form, association: e.target.value })} className="mt-1" placeholder="e.g. NIESV, NBA" />
            </div>
            <div>
              <Label htmlFor="yrs">Years of Experience</Label>
              <Select value={form.years} onValueChange={(v) => setForm({ ...form, years: v })}>
                <SelectTrigger id="yrs" className="mt-1"><SelectValue placeholder="Select range" /></SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2">
          <Checkbox id="terms" checked={form.terms} onCheckedChange={(v) => setForm({ ...form, terms: !!v })} />
          <Label htmlFor="terms" className="text-sm font-normal leading-snug">
            I agree to the Terms of Use and Privacy Policy.
          </Label>
        </div>

        <Button type="submit" disabled={submitting} size="lg" className="w-full bg-primary text-primary-foreground">
          {submitting ? "Creating..." : "Create Account"}
        </Button>
        <Link to="/signup" className="block text-center text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
      </form>
    </AuthShell>
  );
};

export default SignUpDetails;
