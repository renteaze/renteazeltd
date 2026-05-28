import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AdminSignIn = () => {
  const navigate = useNavigate();
  const { user, roles, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If already signed in with admin/staff, send straight to admin dashboard.
  useEffect(() => {
    if (loading || !user) return;
    if (roles.includes("admin") || roles.includes("staff")) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, roles, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const uid = data.user?.id;
      if (!uid) throw new Error("Sign in failed");

      // Verify admin/staff role server-side via RLS-protected table.
      const { data: roleRows, error: roleErr } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid);
      if (roleErr) throw roleErr;

      const userRoles = (roleRows ?? []).map((r) => r.role);
      const isAdmin = userRoles.includes("admin") || userRoles.includes("staff");

      if (!isAdmin) {
        await supabase.auth.signOut();
        toast.error("This account does not have admin access.");
        return;
      }

      toast.success("Welcome back, admin");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      toast.error((err as Error).message || "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <div className="flex items-center gap-2 text-primary">
        <ShieldCheck className="h-6 w-6" />
        <span className="text-xs font-semibold uppercase tracking-wider">Staff portal</span>
      </div>
      <h1 className="mt-2 text-3xl font-bold">Admin sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Restricted access. Use your Renteaze credentials.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-card border rounded-xl p-6">
        <div>
          <Label htmlFor="ad-email">Email</Label>
          <Input
            id="ad-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="ad-pw">Password</Label>
          <Input
            id="ad-pw"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
          />
          <Link to="/forgot-password" className="block mt-1 text-xs text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          disabled={submitting}
          size="lg"
          className="w-full bg-primary text-primary-foreground"
        >
          {submitting ? "Signing in..." : "Sign in to admin"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Not a staff member?{" "}
          <Link to="/signin" className="text-primary font-semibold hover:underline">
            Go to user sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
};

export default AdminSignIn;
