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
      <div className="container mx-auto px-4 lg:px-8 space-y-3 text-xs text-muted-foreground">
        <p className="leading-relaxed">
          Renteaze is a PropTech platform — not a bank or licensed financial institution. Financial products (savings, loans, payments, investments) are offered by our licensed partners regulated by the CBN and SEC.{" "}
          <Link to="/legal/disclaimer" className="underline hover:text-primary">Read full disclaimer</Link>.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t">
          <p>&copy; {new Date().getFullYear()} Renteaze® · Renteaze International Limited · RC 1768094</p>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-primary">Contact</Link>
            <Link to="/legal/privacy" className="hover:text-primary">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

export default LandingShell;
