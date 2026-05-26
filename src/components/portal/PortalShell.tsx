import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Settings as SettingsIcon, LogOut, Bell, Menu, X,
  PiggyBank, CreditCard, FileText, BarChart2, Home, Calendar, MessageSquare,
  Building2, Users, Banknote, Wrench, TrendingUp, Briefcase, Share2,
  DollarSign, BookOpen, Shield, ClipboardList,
} from "lucide-react";
import { useAuth, type AppRole } from "@/hooks/useAuth";
import UserMenu from "@/components/UserMenu";
import logo from "@/assets/renteaze-logo-white.png";

type NavItem = { label: string; path: string; icon: typeof Home };

const NAV_BY_ROLE: Record<AppRole, NavItem[]> = {
  tenant: [
    { label: "Dashboard", path: "/tenant/dashboard", icon: LayoutDashboard },
    { label: "Save for Rent", path: "/tenant/save-for-rent", icon: PiggyBank },
    { label: "My Loans", path: "/tenant/loans", icon: CreditCard },
    { label: "Documents", path: "/tenant/documents", icon: FileText },
    { label: "Statements", path: "/tenant/statements", icon: BarChart2 },
    { label: "Messages", path: "/tenant/messages", icon: MessageSquare },
  ],
  landlord: [
    { label: "Dashboard", path: "/landlord/dashboard", icon: LayoutDashboard },
    { label: "My Properties", path: "/landlord/properties", icon: Building2 },
    { label: "Tenants", path: "/landlord/tenants", icon: Users },
    { label: "Payments", path: "/landlord/payments", icon: Banknote },
    { label: "Maintenance", path: "/landlord/maintenance", icon: Wrench },
    { label: "Financing", path: "/landlord/financing", icon: TrendingUp },
    { label: "Documents", path: "/landlord/documents", icon: FileText },
    { label: "Messages", path: "/landlord/messages", icon: MessageSquare },
  ],
  investor: [
    { label: "Dashboard", path: "/investor/dashboard", icon: LayoutDashboard },
    { label: "Opportunities", path: "/investor/opportunities", icon: Briefcase },
    { label: "My Deals", path: "/investor/deals", icon: TrendingUp },
    { label: "Documents", path: "/investor/documents", icon: FileText },
    { label: "Reports", path: "/investor/reports", icon: BarChart2 },
    { label: "Messages", path: "/investor/messages", icon: MessageSquare },
  ],
  professional: [
    { label: "Dashboard", path: "/professional/dashboard", icon: LayoutDashboard },
    { label: "My Referrals", path: "/professional/referrals", icon: Share2 },
    { label: "Commissions", path: "/professional/commissions", icon: DollarSign },
    { label: "Resources", path: "/professional/resources", icon: BookOpen },
    { label: "Events & Training", path: "/events", icon: Calendar },
    { label: "Messages", path: "/professional/messages", icon: MessageSquare },
  ],
  staff: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", path: "/admin/users", icon: Users },
  ],
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Applications", path: "/admin/applications", icon: FileText },
    { label: "Properties", path: "/admin/properties", icon: Building2 },
    { label: "System", path: "/admin/settings", icon: Shield },
  ],
};

const PORTAL_COLOR: Record<AppRole, string> = {
  tenant: "bg-navy",
  landlord: "bg-navy",
  investor: "bg-navy",
  professional: "bg-[#6B3FA0]",
  staff: "bg-[#1A1A2E]",
  admin: "bg-[#1A1A2E]",
};

interface PortalShellProps {
  role: AppRole;
  children: ReactNode;
}

const PortalShell = ({ role, children }: PortalShellProps) => {
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const items = NAV_BY_ROLE[role];
  const sidebarColor = PORTAL_COLOR[role];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const Sidebar = (
    <aside className={`${sidebarColor} text-white w-60 flex-shrink-0 flex flex-col`}>
      <div className="p-4 border-b border-white/10">
        <Link to="/" className="inline-flex items-center bg-background rounded-md px-3 py-1.5">
          <img src={logo} alt="Renteaze" className="h-7" />
        </Link>
        <p className="mt-3 text-sm font-medium truncate">{profile?.full_name || "Member"}</p>
        <span className="inline-block mt-1 text-[10px] uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded">
          {role}
        </span>
      </div>
      <nav className="flex-1 py-3">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                active ? "bg-white/15 border-l-4 border-accent" : "hover:bg-white/10"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 py-2">
        <Link
          to="/survey"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10"
        >
          <ClipboardList className="h-4 w-4" /> Profile Survey
        </Link>
        <Link
          to={`/${role === "admin" || role === "staff" ? "admin" : role}/settings`}
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10"
        >
          <SettingsIcon className="h-4 w-4" /> Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 text-left"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">{Sidebar}</div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50">{Sidebar}</div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 bg-card border-b flex items-center justify-between px-4 lg:px-6">
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="text-sm text-muted-foreground hidden md:block">
            {greeting()}, {profile?.first_name || "there"}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-muted" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </button>
            <UserMenu role={role} />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default PortalShell;
