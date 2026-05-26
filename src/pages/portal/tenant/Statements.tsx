import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import PortalShell from "@/components/portal/PortalShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatNGN, formatDate } from "@/lib/format";

interface Txn {
  id: string;
  type: string;
  direction: "credit" | "debit";
  amount: number;
  status: string;
  reference: string | null;
  description: string | null;
  occurred_at: string;
}

const Statements = () => {
  const { user } = useAuth();
  const [txns, setTxns] = useState<Txn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("occurred_at", { ascending: false });
      setTxns((data as Txn[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  const totals = useMemo(() => {
    let saved = 0, repaid = 0, received = 0;
    for (const t of txns) {
      if (t.status !== "confirmed") continue;
      if (t.type === "savings_credit") saved += Number(t.amount);
      else if (t.type === "loan_repayment") repaid += Number(t.amount);
      else if (t.type === "loan_disbursement" || t.type === "payout") received += Number(t.amount);
    }
    return { saved, repaid, received };
  }, [txns]);

  return (
    <PortalShell role="tenant">
      <h1 className="text-2xl font-bold">Statements</h1>
      <p className="text-sm text-muted-foreground mb-6">Your full transaction history.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Stat label="Total saved" value={formatNGN(totals.saved)} />
        <Stat label="Total repaid" value={formatNGN(totals.repaid)} />
        <Stat label="Total received" value={formatNGN(totals.received)} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
        </div>
      ) : txns.length === 0 ? (
        <div className="bg-card border rounded-xl p-10 text-center text-muted-foreground">
          No transactions yet.
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2 text-right">Amount</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {txns.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-4 py-2">{formatDate(t.occurred_at)}</td>
                  <td className="px-4 py-2">{t.description ?? t.reference ?? "—"}</td>
                  <td className="px-4 py-2 capitalize text-xs text-muted-foreground">{t.type.replace(/_/g, " ")}</td>
                  <td className={`px-4 py-2 text-right font-medium ${t.direction === "credit" ? "text-success" : "text-destructive"}`}>
                    {t.direction === "credit" ? "+" : "−"}{formatNGN(t.amount)}
                  </td>
                  <td className="px-4 py-2 capitalize">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PortalShell>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-card border rounded-xl p-5">
    <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default Statements;
