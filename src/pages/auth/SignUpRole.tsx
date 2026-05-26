import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Home, Building2, TrendingUp, Briefcase } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";

type Role = "tenant" | "landlord" | "investor" | "professional";

const ROLES: { value: Role; label: string; desc: string; icon: typeof Home }[] = [
  { value: "tenant", label: "Tenant", desc: "I rent a property and want flexible rent solutions", icon: Home },
  { value: "landlord", label: "Landlord", desc: "I own property and want professional management", icon: Building2 },
  { value: "investor", label: "Investor", desc: "I want to invest in Nigerian real estate or PropTech", icon: TrendingUp },
  { value: "professional", label: "Professional", desc: "I refer clients and earn commissions", icon: Briefcase },
];

const SignUpRole = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Role | "">("");

  useEffect(() => {
    const r = params.get("role") as Role | null;
    if (r && ROLES.some((x) => x.value === r)) setSelected(r);
    const product = params.get("product");
    const ref = params.get("ref");
    if (product) sessionStorage.setItem("rz_product", product);
    if (ref) sessionStorage.setItem("rz_ref", ref);
  }, [params]);

  const handleContinue = () => {
    if (!selected) return;
    navigate(`/signup/details?role=${selected}`);
  };

  return (
    <AuthShell step={{ current: 1, total: 2 }}>
      <h1 className="text-3xl font-bold">Join Renteaze — choose your account type</h1>
      <p className="mt-1 text-muted-foreground">Pick the option that fits you best.</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROLES.map((r) => {
          const Icon = r.icon;
          const isSelected = selected === r.value;
          return (
            <button
              key={r.value}
              type="button"
              onClick={() => setSelected(r.value)}
              className={`text-left rounded-xl border-2 p-4 transition-all ${
                isSelected
                  ? "border-primary bg-light-blue"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              <p className="mt-2 font-semibold">{r.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
            </button>
          );
        })}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!selected}
        size="lg"
        className="w-full mt-6 bg-primary text-primary-foreground"
      >
        Continue
      </Button>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/signin" className="text-primary font-medium hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
};

export default SignUpRole;
