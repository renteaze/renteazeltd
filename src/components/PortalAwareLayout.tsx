import { ReactNode } from "react";
import Layout from "./Layout";
import PortalShell from "./portal/PortalShell";
import { useAuth, type AppRole } from "@/hooks/useAuth";

/**
 * Renders a public marketing page inside the user's portal shell when they're
 * signed in, so authenticated users don't feel ejected from their account when
 * browsing public listings (Properties, Events, etc.). Falls back to the public
 * Layout for unauthenticated visitors.
 */
const PortalAwareLayout = ({ children }: { children: ReactNode }) => {
  const { user, roles, loading } = useAuth();

  if (loading) return <Layout>{children}</Layout>;
  if (!user || roles.length === 0) return <Layout>{children}</Layout>;

  const role = roles[0] as AppRole;
  return (
    <PortalShell role={role}>
      <div className="p-6">{children}</div>
    </PortalShell>
  );
};

export default PortalAwareLayout;
