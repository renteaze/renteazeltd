import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { FileText } from "lucide-react";

const Documents = () => (
  <PortalShell role="landlord">
    <PortalPlaceholder icon={FileText} title="Documents" description="Lease agreements, certificates and statements." />
  </PortalShell>
);

export default Documents;
