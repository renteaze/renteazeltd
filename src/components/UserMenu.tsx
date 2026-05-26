import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings as SettingsIcon, LogOut, ChevronDown, ClipboardList } from "lucide-react";
import { useAuth, type AppRole } from "@/hooks/useAuth";

interface UserMenuProps {
  role?: AppRole;
}

const UserMenu = ({ role = "tenant" }: UserMenuProps) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    navigate("/");
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors group"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
          {(profile?.first_name?.[0] || "U").toUpperCase()}
        </div>
        <span className="hidden md:inline text-sm font-medium max-w-[120px] truncate">
          {profile?.first_name || "Member"}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors hidden md:inline" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card border rounded-lg shadow-lg z-50">
          {/* Header with user info */}
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-semibold truncate">{profile?.full_name || "Member"}</p>
            <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <button
              onClick={() => handleNavigation(`/${role === "admin" || role === "staff" ? "admin" : role}/profile`)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors text-left"
            >
              <User className="h-4 w-4" />
              My Profile
            </button>
            <button
              onClick={() => handleNavigation("/survey")}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors text-left"
            >
              <ClipboardList className="h-4 w-4" />
              Survey
            </button>
            <button
              onClick={() => handleNavigation(`/${role === "admin" || role === "staff" ? "admin" : role}/settings`)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors text-left"
            >
              <SettingsIcon className="h-4 w-4" />
              Settings
            </button>
          </div>

          {/* Sign out */}
          <div className="border-t py-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors text-left text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
