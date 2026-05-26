import PortalShell from "@/components/portal/PortalShell";
import SurveyIncompleteBanner from "@/components/portal/SurveyIncompleteBanner";
import KycGate from "@/components/kyc/KycGate";
import { useAuth } from "@/hooks/useAuth";
import { PiggyBank, CreditCard, FileText } from "lucide-react";

const TenantDashboard = () => {
  const { profile } = useAuth();
  const needsKyc = profile && !profile.kyc_completed;

  return (
    <PortalShell role="tenant">
      <h1 className="text-2xl font-bold mb-1">Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}</h1>
      <p className="text-sm text-muted-foreground mb-6">Here's what's happening with your Renteaze account.</p>
      <SurveyIncompleteBanner />
      {needsKyc ? (
        <KycGate />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card icon={PiggyBank} title="Save for Rent" body="Start a savings plan toward your next rent." />
          <Card icon={CreditCard} title="Loan for Rent" body="Apply for a rent loan with flexible terms." />
          <Card icon={FileText} title="Rent Documents" body="Keep rent records and supporting documents in one place." />
        </div>
      )}
    </PortalShell>
  );
};

const Card = ({ icon: Icon, title, body }: { icon: typeof PiggyBank; title: string; body: string }) => (
  <div className="bg-card border rounded-xl p-5">
    <Icon className="h-6 w-6 text-primary" />
    <h3 className="mt-3 font-semibold">{title}</h3>
    <p className="mt-1 text-sm text-muted-foreground">{body}</p>
  </div>
);

export default TenantDashboard;
