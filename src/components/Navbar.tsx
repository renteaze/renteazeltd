import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import logo from "@/assets/renteaze-logo-white.png";

const navLinks = [
  { label: "Home", path: "/" },
  {
    label: "Solutions",
    children: [
      { label: "For Tenants", path: "/for-tenants" },
      { label: "For Landlords", path: "/for-landlords" },
      { label: "For Investors", path: "/for-investors" },
      { label: "For Professionals", path: "/professionals" },
    ],
  },
  { label: "Properties", path: "/properties" },
  { label: "Events", path: "/events" },
  { label: "About", path: "/about" },
  { label: "Blog", path: "/blog" },
  { label: "FAQ", path: "/faq" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy text-navy-foreground">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex items-center bg-background rounded-md px-3 py-1.5 ring-1 ring-foreground/5 shadow-sm">
            <img src={logo} alt="Renteaze" className="h-9" />
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/20 transition-colors">
                  {item.label}
                  <ChevronDown className="h-3 w-3" />
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-card text-card-foreground rounded-lg shadow-lg border py-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block px-4 py-2 text-sm hover:bg-muted transition-colors ${
                          isActive(child.path) ? "text-primary font-semibold" : ""
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path!}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path!) ? "bg-primary/20 text-accent" : "hover:bg-primary/20"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
          <Link
            to="/signin"
            className="ml-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/20 transition-colors inline-flex items-center gap-1.5"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
          <Link
            to="/signup"
            className="ml-1 px-4 py-2 bg-accent text-accent-foreground text-sm font-semibold rounded-md hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy border-t border-primary/20 pb-4">
          {navLinks.map((item) =>
            item.children ? (
              <div key={item.label} className="px-4">
                <p className="py-2 text-xs uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                {item.children.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 pl-4 text-sm hover:text-accent transition-colors"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path!}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
          <div className="px-4 pt-2 space-y-2">
            <Link
              to="/signin"
              onClick={() => setMobileOpen(false)}
              className="block text-center px-4 py-2 border border-primary/30 text-sm font-semibold rounded-md hover:bg-primary/20 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileOpen(false)}
              className="block text-center px-4 py-2 bg-accent text-accent-foreground text-sm font-semibold rounded-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
