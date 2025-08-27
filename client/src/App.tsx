import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ChatSupport from "@/components/chat-support";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Security from "@/pages/security";
import SecurityDocumentation from "@/pages/security-documentation";
import TrustOverview from "@/pages/trust-overview";
import Reviews from "@/pages/reviews";
import Pricing from "@/pages/pricing";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/security" component={Security} />
      <Route path="/security-documentation" component={SecurityDocumentation} />
      <Route path="/trust-overview" component={TrustOverview} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/pricing" component={Pricing} />
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
