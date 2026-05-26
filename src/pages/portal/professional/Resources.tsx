import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { BookOpen } from "lucide-react";

const Resources = () => (
  <PortalShell role="professional">
    <PortalPlaceholder icon={BookOpen} title="Resources" description="Marketing assets, training and partner FAQs." />
  </PortalShell>
);

export default Resources;
