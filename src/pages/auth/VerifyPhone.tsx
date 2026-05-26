import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, dashboardPathForRole } from "@/hooks/useAuth";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [seconds, setSeconds] = useState(60);
  const [submitting, setSubmitting] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const email = sessionStorage.getItem("rz_email") || "";
  const { roles, refreshProfile } = useAuth();

  useEffect(() => {
    if (!email) {
      navigate("/signup");
      return;
    }
    // Auto-skip if email is already confirmed (e.g. user clicked link, or admin confirmed)
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email_confirmed_at) {
        await supabase.from("profiles").update({ phone_verified: true }).eq("id", data.user.id);
        await refreshProfile();
        sessionStorage.removeItem("rz_email");
        toast.success("Email already verified");
        navigate("/signup/survey");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const setDigit = (i: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(0, 1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) inputs.current[i + 1]?.focus();
    if (next.every((d) => d) && next.join("").length === 6) {
      void verify(next.join(""));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const txt = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!txt) return;
    e.preventDefault();
    const next = txt.split("").concat(Array(6 - txt.length).fill(""));
    setDigits(next);
    if (txt.length === 6) void verify(txt);
    else inputs.current[txt.length]?.focus();
  };

  const verify = async (code: string) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });
      if (error || !data.session) {
        toast.error(error?.message || "Incorrect or expired code");
        setDigits(Array(6).fill(""));
        inputs.current[0]?.focus();
        return;
      }
      // Mark contact verified on profile (re-using phone_verified flag for now)
      await supabase
        .from("profiles")
        .update({ phone_verified: true })
        .eq("id", data.session.user.id);
      toast.success("Email verified");
      await refreshProfile();
      sessionStorage.removeItem("rz_email");
      navigate("/signup/survey");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    if (seconds > 0) return;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setSeconds(60);
    toast.success("New code sent — check your inbox");
  };

  const masked = email.replace(/^(.{2}).+(@.+)$/, "$1•••$2");

  return (
    <AuthShell>
      <h1 className="text-3xl font-bold">Verify your email</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        We sent a 6-digit code to <span className="font-medium text-foreground">{masked || "your email"}</span>. Enter it below.
      </p>

      <div className="mt-6 bg-card border rounded-xl p-6">
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
              }}
              maxLength={1}
              inputMode="numeric"
              className="w-12 h-14 text-center text-xl font-semibold border-2 rounded-md focus:border-primary focus:outline-none"
            />
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {seconds > 0 ? (
            <>Resend code in 0:{String(seconds).padStart(2, "0")}</>
          ) : (
            <button onClick={resend} className="text-primary font-medium hover:underline">Resend code</button>
          )}
        </p>
        <Button
          onClick={() => verify(digits.join(""))}
          disabled={submitting || digits.some((d) => !d)}
          className="w-full mt-4 bg-primary text-primary-foreground"
        >
          {submitting ? "Verifying..." : "Verify"}
        </Button>
        <button
          onClick={() => navigate("/signup/details")}
          className="block mx-auto mt-3 text-sm text-muted-foreground hover:text-foreground"
        >
          Use a different email
        </button>
        <button
          onClick={() => navigate(dashboardPathForRole(roles[0]))}
          className="block mx-auto mt-2 text-xs text-muted-foreground hover:text-foreground"
        >
          Skip for now
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Didn't get it? Check your spam folder.
      </p>
    </AuthShell>
  );
};

export default VerifyEmail;
