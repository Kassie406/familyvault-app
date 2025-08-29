import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ChatSupport from "@/components/chat-support";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminLayout from "@/components/admin/admin-layout";
import Home from "@/pages/home";
import Security from "@/pages/security";
import SecurityDocumentation from "@/pages/security-documentation";
import TrustOverview from "@/pages/trust-overview";
import Reviews from "@/pages/reviews";
import Pricing from "@/pages/pricing";
import ScheduleDemo from "@/pages/schedule-demo";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import SignupOptions from "@/pages/signup-options";
import ChildInformation from "@/pages/child-information";
import DisasterPlanning from "@/pages/disaster-planning";
import ElderlyParents from "@/pages/elderly-parents";
import EstatePlanning from "@/pages/estate-planning";
import GettingMarried from "@/pages/getting-married";
import HomeBuying from "@/pages/home-buying";
import InternationalTravel from "@/pages/international-travel";
import StartingAFamily from "@/pages/starting-a-family";
import Moving from "@/pages/moving";
import WhenSomeoneDies from "@/pages/when-someone-dies";
import DigitalSecurity from "@/pages/digital-security";
import Neurodiversity from "@/pages/neurodiversity";
import Blogs from "@/pages/blogs";
import GuidesChecklists from "@/pages/guides-checklists";
import HelpCenter from "@/pages/help-center";
import MedicalAllergies from "@/pages/medical-allergies";
import SchoolAftercare from "@/pages/school-aftercare";
import SportsActivities from "@/pages/sports-activities";
import EmergencyContacts from "@/pages/emergency-contacts";
import Immunizations from "@/pages/immunizations";
import CaregiverAccess from "@/pages/caregiver-access";
import ElderlyMedicalInfo from "@/pages/elderly-medical-info";
import ElderlyFinances from "@/pages/elderly-finances";
import ElderlyEmergencyContacts from "@/pages/elderly-emergency-contacts";
import ElderlyLegalDocuments from "@/pages/elderly-legal-documents";
import ElderlyPropertyInfo from "@/pages/elderly-property-info";
import ElderlyCareTeamAccess from "@/pages/elderly-care-team-access";
import MarriedLegalDocs from "@/pages/married-legal-docs";
import MarriedFinancialPlanning from "@/pages/married-financial-planning";
import MarriedLivingArrangements from "@/pages/married-living-arrangements";
import MarriedFamilyInfo from "@/pages/married-family-info";
import MarriedWeddingPlanning from "@/pages/married-wedding-planning";
import MarriedEstatePlanning from "@/pages/married-estate-planning";
import DisasterEmergencyContacts from "@/pages/disaster-emergency-contacts";
import DisasterImportantDocuments from "@/pages/disaster-important-documents";
import DisasterMedicalInformation from "@/pages/disaster-medical-information";
import DisasterPropertyInformation from "@/pages/disaster-property-information";
import DisasterPetRecords from "@/pages/disaster-pet-records";
import DisasterEmergencyPlan from "@/pages/disaster-emergency-plan";
import EstateWillsTrusts from "@/pages/estate-wills-trusts";
import EstateHealthcareDirectives from "@/pages/estate-healthcare-directives";
import EstatePowerOfAttorney from "@/pages/estate-power-of-attorney";
import EstateBeneficiaryInformation from "@/pages/estate-beneficiary-information";
import EstateAssetDocumentation from "@/pages/estate-asset-documentation";
import EstateProfessionalContacts from "@/pages/estate-professional-contacts";
import HomeBuyingPreapprovalDocuments from "@/pages/home-buying-preapproval-documents";
import HomeBuyingBudgetAffordability from "@/pages/home-buying-budget-affordability";
import HomeBuyingPropertyResearch from "@/pages/home-buying-property-research";
import HomeBuyingInspectionRecords from "@/pages/home-buying-inspection-records";
import HomeBuyingClosingDocumentation from "@/pages/home-buying-closing-documentation";
import HomeBuyingProfessionalContacts from "@/pages/home-buying-professional-contacts";
import StartingFamilyPregnancyMedicalRecords from "@/pages/starting-family-pregnancy-medical-records";
import StartingFamilyBabyDocumentation from "@/pages/starting-family-baby-documentation";
import StartingFamilyChildcareInformation from "@/pages/starting-family-childcare-information";
import StartingFamilyGuardianshipPlanning from "@/pages/starting-family-guardianship-planning";
import StartingFamilyLegalDocuments from "@/pages/starting-family-legal-documents";
import StartingFamilyInsuranceBenefits from "@/pages/starting-family-insurance-benefits";
import WhenSomeoneDiesEstateDocumentation from "@/pages/when-someone-dies-estate-documentation";
import WhenSomeoneDiesFinancialAccounts from "@/pages/when-someone-dies-financial-accounts";
import WhenSomeoneDiesContactManagement from "@/pages/when-someone-dies-contact-management";
import WhenSomeoneDiesBillsObligations from "@/pages/when-someone-dies-bills-obligations";
import WhenSomeoneDiesLegalResponsibilities from "@/pages/when-someone-dies-legal-responsibilities";
import WhenSomeoneDiesImportantDeadlines from "@/pages/when-someone-dies-important-deadlines";

