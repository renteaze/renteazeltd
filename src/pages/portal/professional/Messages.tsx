import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { MessageSquare } from "lucide-react";

const Messages = () => (
  <PortalShell role="professional">
    <PortalPlaceholder icon={MessageSquare} title="Messages" description="Reach the Renteaze partner team." />
  </PortalShell>
);

export default Messages;
