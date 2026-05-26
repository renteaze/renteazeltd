import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import ForTenants from "./pages/ForTenants";
import ForLandlords from "./pages/ForLandlords";
import ForInvestors from "./pages/ForInvestors";
import ForProfessionals from "./pages/ForProfessionals";

import About from "./pages/About";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

import SaveForRentLP from "./pages/landing/SaveForRentLP";
import LoanForRentLP from "./pages/landing/LoanForRentLP";
import LandlordManagementLP from "./pages/landing/LandlordManagementLP";
import DiasporaInvestorLP from "./pages/landing/DiasporaInvestorLP";
import PartnerLP from "./pages/landing/PartnerLP";

import SignUpRole from "./pages/auth/SignUpRole";
import SignUpDetails from "./pages/auth/SignUpDetails";
import VerifyPhone from "./pages/auth/VerifyPhone";
import Survey from "./pages/auth/Survey";
import SignIn from "./pages/auth/SignIn";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import RequireAuth from "./components/auth/RequireAuth";
import TenantDashboard from "./pages/portal/TenantDashboard";
import LandlordDashboard from "./pages/portal/LandlordDashboard";
import InvestorDashboard from "./pages/portal/InvestorDashboard";
import ProfessionalDashboard from "./pages/portal/ProfessionalDashboard";
import AdminDashboard from "./pages/portal/AdminDashboard";

import TenantSaveForRent from "./pages/portal/tenant/SaveForRent";
import TenantLoans from "./pages/portal/tenant/Loans";
import TenantApplyLoan from "./pages/portal/tenant/ApplyLoan";
import TenantLoanDetail from "./pages/portal/tenant/LoanDetail";
import TenantDocuments from "./pages/portal/tenant/Documents";
import TenantStatements from "./pages/portal/tenant/Statements";
import TenantMessages from "./pages/portal/tenant/Messages";
import TenantSettings from "./pages/portal/tenant/Settings";
import TenantProfile from "./pages/portal/tenant/Profile";

import LandlordProperties from "./pages/portal/landlord/Properties";
import LandlordTenants from "./pages/portal/landlord/Tenants";
import LandlordPayments from "./pages/portal/landlord/Payments";
import LandlordMaintenance from "./pages/portal/landlord/Maintenance";
import LandlordFinancing from "./pages/portal/landlord/Financing";
import LandlordDocuments from "./pages/portal/landlord/Documents";
import LandlordMessages from "./pages/portal/landlord/Messages";
import LandlordSettings from "./pages/portal/landlord/Settings";
import LandlordProfile from "./pages/portal/landlord/Profile";
import LandlordAddProperty from "./pages/portal/landlord/AddProperty";
import LandlordPropertyDetail from "./pages/portal/landlord/PropertyDetail";

import InvestorOpportunities from "./pages/portal/investor/Opportunities";
import InvestorDeals from "./pages/portal/investor/Deals";
import InvestorDocuments from "./pages/portal/investor/Documents";
import InvestorReports from "./pages/portal/investor/Reports";
import InvestorMessages from "./pages/portal/investor/Messages";
import InvestorSettings from "./pages/portal/investor/Settings";
import InvestorProfile from "./pages/portal/investor/Profile";

import ProfessionalReferrals from "./pages/portal/professional/Referrals";
import ProfessionalCommissions from "./pages/portal/professional/Commissions";
import ProfessionalResources from "./pages/portal/professional/Resources";
import ProfessionalMessages from "./pages/portal/professional/Messages";
import ProfessionalSettings from "./pages/portal/professional/Settings";
import ProfessionalProfile from "./pages/portal/professional/Profile";

import AdminUsers from "./pages/portal/admin/Users";
import AdminApplications from "./pages/portal/admin/Applications";
import AdminProperties from "./pages/portal/admin/Properties";
import AdminSettings from "./pages/portal/admin/Settings";
import AdminProfile from "./pages/portal/admin/Profile";
import PortalSurvey from "./pages/portal/PortalSurvey";