function AdminRouter() {
  return (
    <Switch>
      <Route path="/dashboard" component={AdminDashboard} />
      <Route path="/login" component={AdminLogin} />
      <Route path="/" component={AdminLogin} />
      <Route component={AdminLogin} />
    </Switch>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/security" component={Security} />
      <Route path="/security-documentation" component={SecurityDocumentation} />
      <Route path="/trust-overview" component={TrustOverview} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/schedule-demo" component={ScheduleDemo} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/signup-options" component={SignupOptions} />
      <Route path="/child-information" component={ChildInformation} />
      <Route path="/disaster-planning" component={DisasterPlanning} />
      <Route path="/elderly-parents" component={ElderlyParents} />
      <Route path="/estate-planning" component={EstatePlanning} />
      <Route path="/getting-married" component={GettingMarried} />
      <Route path="/home-buying" component={HomeBuying} />
      <Route path="/international-travel" component={InternationalTravel} />
      <Route path="/starting-a-family" component={StartingAFamily} />
      <Route path="/moving" component={Moving} />
      <Route path="/when-someone-dies" component={WhenSomeoneDies} />
      <Route path="/digital-security" component={DigitalSecurity} />
      <Route path="/neurodiversity" component={Neurodiversity} />
      <Route path="/blogs" component={Blogs} />
      <Route path="/guides-checklists" component={GuidesChecklists} />
      <Route path="/help-center" component={HelpCenter} />
      <Route path="/medical-allergies" component={MedicalAllergies} />
      <Route path="/school-aftercare" component={SchoolAftercare} />
      <Route path="/sports-activities" component={SportsActivities} />
      <Route path="/emergency-contacts" component={EmergencyContacts} />
      <Route path="/immunizations" component={Immunizations} />
      <Route path="/caregiver-access" component={CaregiverAccess} />
      <Route path="/elderly-medical-info" component={ElderlyMedicalInfo} />
      <Route path="/elderly-finances" component={ElderlyFinances} />
      <Route path="/elderly-emergency-contacts" component={ElderlyEmergencyContacts} />
      <Route path="/elderly-legal-documents" component={ElderlyLegalDocuments} />
      <Route path="/elderly-property-info" component={ElderlyPropertyInfo} />
      <Route path="/elderly-care-team-access" component={ElderlyCareTeamAccess} />
      <Route path="/married-legal-docs" component={MarriedLegalDocs} />
      <Route path="/married-financial-planning" component={MarriedFinancialPlanning} />
      <Route path="/married-living-arrangements" component={MarriedLivingArrangements} />
      <Route path="/married-family-info" component={MarriedFamilyInfo} />
      <Route path="/married-wedding-planning" component={MarriedWeddingPlanning} />
      <Route path="/married-estate-planning" component={MarriedEstatePlanning} />
      <Route path="/disaster-emergency-contacts" component={DisasterEmergencyContacts} />
      <Route path="/disaster-important-documents" component={DisasterImportantDocuments} />
      <Route path="/disaster-medical-information" component={DisasterMedicalInformation} />
      <Route path="/disaster-property-information" component={DisasterPropertyInformation} />
      <Route path="/disaster-pet-records" component={DisasterPetRecords} />
      <Route path="/disaster-emergency-plan" component={DisasterEmergencyPlan} />
      <Route path="/estate-wills-trusts" component={EstateWillsTrusts} />
      <Route path="/estate-healthcare-directives" component={EstateHealthcareDirectives} />
      <Route path="/estate-power-of-attorney" component={EstatePowerOfAttorney} />
      <Route path="/estate-beneficiary-information" component={EstateBeneficiaryInformation} />
      <Route path="/estate-asset-documentation" component={EstateAssetDocumentation} />
      <Route path="/estate-professional-contacts" component={EstateProfessionalContacts} />
      <Route path="/home-buying-preapproval-documents" component={HomeBuyingPreapprovalDocuments} />
      <Route path="/home-buying-budget-affordability" component={HomeBuyingBudgetAffordability} />
      <Route path="/home-buying-property-research" component={HomeBuyingPropertyResearch} />
      <Route path="/home-buying-inspection-records" component={HomeBuyingInspectionRecords} />
      <Route path="/home-buying-closing-documentation" component={HomeBuyingClosingDocumentation} />
      <Route path="/home-buying-professional-contacts" component={HomeBuyingProfessionalContacts} />
      <Route path="/starting-family-pregnancy-medical-records" component={StartingFamilyPregnancyMedicalRecords} />
      <Route path="/starting-family-baby-documentation" component={StartingFamilyBabyDocumentation} />
      <Route path="/starting-family-childcare-information" component={StartingFamilyChildcareInformation} />
      <Route path="/starting-family-guardianship-planning" component={StartingFamilyGuardianshipPlanning} />
      <Route path="/starting-family-legal-documents" component={StartingFamilyLegalDocuments} />
      <Route path="/starting-family-insurance-benefits" component={StartingFamilyInsuranceBenefits} />
      <Route path="/when-someone-dies-estate-documentation" component={WhenSomeoneDiesEstateDocumentation} />
      <Route path="/when-someone-dies-financial-accounts" component={WhenSomeoneDiesFinancialAccounts} />
      <Route path="/when-someone-dies-contact-management" component={WhenSomeoneDiesContactManagement} />
      <Route path="/when-someone-dies-bills-obligations" component={WhenSomeoneDiesBillsObligations} />
      <Route path="/when-someone-dies-legal-responsibilities" component={WhenSomeoneDiesLegalResponsibilities} />
      <Route path="/when-someone-dies-important-deadlines" component={WhenSomeoneDiesImportantDeadlines} />
      
      {/* Admin routes for easy access in development */}
      <Route path="/admin" nest>
        <AdminLayout>
          <Switch>
            <Route path="/" component={AdminDashboard} />
            <Route component={NotFound} />
          </Switch>
        </AdminLayout>
      </Route>
      <Route path="/admin/login" component={AdminLogin} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Check subdomain to determine interface type
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  
  const subdomain = hostname.split('.')[0];
  const isAdminDomain = subdomain === 'console' || 
                       hostname === 'console.familycirclesecure.com' || 
                       hostname.includes('console') ||
                       pathname.startsWith('/admin') ||
                       pathname.startsWith('/login') ||
                       pathname.startsWith('/dashboard');
  const isPortalDomain = subdomain === 'portal' || hostname === 'portal.familycirclesecure.com';
  const isHubDomain = subdomain === 'hub' || hostname === 'hub.familycirclesecure.com';
  
  // Admin Console Interface
  if (isAdminDomain) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <AdminRouter />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }
  
  // Portal Interface - Main Family Access
  if (isPortalDomain) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <div className="bg-blue-600 text-white text-center py-2 px-4">
            <p className="text-sm font-medium">
              🌐 Family Portal - Welcome to FamilyCircle Secure
            </p>
          </div>
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }
  
  // Hub Interface - Professional Workspace (Future Use)
  if (isHubDomain) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <div className="bg-green-600 text-white text-center py-2 px-4">
            <p className="text-sm font-medium">
              🏢 Professional Hub - FamilyCircle Secure Workspace
            </p>
          </div>
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Main Website (familycirclesecure.com)
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <ChatSupport />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
