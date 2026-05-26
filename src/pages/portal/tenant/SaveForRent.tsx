import { useEffect, useMemo, useState } from "react";
import { Copy, PiggyBank, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import PortalShell from "@/components/portal/PortalShell";
import KycGate from "@/components/kyc/KycGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatNGN, formatDate } from "@/lib/format";

interface Plan {
  id: string;
  product_type: string;
  annual_rent_target: number;
  monthly_contribution: number;
  current_balance: number;
  months_completed: number;
  target_months: number;
  status: string;
  start_date: string;
  virtual_account_number: string | null;
  virtual_bank_name: string | null;
  created_at: string;
}

interface Txn {
  id: string;
  amount: number;
  direction: string;
  status: string;
  reference: string | null;
  description: string | null;
  occurred_at: string;
}

const SaveForRent = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [txns, setTxns] = useState<Txn[]>([]);
  const [annualRent, setAnnualRent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const monthly = useMemo(() => {
    const n = Number(annualRent.replace(/[^\d]/g, ""));
    return Number.isFinite(n) && n > 0 ? Math.round(n / 10) : 0;
  }, [annualRent]);

  useEffect(() => {
    if (!user) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function load() {
    setLoading(true);
    const { data: plans } = await supabase
      .from("savings_plans")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1);
    const p = (plans?.[0] as Plan) ?? null;
    setPlan(p);
    if (p) {
      const { data: ts } = await supabase
        .from("transactions")
        .select("*")
        .eq("plan_id", p.id)
        .order("occurred_at", { ascending: false });
      setTxns((ts as Txn[]) ?? []);
    }
    setLoading(false);
  }

  async function handleEnrol(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const target = Number(annualRent.replace(/[^\d]/g, ""));
    if (!target || target < 50000) {
      toast.error("Enter a valid annual rent (min ₦50,000)");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("savings_plans").insert({
      user_id: user.id,
      product_type: "save_for_rent",
      annual_rent_target: target,
      monthly_contribution: Math.round(target / 10),
      target_months: 10,
      status: "active",
      // Mock virtual account (would be created via bujeti-create-account Edge Function)
      virtual_account_number: "97" + Math.floor(10000000 + Math.random() * 89999999).toString(),
      virtual_bank_name: "Renteaze Wallet (GTBank)",
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Save for Rent plan created!");
    await load();
  }

  async function requestDisbursement() {
    if (!plan) return;
    const { error } = await supabase
      .from("savings_plans")
      .update({ status: "disbursement_requested" })
      .eq("id", plan.id);
    if (error) return toast.error(error.message);
    toast.success("Disbursement requested. Our team will contact you within 48 hours.");
    await load();
  }

  if (loading) {
    return (
      <PortalShell role="tenant">
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
        </div>
      </PortalShell>
    );
  }

  // KYC gate for new enrolment
  if (!plan && profile && !profile.kyc_completed) {
    return (
      <PortalShell role="tenant">
        <h1 className="text-2xl font-bold mb-1">Save for Rent</h1>
        <p className="text-sm text-muted-foreground mb-6">Verify your identity to start your savings plan.</p>
        <KycGate />
      </PortalShell>
    );
  }

  // Enrolment view
  if (!plan) {
    return (
      <PortalShell role="tenant">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold">Set up your Save for Rent plan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pay 10% of your annual rent monthly for 10 months — we release the full amount when your rent is due.
          </p>

          <form onSubmit={handleEnrol} className="mt-6 bg-card border rounded-xl p-6 space-y-4">
            <div>
              <Label htmlFor="rent">Annual Rent Target (₦)</Label>
              <Input
                id="rent"
                inputMode="numeric"
                placeholder="e.g. 1,200,000"
                value={annualRent}
                onChange={(e) =>
                  setAnnualRent(
                    e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  )
                }
                className="mt-1 h-11"
                required
              />
            </div>
            {monthly > 0 && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm">
                <p>
                  <span className="text-muted-foreground">Monthly contribution: </span>
                  <span className="font-semibold text-foreground">{formatNGN(monthly)}</span>
                </p>
                <p className="text-muted-foreground mt-1">Plan duration: 10 months</p>
              </div>
            )}
            <Button type="submit" disabled={submitting || !monthly} className="w-full h-11">
              {submitting ? "Creating plan..." : "Start My Plan"}
            </Button>
          </form>

          <div className="mt-8 bg-muted/40 rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-accent" /> How it works
            </div>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Set your annual rent target above.</li>
              <li>Transfer 1/10 of that amount to your unique account every month.</li>
              <li>When your rent is due, request disbursement — we pay your landlord directly.</li>
            </ol>
          </div>
        </div>
      </PortalShell>
    );
  }

  // Plan dashboard
  const pct = Math.min(100, Math.round((plan.current_balance / plan.annual_rent_target) * 100));
  const monthsPaid = Math.min(plan.target_months, Math.floor(plan.current_balance / plan.monthly_contribution));
  const ready = plan.current_balance >= plan.annual_rent_target;

  return (
    <PortalShell role="tenant">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Save for Rent</h1>
          <p className="text-sm text-muted-foreground">Started {formatDate(plan.start_date)}</p>
        </div>
        <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-success/10 text-success">
          {plan.status.replace(/_/g, " ")}
        </span>
      </div>

      {/* Progress hero */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Saved so far</p>
            <p className="text-3xl font-bold mt-1">{formatNGN(plan.current_balance)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              of {formatNGN(plan.annual_rent_target)} target
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Monthly contribution</p>
            <p className="text-xl font-semibold">{formatNGN(plan.monthly_contribution)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {monthsPaid} of {plan.target_months} months
            </p>
          </div>
        </div>
        <Progress value={pct} className="mt-4" />
        <p className="text-xs text-muted-foreground mt-2">{pct}% complete</p>

        {ready && plan.status === "active" && (
          <Button onClick={requestDisbursement} className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
            Request Disbursement
          </Button>
        )}
      </div>

      {/* Month grid */}
      <div className="mt-6 bg-card border rounded-xl p-6">
        <h2 className="font-semibold">10-month plan</h2>
        <div className="mt-4 grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Array.from({ length: plan.target_months }, (_, i) => {
            const isPaid = i < monthsPaid;
            const isNext = i === monthsPaid && plan.status === "active";
            return (
              <div
                key={i}
                className={`text-center rounded-lg border p-2 text-xs ${
                  isPaid
                    ? "bg-success/10 border-success/40 text-success"
                    : isNext
                      ? "bg-accent/15 border-accent text-foreground"
                      : "bg-muted/40 border-border text-muted-foreground"
                }`}
              >
                <div className="font-semibold">M{i + 1}</div>
                <div className="mt-1">{isPaid ? <CheckCircle2 className="h-3 w-3 inline" /> : isNext ? "Next" : "—"}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Funding account */}
      <div className="mt-6 bg-card border rounded-xl p-6">
        <h2 className="font-semibold flex items-center gap-2">
          <PiggyBank className="h-4 w-4 text-primary" /> Your unique funding account
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Transfer your monthly contribution to this account from any bank.
        </p>
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] bg-muted/40 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">{plan.virtual_bank_name}</p>
            <p className="text-xl font-mono font-bold tracking-wider">{plan.virtual_account_number}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(plan.virtual_account_number ?? "");
              toast.success("Account number copied");
            }}
          >
            <Copy className="h-4 w-4 mr-2" /> Copy
          </Button>
        </div>
      </div>

      {/* Transactions */}
      <div className="mt-6 bg-card border rounded-xl p-6">
        <h2 className="font-semibold">Transaction history</h2>
        {txns.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-2">No transactions yet. Your contributions will appear here.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr className="border-b">
                  <th className="py-2">Date</th>
                  <th className="py-2">Reference</th>
                  <th className="py-2 text-right">Amount</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((t) => (
                  <tr key={t.id} className="border-b last:border-0">
                    <td className="py-2">{formatDate(t.occurred_at)}</td>
                    <td className="py-2 font-mono text-xs">{t.reference ?? "—"}</td>
                    <td className="py-2 text-right font-medium text-success">+{formatNGN(t.amount)}</td>
                    <td className="py-2 capitalize">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PortalShell>
  );
};

export default SaveForRent;
