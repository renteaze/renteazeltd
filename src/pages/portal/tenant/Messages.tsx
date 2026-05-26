import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { MessageSquare } from "lucide-react";

const Messages = () => (
  <PortalShell role="tenant">
    <PortalPlaceholder icon={MessageSquare} title="Messages" description="Chat with your landlord, agent and Renteaze support." />
  </PortalShell>
);

export default Messages;
