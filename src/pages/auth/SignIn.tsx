import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, dashboardPathForRole } from "@/hooks/useAuth";

const SignIn = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect");
  const { user, roles, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    if (redirect) { navigate(redirect, { replace: true }); return; }
    navigate(dashboardPathForRole(roles[0]), { replace: true });
  }, [user, loading, roles, redirect, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back");
    } catch (err) {
      toast.error((err as Error).message || "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="text-3xl font-bold">Sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">Welcome back to Renteaze.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-card border rounded-xl p-6">
        <div>
          <Label htmlFor="si-email">Email</Label>
          <Input id="si-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="si-pw">Password</Label>
          <Input id="si-pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
          <Link to="/forgot-password" className="block mt-1 text-xs text-primary hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" disabled={submitting} size="lg" className="w-full bg-primary text-primary-foreground">
          {submitting ? "Signing in..." : "Sign In"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New to Renteaze? <Link to="/signup" className="text-primary font-semibold hover:underline">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
};

export default SignIn;
