import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { MessageSquare } from "lucide-react";

const Messages = () => (
  <PortalShell role="investor">
    <PortalPlaceholder icon={MessageSquare} title="Messages" description="Talk to your account manager and operators." />
  </PortalShell>
);

export default Messages;
