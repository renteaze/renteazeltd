import { ReactNode } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/renteaze-logo-white.png";

interface AuthShellProps {
  step?: { current: number; total: number };
  children: ReactNode;
}

const AuthShell = ({ step, children }: AuthShellProps) => (
  <div className="min-h-screen bg-muted/30 flex flex-col">
    <header className="px-4 lg:px-8 py-4 bg-navy">
      <Link to="/" className="inline-flex items-center bg-background rounded-md px-3 py-1.5">
        <img src={logo} alt="Renteaze" className="h-8" />
      </Link>
    </header>
    <main className="flex-1 flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        {step && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Step {step.current} of {step.total}</span>
              <span>{Math.round((step.current / step.total) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(step.current / step.total) * 100}%` }}
              />
            </div>
          </div>
        )}
        {children}
      </div>
    </main>
    <footer className="text-center py-4 text-xs text-muted-foreground">
      &copy; {new Date().getFullYear()} Renteaze International Ltd | RC 1768094
    </footer>
  </div>
);

export default AuthShell;
