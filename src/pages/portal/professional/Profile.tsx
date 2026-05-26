import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PortalShell from "@/components/portal/PortalShell";
import ProfileEditForm from "@/components/ProfileEditForm";
import SurveyIncompleteBanner from "@/components/portal/SurveyIncompleteBanner";

const ProfessionalProfile = () => (
  <PortalShell role="professional">
    <div className="max-w-2xl">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">View and edit your personal information</p>
        </div>
        <Link
          to="/survey"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90 transition"
        >
          Continue Survey <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <SurveyIncompleteBanner />
      <ProfileEditForm />
    </div>
  </PortalShell>
);

export default ProfessionalProfile;
