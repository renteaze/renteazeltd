import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const CheckEmail = () => {
  const [params] = useSearchParams();
  const email = params.get("email") || sessionStorage.getItem("rz_email") || "";
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error("Missing email address — please sign up again.");
      return;
    }
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/signup/survey` },
      });
      if (error) throw error;
      toast.success("Confirmation email resent");
    } catch (err) {
      toast.error((err as Error).message || "Could not resend email");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell step={{ current: 2, total: 2 }}>
      <div className="flex flex-col items-center text-center">
        <div className="rounded-full bg-primary/10 p-4">
          <Mail className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Confirm your email</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          We've sent a confirmation link to{" "}
          <span className="font-medium text-foreground">{email || "your email"}</span>. Click
          the link in that message to activate your account and continue to your survey.
        </p>

        <div className="mt-6 w-full max-w-sm space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? "Resending…" : "Resend confirmation email"}
          </Button>
          <Link
            to="/signin"
            className="block text-center text-sm text-muted-foreground hover:text-foreground"
          >
            Already confirmed? Sign in →
          </Link>
        </div>

        <p className="mt-6 text-xs text-muted-foreground max-w-md">
          Didn't get it? Check your spam folder, or wait a minute before resending.
        </p>
      </div>
    </AuthShell>
  );
};

export default CheckEmail;
