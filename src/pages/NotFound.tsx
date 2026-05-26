import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth, dashboardPathForRole } from "@/hooks/useAuth";
import PortalShell from "@/components/portal/PortalShell";
import PortalPlaceholder from "@/components/portal/PortalPlaceholder";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { user, roles, loading } = useAuth();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (user) {
    const role = roles[0] || "tenant";
    const portalRole = role === "staff" ? "admin" : role;
    return (
      <PortalShell role={portalRole as Parameters<typeof PortalShell>[0]["role"]}>
        <PortalPlaceholder
          icon={FileQuestion}
          title="Page not found"
          description={`We couldn't find ${location.pathname}. Use the sidebar to navigate, or head back to your dashboard.`}
        />
      </PortalShell>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
