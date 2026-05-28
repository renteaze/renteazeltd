import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Users, ClipboardCheck, ShieldCheck, Briefcase, Building2, Loader2, Bell, CheckCheck } from "lucide-react";
import PortalShell from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
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

type Notif = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  type: string;
  is_read: boolean;
  created_at: string;
};

const relTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

const AdminDashboard = () => {
  const { user, profile, roles } = useAuth();
  const role = roles.includes("admin") ? "admin" : "staff";
  const [stats, setStats] = useState<Stats | null>(null);
  const [notifs, setNotifs] = useState<Notif[]>([]);

  const loadNotifs = useCallback(async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from("notifications")
      .select("id,title,body,link,type,is_read,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    setNotifs((data ?? []) as Notif[]);
  }, [user?.id]);

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

  useEffect(() => {
    if (!user?.id) return;
    loadNotifs();
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => loadNotifs(),
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, loadNotifs]);

  const markRead = async (id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  };
  const markAllRead = async () => {
    if (!user?.id) return;
    const ids = notifs.filter((n) => !n.is_read).map((n) => n.id);
    if (ids.length === 0) return;
    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabase.from("notifications").update({ is_read: true }).in("id", ids);
  };

  const unread = notifs.filter((n) => !n.is_read).length;

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

          <div className="mt-8 bg-card border rounded-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold">Recent activity</h2>
                {unread > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold">
                    {unread}
                  </span>
                )}
              </div>
              {unread > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllRead}>
                  <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark all read
                </Button>
              )}
            </div>
            {notifs.length === 0 ? (
              <div className="px-5 py-8 text-sm text-muted-foreground text-center">No activity yet.</div>
            ) : (
              <ul className="divide-y">
                {notifs.map((n) => (
                  <li key={n.id} className="flex items-start gap-3 px-5 py-3 hover:bg-muted/30 transition">
                    <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${n.is_read ? "bg-transparent" : "bg-primary"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-medium">{n.title}</span>
                        <span className="text-xs text-muted-foreground">{relTime(n.created_at)}</span>
                      </div>
                      {n.body && <p className="text-sm text-muted-foreground mt-0.5 truncate">{n.body}</p>}
                    </div>
                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={() => markRead(n.id)}
                        className="text-xs text-primary hover:underline shrink-0"
                      >
                        View
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
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
