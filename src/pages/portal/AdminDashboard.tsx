import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, ClipboardCheck, ShieldCheck, Briefcase, Building2, Loader2 } from "lucide-react";
import PortalShell from "@/components/portal/PortalShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Stats = {
  total: number;
  tenants: number;
  landlords: number;
  investors: number;
  professionals: number;
  surveyDone: number;
  surveyPending: number;
  kycPending: number;
  pendingApprovals: number;
};

const AdminDashboard = () => {
  const { profile, roles } = useAuth();
  const role = roles.includes("admin") ? "admin" : "staff";
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: profiles }, { data: ur }] = await Promise.all([
        supabase.from("profiles").select("survey_completed,kyc_status,status").limit(1000),
        supabase.from("user_roles").select("role,user_id").limit(2000),
      ]);
      const total = profiles?.length ?? 0;
      const surveyDone = profiles?.filter((p) => p.survey_completed).length ?? 0;
      const kycPending = profiles?.filter((p) => p.kyc_status !== "verified").length ?? 0;
      const pendingApprovals = profiles?.filter((p) => p.status === "pending_approval").length ?? 0;
      const byRole = (r: string) => new Set((ur ?? []).filter((x) => x.role === r).map((x) => x.user_id)).size;
      setStats({
        total,
        tenants: byRole("tenant"),
        landlords: byRole("landlord"),
        investors: byRole("investor"),
        professionals: byRole("professional"),
        surveyDone,
        surveyPending: total - surveyDone,
        kycPending,
        pendingApprovals,
      });
    })();
  }, []);

  return (
    <PortalShell role={role}>
      <h1 className="text-2xl font-bold mb-1">Admin{profile?.first_name ? `, ${profile.first_name}` : ""}</h1>
      <p className="text-sm text-muted-foreground mb-6">Operations console.</p>

      {!stats ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat to="/admin/users" icon={Users} label="Total users" value={stats.total} />
            <Stat to="/admin/users?survey=completed" icon={ClipboardCheck} label="Surveys completed" value={stats.surveyDone} />
            <Stat to="/admin/users?survey=pending" icon={ClipboardCheck} label="Surveys pending" value={stats.surveyPending} accent />
            <Stat to="/admin/users" icon={ShieldCheck} label="KYC pending" value={stats.kycPending} accent />
          </div>

          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-8 mb-3">By role</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat to="/admin/users?role=tenant" icon={Users} label="Tenants" value={stats.tenants} />
            <Stat to="/admin/users?role=landlord" icon={Building2} label="Landlords" value={stats.landlords} />
            <Stat to="/admin/users?role=investor" icon={Briefcase} label="Investors" value={stats.investors} />
            <Stat to="/admin/users?role=professional" icon={Briefcase} label="Professionals" value={stats.professionals} />
          </div>
        </>
      )}
    </PortalShell>
  );
};

const Stat = ({ to, icon: Icon, label, value, accent }: {
  to: string; icon: typeof Users; label: string; value: number; accent?: boolean;
}) => (
  <Link to={to} className="bg-card border rounded-xl p-5 hover:border-primary transition block">
    <Icon className={`h-5 w-5 ${accent ? "text-accent" : "text-primary"}`} />
    <div className="mt-3 text-2xl font-bold">{value}</div>
    <div className="text-xs text-muted-foreground mt-1">{label}</div>
  </Link>
);

export default AdminDashboard;
