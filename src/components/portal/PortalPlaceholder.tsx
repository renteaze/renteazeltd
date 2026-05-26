import { Link } from "react-router-dom";
import { ArrowLeft, Construction, type LucideIcon } from "lucide-react";
import { useAuth, dashboardPathForRole } from "@/hooks/useAuth";

interface Props {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

const PortalPlaceholder = ({ title, description, icon: Icon = Construction }: Props) => {
  const { roles } = useAuth();
  const dashPath = dashboardPathForRole(roles[0]);

  return (
    <div className="max-w-xl mx-auto bg-card border rounded-xl p-8 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-accent/15 text-accent flex items-center justify-center">
        <Icon className="h-6 w-6" />
      </div>
      <h1 className="mt-4 text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {description || "This area is coming soon. We're building it as part of the Renteaze roadmap."}
      </p>
      <Link
        to={dashPath}
        className="mt-6 inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
    </div>
  );
};

export default PortalPlaceholder;
