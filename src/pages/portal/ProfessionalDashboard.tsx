import PortalShell from "@/components/portal/PortalShell";
import SurveyIncompleteBanner from "@/components/portal/SurveyIncompleteBanner";
import { useAuth } from "@/hooks/useAuth";
import { Share2, DollarSign, BookOpen, Clock } from "lucide-react";

const ProfessionalDashboard = () => {
  const { profile } = useAuth();
  const pending = profile?.status === "pending_approval";

  return (
    <PortalShell role="professional">
      <h1 className="text-2xl font-bold mb-1">Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}</h1>
      <p className="text-sm text-muted-foreground mb-6">Refer clients and earn commissions.</p>
      <SurveyIncompleteBanner />

      {pending && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4 mb-6 flex gap-3">
          <Clock className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Application under review</p>
            <p className="text-sm mt-0.5">Our team is verifying your credentials. You'll get an email within 24–48 hours once approved.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Your referral code</p>
          <p className="mt-2 text-2xl font-bold">{profile?.referral_code || "—"}</p>
          <p className="mt-1 text-xs text-muted-foreground">Share to start earning</p>
        </div>
        <Card icon={Share2} title="My Referrals" body="See who you've referred and their status." />
        <Card icon={DollarSign} title="Commissions" body="Track earned and pending payouts." />
        <Card icon={BookOpen} title="Resources" body="Sales kits, brochures, and training." />
      </div>
    </PortalShell>
  );
};

const Card = ({ icon: Icon, title, body }: { icon: typeof Share2; title: string; body: string }) => (
  <div className="bg-card border rounded-xl p-5">
    <Icon className="h-6 w-6 text-primary" />
    <h3 className="mt-3 font-semibold">{title}</h3>
    <p className="mt-1 text-sm text-muted-foreground">{body}</p>
  </div>
);

export default ProfessionalDashboard;
