import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { Building2 } from "lucide-react";

const Properties = () => (
  <PortalShell role="admin">
    <PortalPlaceholder icon={Building2} title="Properties" description="Verify and manage all property listings." />
  </PortalShell>
);

export default Properties;
