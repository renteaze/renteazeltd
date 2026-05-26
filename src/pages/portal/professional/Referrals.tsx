import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { Share2 } from "lucide-react";

const Referrals = () => (
  <PortalShell role="professional">
    <PortalPlaceholder icon={Share2} title="My Referrals" description="Track every lead you have referred to Renteaze." />
  </PortalShell>
);

export default Referrals;
