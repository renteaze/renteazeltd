import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { FileText } from "lucide-react";

const Documents = () => (
  <PortalShell role="investor">
    <PortalPlaceholder icon={FileText} title="Documents" description="Investment agreements, term sheets and KYC." />
  </PortalShell>
);

export default Documents;
