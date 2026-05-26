import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import PortalShell from "@/components/portal/PortalShell";
import KycGate from "@/components/kyc/KycGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatNGN } from "@/lib/format";

type Product = "loan_for_rent" | "add_on_funds" | "upgrade";

const PRODUCTS: { id: Product; title: string; desc: string; rate: string }[] = [
  { id: "loan_for_rent", title: "Loan for Rent", desc: "Cover your full annual rent now, repay monthly.", rate: "~5% monthly" },
  { id: "add_on_funds", title: "Add-On Funds", desc: "Top up your existing savings to meet your rent target.", rate: "~4% monthly" },
  { id: "upgrade", title: "Upgrade Accommodation", desc: "Move into a better place — finance the difference.", rate: "~5% monthly" },
];

const EMPLOYMENT = ["Salaried (full-time)", "Salaried (contract)", "Self-employed", "Business owner", "Other"];
const TENURE = ["Less than 6 months", "6 – 12 months", "1 – 2 years", "2 – 5 years", "5+ years"];

const ApplyLoan = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    product: "loan_for_rent" as Product,
    landlord_name: "",
    property_address: "",
    annual_rent: "",
    loan_amount_requested: "",
    employment_type: "",
    employer_name: "",
    monthly_income: "",
    job_tenure: "",
  });

  const monthlyEstimate = useMemo(() => {
    const amt = Number(form.loan_amount_requested.replace(/\D/g, ""));
    if (!amt) return 0;
    // 12-month term, ~5%/mo flat estimate
    return Math.round((amt * 1.6) / 12);
  }, [form.loan_amount_requested]);

  if (profile && !profile.kyc_completed) {
    return (
      <PortalShell role="tenant">
        <h1 className="text-2xl font-bold mb-1">Apply for Loan</h1>
        <p className="text-sm text-muted-foreground mb-6">Verify your identity first to continue.</p>
        <KycGate onComplete={() => window.location.reload()} />
      </PortalShell>
    );
  }

  function next() {
    if (step === 2) {
      const ar = Number(form.annual_rent.replace(/\D/g, ""));
      const la = Number(form.loan_amount_requested.replace(/\D/g, ""));
      if (!form.property_address || !form.landlord_name) return toast.error("Fill all property details");
      if (!ar || !la) return toast.error("Enter rent and loan amount");
      if (la > ar) return toast.error("Loan amount cannot exceed annual rent");
    }
    if (step === 3) {
      if (!form.employment_type || !form.monthly_income) return toast.error("Fill employment details");
    }
    setStep((s) => Math.min(4, s + 1));
  }

  async function submit() {
    if (!user) return;
    setSubmitting(true);
    const { data, error } = await supabase
      .from("loan_applications")
      .insert({
        user_id: user.id,
        product_type: form.product,
        landlord_name: form.landlord_name,
        property_address: form.property_address,
        annual_rent: Number(form.annual_rent.replace(/\D/g, "")),
        loan_amount_requested: Number(form.loan_amount_requested.replace(/\D/g, "")),
        employment_type: form.employment_type,
        employer_name: form.employer_name,
        monthly_income: Number(form.monthly_income.replace(/\D/g, "")),
        job_tenure: form.job_tenure,
        status: "submitted",
      })
      .select("id")
      .single();
    setSubmitting(false);
    if (error || !data) {
      toast.error(error?.message ?? "Something went wrong");
      return;
    }
    toast.success("Application submitted!");
    navigate(`/tenant/loans/${data.id}`);
  }

  const fmtInput = (s: string) => s.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <PortalShell role="tenant">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold">Apply for a Loan</h1>
        <p className="text-sm text-muted-foreground">Step {step} of 4</p>

        {/* Stepper */}
        <div className="mt-4 flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <div className="mt-6 bg-card border rounded-xl p-6">
          {step === 1 && (
            <div className="space-y-3">
              <h2 className="font-semibold">Choose a product</h2>
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setForm({ ...form, product: p.id })}
                  className={`w-full text-left rounded-lg border p-4 transition ${
                    form.product === p.id ? "border-primary bg-primary/5" : "hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{p.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{p.rate}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold">Property details</h2>
              <div>
                <Label htmlFor="addr">Property Address</Label>
                <Input id="addr" value={form.property_address}
                  onChange={(e) => setForm({ ...form, property_address: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="ll">Landlord Name</Label>
                <Input id="ll" value={form.landlord_name}
                  onChange={(e) => setForm({ ...form, landlord_name: e.target.value })} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="ar">Annual Rent (₦)</Label>
                  <Input id="ar" inputMode="numeric" value={form.annual_rent}
                    onChange={(e) => setForm({ ...form, annual_rent: fmtInput(e.target.value) })} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="la">Loan Amount (₦)</Label>
                  <Input id="la" inputMode="numeric" value={form.loan_amount_requested}
                    onChange={(e) => setForm({ ...form, loan_amount_requested: fmtInput(e.target.value) })} className="mt-1" />
                </div>
              </div>
              {monthlyEstimate > 0 && (
                <div className="bg-muted/40 rounded-lg p-3 text-sm">
                  Estimated monthly repayment:{" "}
                  <span className="font-semibold">{formatNGN(monthlyEstimate)}</span>{" "}
                  <span className="text-muted-foreground">(over 12 months · indicative)</span>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold">Income & employment</h2>
              <div>
                <Label htmlFor="emp">Employment Status</Label>
                <Select value={form.employment_type} onValueChange={(v) => setForm({ ...form, employment_type: v })}>
                  <SelectTrigger id="emp" className="mt-1"><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>{EMPLOYMENT.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="er">Employer / Business Name</Label>
                <Input id="er" value={form.employer_name}
                  onChange={(e) => setForm({ ...form, employer_name: e.target.value })} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="inc">Monthly Income (₦)</Label>
                  <Input id="inc" inputMode="numeric" value={form.monthly_income}
                    onChange={(e) => setForm({ ...form, monthly_income: fmtInput(e.target.value) })} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="tn">How long at current job</Label>
                  <Select value={form.job_tenure} onValueChange={(v) => setForm({ ...form, job_tenure: v })}>
                    <SelectTrigger id="tn" className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{TENURE.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <h2 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" /> Review & submit
              </h2>
              <dl className="text-sm divide-y">
                {[
                  ["Product", PRODUCTS.find((p) => p.id === form.product)?.title],
                  ["Property", form.property_address],
                  ["Landlord", form.landlord_name],
                  ["Annual rent", formatNGN(Number(form.annual_rent.replace(/\D/g, "")))],
                  ["Loan requested", formatNGN(Number(form.loan_amount_requested.replace(/\D/g, "")))],
                  ["Employment", form.employment_type],
                  ["Employer", form.employer_name || "—"],
                  ["Monthly income", formatNGN(Number(form.monthly_income.replace(/\D/g, "")))],
                  ["Job tenure", form.job_tenure || "—"],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex justify-between py-2">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs text-muted-foreground pt-2">
                We will review your application within 2–3 business days and notify you by email and WhatsApp.
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {step < 4 ? (
              <Button onClick={next}>Continue <ChevronRight className="h-4 w-4 ml-1" /></Button>
            ) : (
              <Button onClick={submit} disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {submitting ? "Submitting..." : "Submit application"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
};

export default ApplyLoan;
