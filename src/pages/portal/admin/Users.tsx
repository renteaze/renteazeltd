import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import PortalShell from "@/components/portal/PortalShell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import UserDetailDrawer from "@/components/admin/UserDetailDrawer";
import type { AppRole } from "@/hooks/useAuth";

type AdminUser = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  phone: string | null;
  status: string;
  survey_completed: boolean;
  survey_completed_at: string | null;
  kyc_status: string;
  created_at: string;
  roles: AppRole[];
};

type RoleFilter = "all" | AppRole;
type SurveyFilter = "all" | "completed" | "pending";

const ROLE_OPTIONS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "All roles" },
  { value: "tenant", label: "Tenants" },
  { value: "landlord", label: "Landlords" },
  { value: "investor", label: "Investors" },
  { value: "professional", label: "Professionals" },
  { value: "admin", label: "Admins" },
];

const SURVEY_OPTIONS: { value: SurveyFilter; label: string }[] = [
  { value: "all", label: "All surveys" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
];

const Users = () => {
  const [params, setParams] = useSearchParams();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(
    (params.get("role") as RoleFilter) || "all"
  );
  const [surveyFilter, setSurveyFilter] = useState<SurveyFilter>(
    (params.get("survey") as SurveyFilter) || "all"
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "id,email,first_name,last_name,full_name,phone,status,survey_completed,survey_completed_at,kyc_status,created_at"
          )
          .order("created_at", { ascending: false })
          .limit(500),
        supabase.from("user_roles").select("user_id,role"),
      ]);
      if (!active) return;
      const rolesByUser = new Map<string, AppRole[]>();
      (roles ?? []).forEach((r: { user_id: string; role: AppRole }) => {
        const arr = rolesByUser.get(r.user_id) ?? [];
        arr.push(r.role);
        rolesByUser.set(r.user_id, arr);
      });
      const merged: AdminUser[] = (profiles ?? []).map((p) => ({
        ...(p as Omit<AdminUser, "roles">),
        roles: rolesByUser.get(p.id) ?? [],
      }));
      setUsers(merged);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && !u.roles.includes(roleFilter)) return false;
      if (surveyFilter === "completed" && !u.survey_completed) return false;
      if (surveyFilter === "pending" && u.survey_completed) return false;
      if (!q) return true;
      const hay = `${u.full_name ?? ""} ${u.first_name ?? ""} ${u.last_name ?? ""} ${u.email ?? ""} ${u.phone ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [users, search, roleFilter, surveyFilter]);

  const updateFilter = (key: "role" | "survey", value: string) => {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  return (
    <PortalShell role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Users</h1>
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${filtered.length} of ${users.length} users`}
        </p>
      </div>

      <div className="bg-card border rounded-xl p-4 mb-4 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as RoleFilter);
              updateFilter("role", e.target.value);
            }}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={surveyFilter}
            onChange={(e) => {
              setSurveyFilter(e.target.value as SurveyFilter);
              updateFilter("survey", e.target.value);
            }}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            {SURVEY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No users match these filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Roles</th>
                  <th className="text-left p-3 font-medium">Survey</th>
                  <th className="text-left p-3 font-medium">KYC</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setSelectedId(u.id)}
                    className="border-t cursor-pointer hover:bg-muted/30"
                  >
                    <td className="p-3 font-medium">
                      {u.full_name || `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || "—"}
                    </td>
                    <td className="p-3 text-muted-foreground">{u.email || "—"}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.length ? u.roles.map((r) => (
                          <Badge key={r} variant="secondary" className="text-[10px]">{r}</Badge>
                        )) : <span className="text-muted-foreground">—</span>}
                      </div>
                    </td>
                    <td className="p-3">
                      {u.survey_completed ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20">Done</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </td>
                    <td className="p-3 capitalize text-muted-foreground">{u.kyc_status}</td>
                    <td className="p-3 capitalize text-muted-foreground">{u.status.replace("_", " ")}</td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserDetailDrawer
        userId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </PortalShell>
  );
};

export default Users;
