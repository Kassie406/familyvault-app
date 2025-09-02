import { BrowserRouter, Routes, Route as ReactRoute, Navigate } from 'react-router-dom';
import FamilyLayout from './family-layout';
import FamilyHome from '@/pages/family/family-home';

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

export default function FamilyRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All family pages live under /family */}
        <ReactRoute path="/family" element={<FamilyLayout />}>
          <ReactRoute index element={<FamilyHome />} />
          <ReactRoute path="members" element={<FamilyMembers />} />
          <ReactRoute path="documents" element={<FamilyDocuments />} />
          <ReactRoute path="messages" element={<FamilyMessages />} />
          <ReactRoute path="calendar" element={<FamilyCalendar />} />
          <ReactRoute path="photos" element={<FamilyPhotos />} />
          <ReactRoute path="emergency" element={<FamilyEmergency />} />
          <ReactRoute path="settings" element={<FamilySettings />} />
          {/* Keep wildcard LAST so it doesn't swallow real routes */}
          <ReactRoute path="*" element={<Navigate to="/family" replace />} />
        </ReactRoute>
        {/* Root redirect to family */}
        <ReactRoute path="/" element={<Navigate to="/family" replace />} />
        {/* Fallback for anything else */}
        <ReactRoute path="*" element={<Navigate to="/family" replace />} />
      </Routes>
    </BrowserRouter>
  );
}