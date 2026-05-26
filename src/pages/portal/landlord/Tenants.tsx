import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { Users } from "lucide-react";

const Tenants = () => (
  <PortalShell role="landlord">
    <PortalPlaceholder icon={Users} title="Tenants" description="Manage tenancies, leases and tenant communications." />
  </PortalShell>
);

export default Tenants;
