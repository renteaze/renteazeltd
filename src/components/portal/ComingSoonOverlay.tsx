import { ReactNode } from "react";
import { Construction } from "lucide-react";

interface ComingSoonOverlayProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const ComingSoonOverlay = ({
  children,
  title = "Coming Soon",
  description = "We're putting the finishing touches on this feature. Check back shortly.",
}: ComingSoonOverlayProps) => {
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none select-none opacity-60 blur-[1px]">
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex items-start justify-center pt-16 md:pt-24 bg-background/70 backdrop-blur-sm">
        <div className="pointer-events-auto max-w-md mx-4 bg-card border rounded-xl shadow-lg p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-accent/15 text-accent flex items-center justify-center">
            <Construction className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonOverlay;
