import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, type AppRole, dashboardPathForRole } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
  roles?: AppRole[];
  children: ReactNode;
}

const RequireAuth = ({ roles, children }: RequireAuthProps) => {
  const { user, roles: userRoles, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/signin?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (roles && roles.length > 0) {
    const hasRole = userRoles.some((r) => roles.includes(r));
    if (!hasRole) {
      const fallbackPath = dashboardPathForRole(userRoles[0]);
      if (fallbackPath !== location.pathname) {
        return <Navigate to={fallbackPath} replace />;
      }
    }
  }

  return <>{children}</>;
};

export default RequireAuth;
