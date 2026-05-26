import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { Banknote } from "lucide-react";

const Payments = () => (
  <PortalShell role="landlord">
    <PortalPlaceholder icon={Banknote} title="Payments" description="Track rent collections and payouts." />
  </PortalShell>
);

export default Payments;
