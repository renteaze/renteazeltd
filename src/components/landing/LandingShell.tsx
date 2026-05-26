import { ReactNode } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/renteaze-logo-white.png";

const LandingShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-background">
    <header className="border-b py-4">
      <div className="container mx-auto px-4 lg:px-8">
        <Link to="/" className="inline-flex items-center bg-navy rounded-md px-3 py-1.5 shadow-sm">
          <img src={logo} alt="Renteaze" className="h-8" />
        </Link>
      </div>
    </header>
    <main className="flex-1">{children}</main>
    <footer className="border-t py-6">
      <div className="container mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Renteaze · RC 1768094</p>
        <div className="flex gap-4">
          <Link to="/contact" className="hover:text-primary">Contact</Link>
          <a href="#" className="hover:text-primary">Privacy Policy</a>
        </div>
      </div>
    </footer>
  </div>
);

export default LandingShell;
