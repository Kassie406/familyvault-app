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
import ResourceDetail from '@/pages/family/resource-detail';
import FamilyContacts from '@/pages/family/family-contacts';
import ChildInformation from '@/pages/family/child-information';
import ChildSectionPage from '@/pages/family/child-section';
import ElderlyParents from '@/pages/family/elderly-parents';
import ElderlySectionPage from '@/pages/family/elderly-section';
import GettingMarried from '@/pages/family/getting-married';
import WeddingSectionPage from '@/pages/family/wedding-section';
import InternationalTravel from '@/pages/family/international-travel';
import TravelSectionPage from '@/pages/family/travel-section';
import Moving from '@/pages/family/moving';
import MovingSectionPage from '@/pages/family/moving-section';
import DisasterPlanning from '@/pages/family/disaster-planning';
import DisasterSectionPage from '@/pages/family/disaster-section';
import EstatePlanning from '@/pages/family/estate-planning';
import EstateSectionPage from '@/pages/family/estate-section';
import HomeBuying from '@/pages/family/home-buying';
import HomeBuyingSectionPage from '@/pages/family/home-buying-section';
import StartingFamily from '@/pages/family/starting-family';
import FamilySectionPage from '@/pages/family/family-section';
import WhenSomeoneDies from '@/pages/family/when-someone-dies';
import BereavementSectionPage from '@/pages/family/bereavement-section';
import ContactSectionPage from '@/pages/family/contact-section';
import InboxPanel from './inbox-panel';
import RemindersPanel from './reminders-panel';
import FamilySettings from '@/pages/family/family-settings';
import ApiManagement from '@/pages/family/api-management';
import ApprovalsPage from '@/pages/family/approvals';
import FloatingChatWidget from '@/components/FloatingChatWidget';
import CalendarPage from '@/pages/family/calendar';
import MessagesPage from '@/pages/messages';

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

