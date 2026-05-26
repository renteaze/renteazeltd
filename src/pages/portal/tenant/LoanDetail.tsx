import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import PortalShell from "@/components/portal/PortalShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatNGN, formatDate } from "@/lib/format";

interface Loan {
  id: string;
  product_type: string;
  landlord_name: string | null;
  property_address: string | null;
  annual_rent: number | null;
  loan_amount_requested: number;
  approved_amount: number | null;
  interest_rate: number | null;
  repayment_months: number | null;
  monthly_repayment: number | null;
  outstanding_balance: number | null;
  status: string;
  created_at: string;
  next_due_date: string | null;
  rejection_reason: string | null;
  employment_type: string | null;
  monthly_income: number | null;
  employer_name: string | null;
}

const STAGES = ["submitted", "under_review", "approved", "disbursed", "active_repayment", "closed"];

const PRODUCT_LABEL: Record<string, string> = {
  loan_for_rent: "Loan for Rent",
  add_on_funds: "Add-On Funds",
  upgrade: "Upgrade Accommodation",
  construction: "Construction Funding",
  renovation: "Renovation Financing",
  repair: "Repair Financing",
};

const LoanDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    void (async () => {
      const { data } = await supabase.from("loan_applications").select("*").eq("id", id).maybeSingle();
      setLoan(data as Loan | null);
      setLoading(false);
    })();
  }, [user, id]);

  if (loading) {
    return (
      <PortalShell role="tenant">
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
        </div>
      </PortalShell>
    );
  }

  if (!loan) {
    return (
      <PortalShell role="tenant">
        <p>Loan not found.</p>
        <Link to="/tenant/loans" className="text-primary hover:underline">Back to loans</Link>
      </PortalShell>
    );
  }

  const currentStageIdx = Math.max(
    0,
    loan.status === "rejected" ? -1 : STAGES.indexOf(loan.status),
  );
  const isRejected = loan.status === "rejected";
  const isApprovedish = ["approved", "disbursed", "active_repayment", "closed"].includes(loan.status);

  return (
    <PortalShell role="tenant">
      <Link to="/tenant/loans" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to loans
      </Link>

      {/* Summary */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">{PRODUCT_LABEL[loan.product_type] ?? loan.product_type}</h1>
            <p className="text-sm text-muted-foreground mt-1">Applied {formatDate(loan.created_at)}</p>
          </div>
          <span className={`inline-flex text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${
            isRejected ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
          }`}>
            {loan.status.replace(/_/g, " ")}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Field label="Requested" value={formatNGN(loan.loan_amount_requested)} />
          <Field label="Approved" value={loan.approved_amount ? formatNGN(loan.approved_amount) : "—"} />
          <Field label="Monthly repayment" value={loan.monthly_repayment ? formatNGN(loan.monthly_repayment) : "—"} />
          <Field label="Outstanding" value={loan.outstanding_balance != null ? formatNGN(loan.outstanding_balance) : "—"} />
          <Field label="Interest rate" value={loan.interest_rate ? `${loan.interest_rate}%` : "—"} />
          <Field label="Term" value={loan.repayment_months ? `${loan.repayment_months} months` : "—"} />
          <Field label="Next due" value={formatDate(loan.next_due_date)} />
        </div>
      </div>

      {/* Status timeline */}
      {!isRejected && (
        <div className="mt-6 bg-card border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Application progress</h2>
          <div className="flex items-center justify-between flex-wrap gap-2">
            {STAGES.map((s, i) => {
              const done = i <= currentStageIdx;
              const isCurrent = i === currentStageIdx;
              return (
                <div key={s} className="flex-1 min-w-[100px] text-center">
                  <div className={`mx-auto h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  } ${isCurrent ? "ring-2 ring-accent ring-offset-2" : ""}`}>
                    {i + 1}
                  </div>
                  <p className={`mt-2 text-xs ${done ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {s.replace(/_/g, " ")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rejection */}
      {isRejected && loan.rejection_reason && (
        <div className="mt-6 bg-destructive/5 border border-destructive/30 rounded-xl p-6">
          <h2 className="font-semibold text-destructive">Application not approved</h2>
          <p className="text-sm mt-2">{loan.rejection_reason}</p>
        </div>
      )}

      {/* Property / employment recap */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold mb-3">Property</h3>
          <Field label="Address" value={loan.property_address ?? "—"} />
          <Field label="Landlord" value={loan.landlord_name ?? "—"} />
          <Field label="Annual rent" value={loan.annual_rent ? formatNGN(loan.annual_rent) : "—"} />
        </div>
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold mb-3">Employment</h3>
          <Field label="Status" value={loan.employment_type ?? "—"} />
          <Field label="Employer" value={loan.employer_name ?? "—"} />
          <Field label="Monthly income" value={loan.monthly_income ? formatNGN(loan.monthly_income) : "—"} />
        </div>
      </div>

      {isApprovedish && (
        <div className="mt-6 bg-muted/40 rounded-xl p-6 text-sm">
          <h3 className="font-semibold">Repayment instructions</h3>
          <p className="text-muted-foreground mt-2">
            Transfer your monthly repayment of{" "}
            <strong className="text-foreground">{formatNGN(loan.monthly_repayment ?? 0)}</strong> to your unique
            Renteaze repayment account. Account details will appear here once disbursement is complete.
          </p>
        </div>
      )}
    </PortalShell>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="py-1">
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className="text-sm font-medium mt-0.5">{value}</dd>
  </div>
);

export default LoanDetail;
