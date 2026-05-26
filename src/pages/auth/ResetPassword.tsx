import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Supabase puts a recovery token in the URL hash; the client picks it up automatically.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated — please sign in");
      await supabase.auth.signOut();
      navigate("/signin", { replace: true });
    } catch (err) {
      toast.error((err as Error).message || "Could not update password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="text-3xl font-bold">Set a new password</h1>
      {!ready ? (
        <p className="mt-4 text-sm text-muted-foreground">Validating reset link…</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-card border rounded-xl p-6">
          <div>
            <Label htmlFor="rp-pw">New password</Label>
            <Input id="rp-pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="rp-pw2">Confirm password</Label>
            <Input id="rp-pw2" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1" />
          </div>
          <Button type="submit" disabled={submitting} size="lg" className="w-full bg-primary text-primary-foreground">
            {submitting ? "Updating..." : "Update password"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
};

export default ResetPassword;
