import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import PortalShell from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatNGN, formatDate } from "@/lib/format";

interface Loan {
  id: string;
  product_type: string;
  loan_amount_requested: number;
  approved_amount: number | null;
  status: string;
  next_due_date: string | null;
  created_at: string;
}

const STATUS_COLOR: Record<string, string> = {
  submitted: "bg-muted text-foreground",
  under_review: "bg-accent/15 text-accent-foreground border border-accent/30",
  approved: "bg-success/10 text-success",
  disbursed: "bg-primary/10 text-primary",
  active_repayment: "bg-primary/10 text-primary",
  closed: "bg-muted text-muted-foreground",
  rejected: "bg-destructive/10 text-destructive",
};

const PRODUCT_LABEL: Record<string, string> = {
  loan_for_rent: "Loan for Rent",
  add_on_funds: "Add-On Funds",
  upgrade: "Upgrade Accommodation",
  construction: "Construction Funding",
  renovation: "Renovation Financing",
  repair: "Repair Financing",
};

const Loans = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const { data } = await supabase
        .from("loan_applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setLoans((data as Loan[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  return (
    <PortalShell role="tenant">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Loan Applications</h1>
          <p className="text-sm text-muted-foreground">Apply for a rent loan and track repayments.</p>
        </div>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link to="/tenant/loans/apply"><Plus className="h-4 w-4 mr-2" /> Apply for Loan</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
        </div>
      ) : loans.length === 0 ? (
        <div className="bg-card border rounded-xl p-10 text-center">
          <h3 className="font-semibold">No loan applications yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Apply for your first rent loan in just a few minutes.</p>
          <Button asChild className="mt-4">
            <Link to="/tenant/loans/apply">Start application</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Applied</th>
                <th className="px-4 py-3">Next due</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loans.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{PRODUCT_LABEL[l.product_type] ?? l.product_type}</td>
                  <td className="px-4 py-3 text-right">{formatNGN(l.approved_amount ?? l.loan_amount_requested)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLOR[l.status] ?? "bg-muted"}`}>
                      {l.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatDate(l.created_at)}</td>
                  <td className="px-4 py-3">{formatDate(l.next_due_date)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/tenant/loans/${l.id}`} className="text-primary text-sm font-medium hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PortalShell>
  );
};

export default Loans;
