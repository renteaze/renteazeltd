import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { Briefcase } from "lucide-react";

const Opportunities = () => (
  <PortalShell role="investor">
    <PortalPlaceholder icon={Briefcase} title="Opportunities" description="Browse curated property investment opportunities." />
  </PortalShell>
);

export default Opportunities;
