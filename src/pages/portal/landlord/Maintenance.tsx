import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { Wrench } from "lucide-react";

const Maintenance = () => (
  <PortalShell role="landlord">
    <PortalPlaceholder icon={Wrench} title="Maintenance" description="Receive and assign maintenance requests." />
  </PortalShell>
);

export default Maintenance;
