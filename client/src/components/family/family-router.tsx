import { Switch, Route } from 'wouter';
import SidebarLayout from './sidebar-layout';
import FamilyHome from '@/pages/family/family-home';
import FamilyIds from '@/pages/family/family-ids';
import FamilyMemberDetail from '@/pages/family/family-member-detail';
import Finance from '@/pages/family/finance';
import Property from '@/pages/family/property';
import FamilyPasswords from '@/pages/family/family-passwords';
import ManagerDetailPage from '@/pages/family/password-manager-detail';
import FamilyInsurance from '@/pages/family/family-insurance';
import InsuranceDetail from '@/pages/family/insurance-detail';
import FamilyTaxes from '@/pages/family/family-taxes';
import TaxYearDetail from '@/pages/family/tax-year-detail';
import FamilyLegal from '@/pages/family/family-legal';
import LegalDetail from '@/pages/family/legal-detail';
import FamilyBusiness from '@/pages/family/family-business';
import BusinessDetail from '@/pages/family/business-detail';
import FamilyResources from '@/pages/family/family-resources';
import FamilyContacts from '@/pages/family/family-contacts';
import ChildInformation from '@/pages/family/child-information';
import ElderlyParents from '@/pages/family/elderly-parents';
import GettingMarried from '@/pages/family/getting-married';
import InternationalTravel from '@/pages/family/international-travel';
import Moving from '@/pages/family/moving';
import DisasterPlanning from '@/pages/family/disaster-planning';
import EstatePlanning from '@/pages/family/estate-planning';
import HomeBuying from '@/pages/family/home-buying';
import StartingFamily from '@/pages/family/starting-family';
import WhenSomeoneDies from '@/pages/family/when-someone-dies';
import InboxPanel from './inbox-panel';
import RemindersPanel from './reminders-panel';

// Placeholder components for family portal pages
function FamilyMembers() {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Family Members</h1>
      <p className="text-gray-600">Manage family member profiles and information.</p>
    </div>
  );
}

function FamilyDocuments() {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Family Documents</h1>
      <p className="text-gray-600">Secure document storage and sharing for your family.</p>
    </div>
  );
}

function FamilyMessages() {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Family Chat</h1>
      <p className="text-gray-600">Private family communication and messaging.</p>
    </div>
  );
}

function FamilyCalendar() {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Family Calendar</h1>
      <p className="text-gray-600">Shared family schedule and event planning.</p>
    </div>
  );
}

function FamilyPhotos() {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Photo Gallery</h1>
      <p className="text-gray-600">Share and view family photos and memories.</p>
    </div>
  );
}

function FamilyEmergency() {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Emergency Information</h1>
      <p className="text-gray-600">Critical family information and emergency contacts.</p>
    </div>
  );
}

function FamilySettings() {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Family Settings</h1>
      <p className="text-gray-600">Configure family portal preferences and security settings.</p>
    </div>
  );
}

// Layout wrapper for family pages
function withSidebarLayout(Component: () => JSX.Element) {
  return function WrappedComponent() {
    return (
      <SidebarLayout>
        <Component />
      </SidebarLayout>
    );
  };
}

export default function FamilyRouter() {
  return (
    <>
      {/* Main Family Routes */}
      <Switch>
        <Route path="/" component={withSidebarLayout(FamilyHome)} />
        <Route path="/family" component={withSidebarLayout(FamilyHome)} />
        <Route path="/family/ids" component={withSidebarLayout(() => <FamilyIds />)} />
        <Route path="/family/ids/:memberId" component={withSidebarLayout(() => <FamilyMemberDetail />)} />
        <Route path="/family/finance" component={withSidebarLayout(() => <Finance />)} />
        <Route path="/family/property" component={withSidebarLayout(() => <Property />)} />
        <Route path="/family/passwords" component={withSidebarLayout(() => <FamilyPasswords />)} />
        <Route path="/family/passwords/manager/:managerId" component={withSidebarLayout(() => <ManagerDetailPage />)} />
        <Route path="/family/passwords/:id" component={withSidebarLayout(() => <FamilyPasswords />)} />
        <Route path="/family/insurance" component={withSidebarLayout(() => <FamilyInsurance />)} />
        <Route path="/family/insurance/:id" component={withSidebarLayout(() => <InsuranceDetail />)} />
        <Route path="/family/taxes" component={withSidebarLayout(() => <FamilyTaxes />)} />
        <Route path="/family/taxes/:year" component={withSidebarLayout(() => <TaxYearDetail />)} />
        <Route path="/family/legal" component={withSidebarLayout(() => <FamilyLegal />)} />
        <Route path="/family/legal/:id" component={withSidebarLayout(() => <LegalDetail />)} />
        <Route path="/family/business" component={withSidebarLayout(() => <FamilyBusiness />)} />
        <Route path="/family/business/:id" component={withSidebarLayout(() => <BusinessDetail />)} />
        <Route path="/family/resources" component={withSidebarLayout(() => <FamilyResources />)} />
        <Route path="/family/contacts" component={withSidebarLayout(() => <FamilyContacts />)} />
        <Route path="/family/child-information" component={withSidebarLayout(() => <ChildInformation />)} />
        <Route path="/family/elderly-parents" component={withSidebarLayout(() => <ElderlyParents />)} />
        <Route path="/family/getting-married" component={withSidebarLayout(() => <GettingMarried />)} />
        <Route path="/family/international-travel" component={withSidebarLayout(() => <InternationalTravel />)} />
        <Route path="/family/moving" component={withSidebarLayout(() => <Moving />)} />
        <Route path="/family/disaster-planning" component={withSidebarLayout(() => <DisasterPlanning />)} />
        <Route path="/family/estate-planning" component={withSidebarLayout(() => <EstatePlanning />)} />
        <Route path="/family/home-buying" component={withSidebarLayout(() => <HomeBuying />)} />
        <Route path="/family/starting-family" component={withSidebarLayout(() => <StartingFamily />)} />
        <Route path="/family/when-someone-dies" component={withSidebarLayout(() => <WhenSomeoneDies />)} />
        <Route path="/family/members" component={withSidebarLayout(FamilyMembers)} />
        <Route path="/family/documents" component={withSidebarLayout(FamilyDocuments)} />
        <Route path="/family/messages" component={withSidebarLayout(FamilyMessages)} />
        <Route path="/family/calendar" component={withSidebarLayout(FamilyCalendar)} />
        <Route path="/family/photos" component={withSidebarLayout(FamilyPhotos)} />
        <Route path="/family/emergency" component={withSidebarLayout(FamilyEmergency)} />
        <Route path="/family/settings" component={withSidebarLayout(FamilySettings)} />
        <Route component={withSidebarLayout(FamilyHome)} />
      </Switch>
      
      {/* Slide-over Panels - rendered above all routes */}
      <InboxPanel />
      <RemindersPanel />
    </>
  );
}