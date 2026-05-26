import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Check your email for the reset link");
    } catch (err) {
      toast.error((err as Error).message || "Could not send reset email");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="text-3xl font-bold">Reset your password</h1>
      <p className="mt-1 text-sm text-muted-foreground">We'll email you a secure link.</p>
      {sent ? (
        <div className="mt-6 bg-card border rounded-xl p-6">
          <p className="text-sm">If an account exists for <strong>{email}</strong>, a reset link is on its way.</p>
          <Link to="/signin" className="block mt-4 text-center text-sm text-primary hover:underline">← Back to sign in</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-card border rounded-xl p-6">
          <div>
            <Label htmlFor="fp-email">Email</Label>
            <Input id="fp-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
          </div>
          <Button type="submit" disabled={submitting} size="lg" className="w-full bg-primary text-primary-foreground">
            {submitting ? "Sending..." : "Send reset link"}
          </Button>
          <Link to="/signin" className="block text-center text-sm text-muted-foreground hover:text-foreground">← Back to sign in</Link>
        </form>
      )}
    </AuthShell>
  );
};

export default ForgotPassword;
