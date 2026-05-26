import PortalShell from "@/components/portal/PortalShell";
import SurveyIncompleteBanner from "@/components/portal/SurveyIncompleteBanner";
import KycGate from "@/components/kyc/KycGate";
import { useAuth } from "@/hooks/useAuth";
import { Briefcase, TrendingUp, BarChart2 } from "lucide-react";

const InvestorDashboard = () => {
  const { profile } = useAuth();
  const needsKyc = profile && !profile.kyc_completed;
  return (
    <PortalShell role="investor">
      <h1 className="text-2xl font-bold mb-1">Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}</h1>
      <p className="text-sm text-muted-foreground mb-6">Discover and manage your investment opportunities.</p>
      <SurveyIncompleteBanner />
      {needsKyc ? (
        <KycGate />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card icon={Briefcase} title="Opportunities" body="Curated deals matched to your appetite." />
          <Card icon={TrendingUp} title="My Deals" body="Track funded investments and returns." />
          <Card icon={BarChart2} title="Reports" body="Monthly performance statements." />
        </div>
      )}
    </PortalShell>
  );
};

const Card = ({ icon: Icon, title, body }: { icon: typeof Briefcase; title: string; body: string }) => (
  <div className="bg-card border rounded-xl p-5">
    <Icon className="h-6 w-6 text-primary" />
    <h3 className="mt-3 font-semibold">{title}</h3>
    <p className="mt-1 text-sm text-muted-foreground">{body}</p>
  </div>
);

export default InvestorDashboard;
