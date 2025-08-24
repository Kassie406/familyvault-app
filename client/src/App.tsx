import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Security from "@/pages/security";
import Reviews from "@/pages/reviews";
import Pricing from "@/pages/pricing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/security" component={Security} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
