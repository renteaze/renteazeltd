import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import ComingSoonOverlay from "@/components/portal/ComingSoonOverlay";
import { MessageSquare } from "lucide-react";

const Messages = () => (
  <PortalShell role="tenant">
    <ComingSoonOverlay>
      <PortalPlaceholder icon={MessageSquare} title="Messages" description="Chat with your landlord, agent and Renteaze support." />
    </ComingSoonOverlay>
  </PortalShell>
);

export default Messages;
