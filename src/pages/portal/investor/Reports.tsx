import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { BarChart2 } from "lucide-react";

const Reports = () => (
  <PortalShell role="investor">
    <PortalPlaceholder icon={BarChart2} title="Reports" description="Quarterly performance and yield reports." />
  </PortalShell>
);

export default Reports;
