import { Link } from "react-router-dom";
import { UserCheck, ArrowRight, CheckCircle2, Pencil } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const SurveyIncompleteBanner = () => {
  const { profile } = useAuth();
  if (!profile) return null;

  const p = profile as Record<string, unknown>;
  const contactMissing = p.preferred_contact_method == null || p.preferred_contact_method === "";

  if (profile.survey_completed && !contactMissing) {
    return (
      <div className="bg-primary/5 border border-primary/20 text-foreground rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
        <p className="flex-1 text-sm">
          <span className="font-semibold">Profile survey complete.</span>{" "}
          <span className="text-muted-foreground">You can review or update your responses any time.</span>
        </p>
        <Link
          to="/survey"
          className="inline-flex items-center gap-1.5 border border-primary/30 text-primary px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary/10 whitespace-nowrap"
        >
          <Pencil className="h-3.5 w-3.5" /> View / Edit Responses
        </Link>
      </div>
    );
  }

  if (profile.survey_completed && contactMissing) {
    return (
      <div className="bg-accent/15 border border-accent/40 text-foreground rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <UserCheck className="h-5 w-5 text-accent flex-shrink-0" />
        <p className="flex-1 text-sm">
          <span className="font-semibold">One quick question added</span> — tell us how you'd like to be contacted.
        </p>
        <Link
          to="/survey"
          className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 whitespace-nowrap"
        >
          Answer Now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-accent/15 border border-accent/40 text-foreground rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
      <UserCheck className="h-5 w-5 text-accent flex-shrink-0" />
      <p className="flex-1 text-sm">
        <span className="font-semibold">Complete your profile</span> — it takes 2 minutes and helps us personalise your experience.
      </p>
      <Link
        to="/survey"
        className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 whitespace-nowrap"
      >
        Complete Now <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default SurveyIncompleteBanner;