// FamilyCalendar is now imported from the dedicated calendar page

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
        <Route path="/family/resources/:id" component={withSidebarLayout(() => <ResourceDetail />)} />
        <Route path="/family/contacts" component={withSidebarLayout(() => <FamilyContacts />)} />
        <Route path="/family/contacts/family" component={withSidebarLayout(() => <ContactSectionPage title="Family Members" createTo="/family/contacts/new/family" />)} />
        <Route path="/family/contacts/emergency" component={withSidebarLayout(() => <ContactSectionPage title="Emergency Contacts" createTo="/family/contacts/new/emergency" />)} />
        <Route path="/family/contacts/medical" component={withSidebarLayout(() => <ContactSectionPage title="Medical Contacts" createTo="/family/contacts/new/medical" />)} />
        <Route path="/family/contacts/professional" component={withSidebarLayout(() => <ContactSectionPage title="Professional Services" createTo="/family/contacts/new/professional" />)} />
        <Route path="/family/contacts/friends" component={withSidebarLayout(() => <ContactSectionPage title="Friends & Social" createTo="/family/contacts/new/friend" />)} />
        <Route path="/family/contacts/services" component={withSidebarLayout(() => <ContactSectionPage title="Service Providers" createTo="/family/contacts/new/service" />)} />
        <Route path="/family/child-information" component={withSidebarLayout(() => <ChildInformation />)} />
        <Route path="/family/child/birth" component={withSidebarLayout(() => <ChildSectionPage title="Birth Certificates" createTo="/family/child/new/birth" />)} />
        <Route path="/family/child/medical" component={withSidebarLayout(() => <ChildSectionPage title="Medical Records" createTo="/family/child/new/medical" />)} />
        <Route path="/family/child/school" component={withSidebarLayout(() => <ChildSectionPage title="School Records" createTo="/family/child/new/school" />)} />
        <Route path="/family/child/contacts" component={withSidebarLayout(() => <ChildSectionPage title="Emergency Contacts" createTo="/family/child/new/contact" />)} />
        <Route path="/family/child/activities" component={withSidebarLayout(() => <ChildSectionPage title="Sports & Activities" createTo="/family/child/new/activity" />)} />
        <Route path="/family/child/immunizations" component={withSidebarLayout(() => <ChildSectionPage title="Immunizations" createTo="/family/child/new/immunization" />)} />
        <Route path="/family/elderly-parents" component={withSidebarLayout(() => <ElderlyParents />)} />
        <Route path="/family/elderly/medical" component={withSidebarLayout(() => <ElderlySectionPage title="Medical Information" createTo="/family/elderly/new/medical" />)} />
        <Route path="/family/elderly/legal" component={withSidebarLayout(() => <ElderlySectionPage title="Legal Documents" createTo="/family/elderly/new/legal" />)} />
        <Route path="/family/elderly/providers" component={withSidebarLayout(() => <ElderlySectionPage title="Care Providers" createTo="/family/elderly/new/provider" />)} />
        <Route path="/family/elderly/dailycare" component={withSidebarLayout(() => <ElderlySectionPage title="Daily Care Plans" createTo="/family/elderly/new/schedule" />)} />
        <Route path="/family/elderly/emergency" component={withSidebarLayout(() => <ElderlySectionPage title="Emergency Contacts" createTo="/family/elderly/new/emergency" />)} />
        <Route path="/family/elderly/finances" component={withSidebarLayout(() => <ElderlySectionPage title="Financial Information" createTo="/family/elderly/new/financial" />)} />
        <Route path="/family/getting-married" component={withSidebarLayout(() => <GettingMarried />)} />
        <Route path="/family/wedding/planning" component={withSidebarLayout(() => <WeddingSectionPage title="Wedding Planning" createTo="/family/wedding/new/planning" />)} />
        <Route path="/family/wedding/legal" component={withSidebarLayout(() => <WeddingSectionPage title="Legal Documents" createTo="/family/wedding/new/legal" />)} />
        <Route path="/family/wedding/financial" component={withSidebarLayout(() => <WeddingSectionPage title="Financial Planning" createTo="/family/wedding/new/budget" />)} />
        <Route path="/family/wedding/guests" component={withSidebarLayout(() => <WeddingSectionPage title="Guest Management" createTo="/family/wedding/new/guest" />)} />
        <Route path="/family/wedding/timeline" component={withSidebarLayout(() => <WeddingSectionPage title="Timeline & Schedule" createTo="/family/wedding/new/timeline" />)} />
        <Route path="/family/wedding/vendors" component={withSidebarLayout(() => <WeddingSectionPage title="Vendor Management" createTo="/family/wedding/new/vendor" />)} />
        <Route path="/family/international-travel" component={withSidebarLayout(() => <InternationalTravel />)} />
        <Route path="/family/travel/documents" component={withSidebarLayout(() => <TravelSectionPage title="Travel Documents" createTo="/family/travel/new/document" />)} />
        <Route path="/family/travel/itinerary" component={withSidebarLayout(() => <TravelSectionPage title="Itinerary Planning" createTo="/family/travel/new/itinerary" />)} />
        <Route path="/family/travel/emergency" component={withSidebarLayout(() => <TravelSectionPage title="Emergency Information" createTo="/family/travel/new/emergency" />)} />
        <Route path="/family/travel/destination" component={withSidebarLayout(() => <TravelSectionPage title="Destination Info" createTo="/family/travel/new/destination" />)} />
        <Route path="/family/travel/finances" component={withSidebarLayout(() => <TravelSectionPage title="Travel Finances" createTo="/family/travel/new/expense" />)} />
        <Route path="/family/travel/health" component={withSidebarLayout(() => <TravelSectionPage title="Health & Safety" createTo="/family/travel/new/health" />)} />
        <Route path="/family/moving" component={withSidebarLayout(() => <Moving />)} />
        <Route path="/family/moving/checklist" component={withSidebarLayout(() => <MovingSectionPage title="Moving Checklist" createTo="/family/moving/new/task" />)} />
        <Route path="/family/moving/companies" component={withSidebarLayout(() => <MovingSectionPage title="Moving Companies" createTo="/family/moving/new/company" />)} />
        <Route path="/family/moving/addresses" component={withSidebarLayout(() => <MovingSectionPage title="Address Changes" createTo="/family/moving/new/address" />)} />
        <Route path="/family/moving/documents" component={withSidebarLayout(() => <MovingSectionPage title="Important Documents" createTo="/family/moving/new/document" />)} />
        <Route path="/family/moving/finances" component={withSidebarLayout(() => <MovingSectionPage title="Moving Finances" createTo="/family/moving/new/expense" />)} />
        <Route path="/family/moving/inventory" component={withSidebarLayout(() => <MovingSectionPage title="Inventory & Packing" createTo="/family/moving/new/item" />)} />
        <Route path="/family/disaster-planning" component={withSidebarLayout(() => <DisasterPlanning />)} />
        <Route path="/family/disaster/contacts" component={withSidebarLayout(() => <DisasterSectionPage title="Emergency Contacts" createTo="/family/disaster/new/contact" />)} />
        <Route path="/family/disaster/evacuation" component={withSidebarLayout(() => <DisasterSectionPage title="Evacuation Plans" createTo="/family/disaster/new/plan" />)} />
        <Route path="/family/disaster/supplies" component={withSidebarLayout(() => <DisasterSectionPage title="Emergency Supplies" createTo="/family/disaster/new/supply" />)} />
        <Route path="/family/disaster/medical" component={withSidebarLayout(() => <DisasterSectionPage title="Medical Information" createTo="/family/disaster/new/medical" />)} />
        <Route path="/family/disaster/communication" component={withSidebarLayout(() => <DisasterSectionPage title="Communication Plans" createTo="/family/disaster/new/communication" />)} />
        <Route path="/family/disaster/insurance" component={withSidebarLayout(() => <DisasterSectionPage title="Insurance & Legal" createTo="/family/disaster/new/insurance" />)} />
        <Route path="/family/estate-planning" component={withSidebarLayout(() => <EstatePlanning />)} />
        <Route path="/family/estate/legal" component={withSidebarLayout(() => <EstateSectionPage title="Legal Documents" createTo="/family/estate/new/legal" />)} />
        <Route path="/family/estate/financial" component={withSidebarLayout(() => <EstateSectionPage title="Financial Assets" createTo="/family/estate/new/asset" />)} />
        <Route path="/family/estate/beneficiaries" component={withSidebarLayout(() => <EstateSectionPage title="Beneficiary Information" createTo="/family/estate/new/beneficiary" />)} />
        <Route path="/family/estate/documents" component={withSidebarLayout(() => <EstateSectionPage title="Important Documents" createTo="/family/estate/new/document" />)} />
        <Route path="/family/estate/tax" component={withSidebarLayout(() => <EstateSectionPage title="Tax Planning" createTo="/family/estate/new/tax" />)} />
        <Route path="/family/estate/professionals" component={withSidebarLayout(() => <EstateSectionPage title="Professional Contacts" createTo="/family/estate/new/professional" />)} />
        <Route path="/family/home-buying" component={withSidebarLayout(() => <HomeBuying />)} />
        <Route path="/family/home-buying/financial" component={withSidebarLayout(() => <HomeBuyingSectionPage title="Financial Planning" createTo="/family/home-buying/new/financial" />)} />
        <Route path="/family/home-buying/property" component={withSidebarLayout(() => <HomeBuyingSectionPage title="Property Research" createTo="/family/home-buying/new/property" />)} />
        <Route path="/family/home-buying/legal" component={withSidebarLayout(() => <HomeBuyingSectionPage title="Legal Documents" createTo="/family/home-buying/new/legal" />)} />
        <Route path="/family/home-buying/professionals" component={withSidebarLayout(() => <HomeBuyingSectionPage title="Professional Contacts" createTo="/family/home-buying/new/professional" />)} />
        <Route path="/family/home-buying/inspections" component={withSidebarLayout(() => <HomeBuyingSectionPage title="Inspections & Appraisals" createTo="/family/home-buying/new/inspection" />)} />
        <Route path="/family/home-buying/closing" component={withSidebarLayout(() => <HomeBuyingSectionPage title="Closing Process" createTo="/family/home-buying/new/closing" />)} />
        <Route path="/family/starting-family" component={withSidebarLayout(() => <StartingFamily />)} />
        <Route path="/family/starting-family/planning" component={withSidebarLayout(() => <FamilySectionPage title="Family Planning" createTo="/family/starting-family/new/planning" />)} />
        <Route path="/family/starting-family/pregnancy" component={withSidebarLayout(() => <FamilySectionPage title="Pregnancy & Birth" createTo="/family/starting-family/new/pregnancy" />)} />
        <Route path="/family/starting-family/financial" component={withSidebarLayout(() => <FamilySectionPage title="Financial Planning" createTo="/family/starting-family/new/financial" />)} />
        <Route path="/family/starting-family/support" component={withSidebarLayout(() => <FamilySectionPage title="Support Network" createTo="/family/starting-family/new/support" />)} />
        <Route path="/family/starting-family/medical" component={withSidebarLayout(() => <FamilySectionPage title="Medical Records" createTo="/family/starting-family/new/medical" />)} />
        <Route path="/family/starting-family/preparation" component={withSidebarLayout(() => <FamilySectionPage title="Baby Preparation" createTo="/family/starting-family/new/preparation" />)} />
        <Route path="/family/when-someone-dies" component={withSidebarLayout(() => <WhenSomeoneDies />)} />
        <Route path="/family/bereavement/immediate" component={withSidebarLayout(() => <BereavementSectionPage title="Immediate Tasks" createTo="/family/bereavement/new/immediate" />)} />
        <Route path="/family/bereavement/financial" component={withSidebarLayout(() => <BereavementSectionPage title="Financial Matters" createTo="/family/bereavement/new/financial" />)} />
        <Route path="/family/bereavement/legal" component={withSidebarLayout(() => <BereavementSectionPage title="Legal Procedures" createTo="/family/bereavement/new/legal" />)} />
        <Route path="/family/bereavement/support" component={withSidebarLayout(() => <BereavementSectionPage title="Support Resources" createTo="/family/bereavement/new/support" />)} />
        <Route path="/family/bereavement/notifications" component={withSidebarLayout(() => <BereavementSectionPage title="Notifications" createTo="/family/bereavement/new/notification" />)} />
        <Route path="/family/bereavement/memorial" component={withSidebarLayout(() => <BereavementSectionPage title="Memorial & Legacy" createTo="/family/bereavement/new/memorial" />)} />
        <Route path="/family/members" component={withSidebarLayout(FamilyMembers)} />
        <Route path="/family/documents" component={withSidebarLayout(FamilyDocuments)} />
        <Route path="/family/calendar" component={() => <CalendarPage />} />
        <Route path="/family/messages" component={withSidebarLayout(FamilyMessages)} />
        <Route path="/messages" component={() => <MessagesPage />} />
        <Route path="/family/photos" component={withSidebarLayout(FamilyPhotos)} />
        <Route path="/family/emergency" component={withSidebarLayout(FamilyEmergency)} />
        <Route path="/family/settings" component={withSidebarLayout(() => <FamilySettings />)} />
        <Route path="/family/api-management" component={withSidebarLayout(() => <ApiManagement />)} />
        <Route path="/family/approvals" component={withSidebarLayout(() => <ApprovalsPage />)} />
        <Route component={withSidebarLayout(FamilyHome)} />
      </Switch>
      
      {/* Slide-over Panels - rendered above all routes */}
      <InboxPanel />
      <RemindersPanel />
      
      {/* Floating Chat Widget - Family Portal Only */}
      <FloatingChatWidget />
    </>
  );
}