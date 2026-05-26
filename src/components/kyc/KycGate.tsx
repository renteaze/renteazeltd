import { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const BANKS = [
  "GTBank", "Access Bank", "First Bank", "Zenith Bank", "UBA",
  "Stanbic IBTC", "Sterling Bank", "FCMB", "Wema Bank", "Other",
];

interface KycGateProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const KycGate = ({ onComplete, onSkip }: KycGateProps) => {
  const { user, refreshProfile } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    nin: "", bvn: "", account: "", bank: "", dob: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-nin", {
        body: {
          nin: form.nin,
          bvn: form.bvn,
          account: form.account,
          bank: form.bank,
          dob: form.dob,
        },
      });
      if (error || !data?.verified) {
        toast.error(data?.error || "NIN verification failed", {
          description: "Please check your details and try again.",
        });
        return;
      }
      toast.success("Identity verified");
      await refreshProfile();
      onComplete?.();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-card rounded-xl border shadow-sm p-6 md:p-8">
      <h2 className="text-2xl font-bold">Before we continue, we need to verify your identity</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        This is a one-time step required by Nigerian financial regulations. Your details are encrypted and never shared without your consent.
      </p>

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <span className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded">
          <Lock className="h-3 w-3" /> Bank-grade encryption
        </span>
        <span className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded">
          <ShieldCheck className="h-3 w-3" /> CBN-compliant
        </span>
        <span className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded">
          RC 1768094
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="kyc-nin">NIN (11 digits)</Label>
          <Input id="kyc-nin" required inputMode="numeric" maxLength={11}
            value={form.nin} onChange={(e) => setForm({ ...form, nin: e.target.value.replace(/\D/g, "") })}
            className="mt-1" placeholder="National Identification Number" />
        </div>
        <div>
          <Label htmlFor="kyc-bvn">BVN (11 digits)</Label>
          <Input id="kyc-bvn" required inputMode="numeric" maxLength={11}
            value={form.bvn} onChange={(e) => setForm({ ...form, bvn: e.target.value.replace(/\D/g, "") })}
            className="mt-1" placeholder="Bank Verification Number" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="kyc-account">Bank Account Number</Label>
            <Input id="kyc-account" required inputMode="numeric" maxLength={10}
              value={form.account} onChange={(e) => setForm({ ...form, account: e.target.value.replace(/\D/g, "") })}
              className="mt-1" />
          </div>
          <div>
            <Label htmlFor="kyc-bank">Bank Name</Label>
            <Select value={form.bank} onValueChange={(v) => setForm({ ...form, bank: v })}>
              <SelectTrigger id="kyc-bank" className="mt-1"><SelectValue placeholder="Select bank" /></SelectTrigger>
              <SelectContent>
                {BANKS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="kyc-dob">Date of Birth</Label>
          <Input id="kyc-dob" required type="date"
            value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })}
            className="mt-1" />
        </div>
        <Button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground h-11">
          {submitting ? "Verifying..." : "Verify My Identity"}
        </Button>
        {onSkip && (
          <button type="button" onClick={onSkip} className="block w-full text-center text-sm text-muted-foreground hover:text-foreground">
            I'll do this later
          </button>
        )}
      </form>
    </div>
  );
};

export default KycGate;
