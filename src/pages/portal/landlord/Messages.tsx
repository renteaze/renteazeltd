import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { MessageSquare } from "lucide-react";

const Messages = () => (
  <PortalShell role="landlord">
    <PortalPlaceholder icon={MessageSquare} title="Messages" description="Talk to tenants, agents and Renteaze." />
  </PortalShell>
);

export default Messages;
