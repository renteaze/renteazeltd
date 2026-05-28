import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, defaultDashboardForRoles } from "@/hooks/useAuth";

const SUPABASE_AUTH_STORAGE_KEY = "sb-neamtpgdqbfuxotozkpd-auth-token";


const SignIn = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect");
  const { user, roles, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    if (redirect) { navigate(redirect, { replace: true }); return; }
    navigate(defaultDashboardForRoles(roles), { replace: true });
  }, [user, loading, roles, redirect, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!remember) {
        try {
          const token = localStorage.getItem(SUPABASE_AUTH_STORAGE_KEY);
          if (token) {
            sessionStorage.setItem(SUPABASE_AUTH_STORAGE_KEY, token);
            localStorage.removeItem(SUPABASE_AUTH_STORAGE_KEY);
          }
        } catch { /* ignore */ }
      }
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
          <div className="relative mt-1">
            <Input
              id="si-pw"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
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

