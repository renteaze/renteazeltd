import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { TrendingUp } from "lucide-react";

const Financing = () => (
  <PortalShell role="landlord">
    <PortalPlaceholder icon={TrendingUp} title="Financing" description="Unlock financing against your rental income." />
  </PortalShell>
);

export default Financing;
