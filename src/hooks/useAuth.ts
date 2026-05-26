import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type AppRole = "tenant" | "landlord" | "investor" | "professional" | "staff" | "admin";

const APP_ROLES: AppRole[] = ["tenant", "landlord", "investor", "professional", "staff", "admin"];

function getFallbackRole(user: User): AppRole {
  const metadataRole = user.user_metadata?.role;
  return APP_ROLES.includes(metadataRole as AppRole) ? (metadataRole as AppRole) : "tenant";
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  phone_verified: boolean;
  status: "active" | "suspended" | "pending_approval";
  survey_completed: boolean;
  kyc_completed: boolean;
  referral_code: string | null;
  [k: string]: unknown;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => false | Promise<void> | null;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lovable Cloud not enabled yet — skip Supabase wiring to avoid crashes during mock phase
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
      setLoading(false);
      return;
    }

    // Subscribe FIRST to avoid race conditions
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (event === "SIGNED_OUT" || !s?.user) {
        setProfile(null);
        setRoles([]);
        setLoading(false);
      } else {
        setLoading(true);
        // Defer DB calls so onAuthStateChange returns fast
        setTimeout(() => { loadProfile(s.user!); }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        loadProfile(s.user);
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function loadProfile(currentUser: User) {
    try {
      let [{ data: p }, { data: r }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", currentUser.id),
      ]);

      // Retry once if profile didn't load — defeats early auth-event race where
      // the JWT hasn't been attached to PostgREST yet.
      if (!p) {
        await supabase.auth.getSession();
        const retry = await supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle();
        p = retry.data;
        if (!r || r.length === 0) {
          const rr = await supabase.from("user_roles").select("role").eq("user_id", currentUser.id);
          r = rr.data;
        }
      }
      
      // Merge profile with auth user data as fallback
      // This ensures email, first_name, last_name are always available
      const mergedProfile: Profile | null = p ? {
        ...p as Profile,
        email: p.email || currentUser.email || null,
        first_name: p.first_name || (currentUser.user_metadata?.first_name as string | undefined) || null,
        last_name: p.last_name || (currentUser.user_metadata?.last_name as string | undefined) || null,
        full_name: p.full_name || (currentUser.user_metadata?.first_name || currentUser.user_metadata?.last_name) ? 
          `${currentUser.user_metadata?.first_name || ''} ${currentUser.user_metadata?.last_name || ''}`.trim() || null
          : null,
        phone: p.phone || (currentUser.user_metadata?.phone as string | undefined) || null,
      } : null;
      
      setProfile(mergedProfile);
      const dbRoles = (r ?? []).map((x: { role: AppRole }) => x.role).filter((role) => APP_ROLES.includes(role));
      setRoles(dbRoles.length > 0 ? dbRoles : [getFallbackRole(currentUser)]);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setRoles([]);
  }

  const value = {
    session,
    user,
    profile,
    roles,
    loading,
    signOut,
    refreshProfile: () => user && loadProfile(user),
  };

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used within AuthProvider");
  return auth;
}

export function dashboardPathForRole(role: AppRole | undefined): string {
  switch (role) {
    case "landlord": return "/landlord/dashboard";
    case "investor": return "/investor/dashboard";
    case "professional": return "/professional/dashboard";
    case "staff":
    case "admin": return "/admin/dashboard";
    case "tenant":
    default: return "/tenant/dashboard";
  }
}
