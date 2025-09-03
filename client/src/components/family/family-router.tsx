import { Switch, Route } from 'wouter';
import FamilyLayout from './family-layout';
import FamilyHome from '@/pages/family/family-home';
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
function withFamilyLayout(Component: () => JSX.Element) {
  return function WrappedComponent() {
    return (
      <FamilyLayout>
        <Component />
      </FamilyLayout>
    );
  };
}

export default function FamilyRouter() {
  return (
    <>
      {/* Main Family Routes */}
      <Switch>
        <Route path="/" component={withFamilyLayout(FamilyHome)} />
        <Route path="/family" component={withFamilyLayout(FamilyHome)} />
        <Route path="/family/members" component={withFamilyLayout(FamilyMembers)} />
        <Route path="/family/documents" component={withFamilyLayout(FamilyDocuments)} />
        <Route path="/family/messages" component={withFamilyLayout(FamilyMessages)} />
        <Route path="/family/calendar" component={withFamilyLayout(FamilyCalendar)} />
        <Route path="/family/photos" component={withFamilyLayout(FamilyPhotos)} />
        <Route path="/family/emergency" component={withFamilyLayout(FamilyEmergency)} />
        <Route path="/family/settings" component={withFamilyLayout(FamilySettings)} />
        <Route component={withFamilyLayout(FamilyHome)} />
      </Switch>
      
      {/* Slide-over Panels - rendered above all routes */}
      <InboxPanel />
      <RemindersPanel />
    </>
  );
}