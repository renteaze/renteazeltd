import PortalShell from "@/components/portal/PortalShell";
import SurveyIncompleteBanner from "@/components/portal/SurveyIncompleteBanner";
import KycGate from "@/components/kyc/KycGate";
import { useAuth } from "@/hooks/useAuth";
import { Building2, Banknote, Wrench } from "lucide-react";

const LandlordDashboard = () => {
  const { profile } = useAuth();
  const needsKyc = profile && !profile.kyc_completed;
  return (
    <PortalShell role="landlord">
      <h1 className="text-2xl font-bold mb-1">Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage your properties and tenants.</p>
      <SurveyIncompleteBanner />
      {needsKyc ? (
        <KycGate />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card icon={Building2} title="Add Property" body="List a new property for management." />
          <Card icon={Banknote} title="Rent Collection" body="Track payments and disbursements." />
          <Card icon={Wrench} title="Maintenance" body="Manage service requests and vendors." />
        </div>
      )}
    </PortalShell>
  );
};

const Card = ({ icon: Icon, title, body }: { icon: typeof Building2; title: string; body: string }) => (
  <div className="bg-card border rounded-xl p-5">
    <Icon className="h-6 w-6 text-primary" />
    <h3 className="mt-3 font-semibold">{title}</h3>
    <p className="mt-1 text-sm text-muted-foreground">{body}</p>
  </div>
);

export default LandlordDashboard;
