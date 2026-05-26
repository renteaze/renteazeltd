import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { FileText } from "lucide-react";

const Applications = () => (
  <PortalShell role="admin">
    <PortalPlaceholder icon={FileText} title="Applications" description="Loan, tenancy and KYC applications queue." />
  </PortalShell>
);

export default Applications;
