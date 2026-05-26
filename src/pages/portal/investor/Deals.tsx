import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { TrendingUp } from "lucide-react";

const Deals = () => (
  <PortalShell role="investor">
    <PortalPlaceholder icon={TrendingUp} title="My Deals" description="Track your active investments and returns." />
  </PortalShell>
);

export default Deals;
