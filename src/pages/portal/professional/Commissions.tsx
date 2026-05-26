import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { DollarSign } from "lucide-react";

const Commissions = () => (
  <PortalShell role="professional">
    <PortalPlaceholder icon={DollarSign} title="Commissions" description="View earned, pending and paid commissions." />
  </PortalShell>
);

export default Commissions;