import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import CookiesPage from "./pages/legal/Cookies";
import AmlKyc from "./pages/legal/AmlKyc";
import Disclaimer from "./pages/legal/Disclaimer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/for-tenants" element={<ForTenants />} />
          <Route path="/for-landlords" element={<ForLandlords />} />
          <Route path="/for-investors" element={<ForInvestors />} />
          <Route path="/professionals" element={<ForProfessionals />} />

          <Route path="/about" element={<About />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Auth flow */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUpRole />} />
          <Route path="/signup/details" element={<SignUpDetails />} />
          <Route path="/signup/verify-phone" element={<VerifyPhone />} />
          <Route path="/signup/survey" element={<RequireAuth><Survey /></RequireAuth>} />
          <Route path="/survey" element={<RequireAuth><PortalSurvey /></RequireAuth>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Portals */}
          <Route path="/tenant/dashboard" element={<RequireAuth roles={["tenant"]}><TenantDashboard /></RequireAuth>} />
          <Route path="/landlord/dashboard" element={<RequireAuth roles={["landlord"]}><LandlordDashboard /></RequireAuth>} />
          <Route path="/investor/dashboard" element={<RequireAuth roles={["investor"]}><InvestorDashboard /></RequireAuth>} />
          <Route path="/professional/dashboard" element={<RequireAuth roles={["professional"]}><ProfessionalDashboard /></RequireAuth>} />
          <Route path="/admin/dashboard" element={<RequireAuth roles={["admin", "staff"]}><AdminDashboard /></RequireAuth>} />

          {/* Profile pages */}
          <Route path="/tenant/profile" element={<RequireAuth roles={["tenant"]}><TenantProfile /></RequireAuth>} />
          <Route path="/landlord/profile" element={<RequireAuth roles={["landlord"]}><LandlordProfile /></RequireAuth>} />
          <Route path="/investor/profile" element={<RequireAuth roles={["investor"]}><InvestorProfile /></RequireAuth>} />
          <Route path="/professional/profile" element={<RequireAuth roles={["professional"]}><ProfessionalProfile /></RequireAuth>} />
          <Route path="/admin/profile" element={<RequireAuth roles={["admin", "staff"]}><AdminProfile /></RequireAuth>} />

          {/* Tenant sub-pages */}
          <Route path="/tenant/save-for-rent" element={<RequireAuth roles={["tenant"]}><TenantSaveForRent /></RequireAuth>} />
          <Route path="/tenant/loans" element={<RequireAuth roles={["tenant"]}><TenantLoans /></RequireAuth>} />
          <Route path="/tenant/loans/apply" element={<RequireAuth roles={["tenant"]}><TenantApplyLoan /></RequireAuth>} />
          <Route path="/tenant/loans/:id" element={<RequireAuth roles={["tenant"]}><TenantLoanDetail /></RequireAuth>} />
          <Route path="/tenant/documents" element={<RequireAuth roles={["tenant"]}><TenantDocuments /></RequireAuth>} />
          <Route path="/tenant/statements" element={<RequireAuth roles={["tenant"]}><TenantStatements /></RequireAuth>} />
          <Route path="/tenant/messages" element={<RequireAuth roles={["tenant"]}><TenantMessages /></RequireAuth>} />
          <Route path="/tenant/settings" element={<RequireAuth roles={["tenant"]}><TenantSettings /></RequireAuth>} />

          {/* Landlord sub-pages */}
          <Route path="/landlord/properties" element={<RequireAuth roles={["landlord"]}><LandlordProperties /></RequireAuth>} />
          <Route path="/landlord/properties/add" element={<RequireAuth roles={["landlord"]}><LandlordAddProperty /></RequireAuth>} />
          <Route path="/landlord/properties/:id" element={<RequireAuth roles={["landlord"]}><LandlordPropertyDetail /></RequireAuth>} />
          <Route path="/landlord/tenants" element={<RequireAuth roles={["landlord"]}><LandlordTenants /></RequireAuth>} />
          <Route path="/landlord/payments" element={<RequireAuth roles={["landlord"]}><LandlordPayments /></RequireAuth>} />
          <Route path="/landlord/maintenance" element={<RequireAuth roles={["landlord"]}><LandlordMaintenance /></RequireAuth>} />
          <Route path="/landlord/financing" element={<RequireAuth roles={["landlord"]}><LandlordFinancing /></RequireAuth>} />
          <Route path="/landlord/documents" element={<RequireAuth roles={["landlord"]}><LandlordDocuments /></RequireAuth>} />
          <Route path="/landlord/messages" element={<RequireAuth roles={["landlord"]}><LandlordMessages /></RequireAuth>} />
          <Route path="/landlord/settings" element={<RequireAuth roles={["landlord"]}><LandlordSettings /></RequireAuth>} />

          {/* Investor sub-pages */}
          <Route path="/investor/opportunities" element={<RequireAuth roles={["investor"]}><InvestorOpportunities /></RequireAuth>} />
          <Route path="/investor/deals" element={<RequireAuth roles={["investor"]}><InvestorDeals /></RequireAuth>} />
          <Route path="/investor/documents" element={<RequireAuth roles={["investor"]}><InvestorDocuments /></RequireAuth>} />
          <Route path="/investor/reports" element={<RequireAuth roles={["investor"]}><InvestorReports /></RequireAuth>} />
          <Route path="/investor/messages" element={<RequireAuth roles={["investor"]}><InvestorMessages /></RequireAuth>} />
          <Route path="/investor/settings" element={<RequireAuth roles={["investor"]}><InvestorSettings /></RequireAuth>} />

          {/* Professional sub-pages */}
          <Route path="/professional/referrals" element={<RequireAuth roles={["professional"]}><ProfessionalReferrals /></RequireAuth>} />
          <Route path="/professional/commissions" element={<RequireAuth roles={["professional"]}><ProfessionalCommissions /></RequireAuth>} />
          <Route path="/professional/resources" element={<RequireAuth roles={["professional"]}><ProfessionalResources /></RequireAuth>} />
          <Route path="/professional/messages" element={<RequireAuth roles={["professional"]}><ProfessionalMessages /></RequireAuth>} />
          <Route path="/professional/settings" element={<RequireAuth roles={["professional"]}><ProfessionalSettings /></RequireAuth>} />

          {/* Admin sub-pages */}
          <Route path="/admin/users" element={<RequireAuth roles={["admin", "staff"]}><AdminUsers /></RequireAuth>} />
          <Route path="/admin/applications" element={<RequireAuth roles={["admin", "staff"]}><AdminApplications /></RequireAuth>} />
          <Route path="/admin/properties" element={<RequireAuth roles={["admin", "staff"]}><AdminProperties /></RequireAuth>} />
          <Route path="/admin/settings" element={<RequireAuth roles={["admin"]}><AdminSettings /></RequireAuth>} />

          {/* Paid-ad landing pages */}
          <Route path="/lp/save-for-rent" element={<SaveForRentLP />} />
          <Route path="/lp/loan-for-rent" element={<LoanForRentLP />} />
          <Route path="/lp/landlord-management" element={<LandlordManagementLP />} />
          <Route path="/lp/diaspora-investor" element={<DiasporaInvestorLP />} />
          <Route path="/lp/partner" element={<PartnerLP />} />

          {/* Legal */}
          <Route path="/legal/terms" element={<Terms />} />
          <Route path="/legal/privacy" element={<Privacy />} />
          <Route path="/legal/cookies" element={<CookiesPage />} />
          <Route path="/legal/aml-kyc" element={<AmlKyc />} />
          <Route path="/legal/disclaimer" element={<Disclaimer />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
