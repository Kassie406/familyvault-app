import React, { useState } from 'react';
import { Shield, MapPin, Users, Phone, FileText, AlertTriangle, Home, Car, Briefcase, Save, Edit3, X, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

interface EmergencyPlanData {
  meetingPoints: {
    primary: string;
    secondary: string;
    outOfTown: string;
  };
  evacuationRoutes: {
    route1: string;
    route2: string;
    alternateTransport: string;
  };
  importantDocuments: {
    location: string;
    backupLocation: string;
    digitalCopies: string;
  };
  emergencySupplies: {
    location: string;
    lastChecked: string;
    contents: string[];
  };
  communicationPlan: {
    outOfStateContact: string;
    localContact: string;
    socialMediaPlan: string;
  };
  specialConsiderations: {
    pets: string;
    medications: string;
    mobility: string;
  };
}

const EmergencyPlan: React.FC = () => {
  const [, setLocation] = useLocation();
  const [planData, setPlanData] = useState<EmergencyPlanData>({
    meetingPoints: {
      primary: 'Local Community Center - 123 Main St',
      secondary: 'City Park Pavilion - 456 Oak Ave',
      outOfTown: 'Aunt Mary\'s House - Springfield (555) 123-4567'
    },
    evacuationRoutes: {
      route1: 'Highway 101 North to Interstate 5',
      route2: 'Main Street to Highway 99 South',
      alternateTransport: 'Bus Route 15 from corner of Main & 1st'
    },
    importantDocuments: {
      location: 'Fireproof safe in master bedroom closet',
      backupLocation: 'Safety deposit box at First National Bank',
      digitalCopies: 'Encrypted cloud storage (Google Drive)'
    },
    emergencySupplies: {
      location: 'Garage storage cabinet',
      lastChecked: '2024-01-15',
      contents: ['Water (3 days)', 'Non-perishable food', 'First aid kit', 'Flashlights', 'Battery radio', 'Medications']
    },
    communicationPlan: {
      outOfStateContact: 'Sister - Jane Doe (Texas) - (555) 987-6543',
      localContact: 'Neighbor - Bob Smith - (555) 234-5678',
      socialMediaPlan: 'Check in on Facebook, update family WhatsApp group'
    },
    specialConsiderations: {
      pets: '2 cats - carriers in garage, food in emergency kit',
      medications: 'Insulin in refrigerator, backup in emergency kit',
      mobility: 'Wheelchair accessible routes planned'
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (section: keyof EmergencyPlanData, field: string, value: string) => {
    setPlanData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section: keyof EmergencyPlanData, field: string, index: number, value: string) => {
    setPlanData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: (prev[section] as any)[field].map((item: string, i: number) => 
          i === index ? value : item
        )
      }
    }));
  };

  const addSupplyItem = () => {
    setPlanData(prev => ({
      ...prev,
      emergencySupplies: {
        ...prev.emergencySupplies,
        contents: [...prev.emergencySupplies.contents, '']
      }
    }));
  };

  const removeSupplyItem = (index: number) => {
    setPlanData(prev => ({
      ...prev,
      emergencySupplies: {
        ...prev.emergencySupplies,
        contents: prev.emergencySupplies.contents.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving emergency plan:', planData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving emergency plan:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setLocation('/family')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                title="Back to Dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
                <Shield className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Emergency Plan</h1>
                <p className="text-gray-400">Comprehensive family emergency preparedness plan</p>
              </div>
            </div>
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{isSaving ? 'Saving...' : 'Save Plan'}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
                >
                  <Edit3 size={16} />
                  <span>Edit Plan</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Meeting Points */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <MapPin className="h-5 w-5 text-blue-400 mr-2" />
              Meeting Points
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Primary Meeting Point</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={planData.meetingPoints.primary}
                    onChange={(e) => handleInputChange('meetingPoints', 'primary', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Primary meeting location"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {planData.meetingPoints.primary}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Meeting Point</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={planData.meetingPoints.secondary}
                    onChange={(e) => handleInputChange('meetingPoints', 'secondary', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Secondary meeting location"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {planData.meetingPoints.secondary}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Out-of-Town Contact</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={planData.meetingPoints.outOfTown}
                    onChange={(e) => handleInputChange('meetingPoints', 'outOfTown', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Out-of-town meeting point"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {planData.meetingPoints.outOfTown}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Evacuation Routes */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Car className="h-5 w-5 text-green-400 mr-2" />
              Evacuation Routes
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Primary Route</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={planData.evacuationRoutes.route1}
                    onChange={(e) => handleInputChange('evacuationRoutes', 'route1', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Primary evacuation route"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {planData.evacuationRoutes.route1}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Alternate Route</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={planData.evacuationRoutes.route2}
                    onChange={(e) => handleInputChange('evacuationRoutes', 'route2', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Alternate evacuation route"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {planData.evacuationRoutes.route2}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Public Transportation</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={planData.evacuationRoutes.alternateTransport}
                    onChange={(e) => handleInputChange('evacuationRoutes', 'alternateTransport', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Public transportation options"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {planData.evacuationRoutes.alternateTransport}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Important Documents */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FileText className="h-5 w-5 text-purple-400 mr-2" />
              Important Documents
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Primary Storage</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={planData.importantDocuments.location}
                    onChange={(e) => handleInputChange('importantDocuments', 'location', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Where documents are stored"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {planData.importantDocuments.location}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Backup Storage</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={planData.importantDocuments.backupLocation}
                    onChange={(e) => handleInputChange('importantDocuments', 'backupLocation', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Backup document location"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {planData.importantDocuments.backupLocation}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Digital Copies</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={planData.importantDocuments.digitalCopies}
                    onChange={(e) => handleInputChange('importantDocuments', 'digitalCopies', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Digital storage location"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {planData.importantDocuments.digitalCopies}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Supplies */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Briefcase className="h-5 w-5 text-orange-400 mr-2" />
              Emergency Supplies
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Storage Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={planData.emergencySupplies.location}
                    onChange={(e) => handleInputChange('emergencySupplies', 'location', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Where supplies are stored"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {planData.emergencySupplies.location}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Checked</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={planData.emergencySupplies.lastChecked}
                    onChange={(e) => handleInputChange('emergencySupplies', 'lastChecked', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {new Date(planData.emergencySupplies.lastChecked).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Supply Contents</label>
                <div className="space-y-2">
                  {planData.emergencySupplies.contents.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayChange('emergencySupplies', 'contents', index, e.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            placeholder="Supply item"
                          />
                          <button
                            onClick={() => removeSupplyItem(index)}
                            className="p-2 text-red-400 hover:text-red-300"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center px-3 py-2 bg-gray-700 rounded-lg text-white w-full">
                          <span className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3"></span>
                          {item}
                        </div>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={addSupplyItem}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <span>+ Add Item</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Communication Plan */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Phone className="h-5 w-5 text-cyan-400 mr-2" />
              Communication Plan
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Out-of-State Contact</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={planData.communicationPlan.outOfStateContact}
                    onChange={(e) => handleInputChange('communicationPlan', 'outOfStateContact', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Out-of-state emergency contact"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {planData.communicationPlan.outOfStateContact}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Local Contact</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={planData.communicationPlan.localContact}
                    onChange={(e) => handleInputChange('communicationPlan', 'localContact', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Local emergency contact"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {planData.communicationPlan.localContact}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Social Media Plan</label>
                {isEditing ? (
                  <textarea
                    value={planData.communicationPlan.socialMediaPlan}
                    onChange={(e) => handleInputChange('communicationPlan', 'socialMediaPlan', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Social media communication plan"
                    rows={3}
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {planData.communicationPlan.socialMediaPlan}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Special Considerations */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
              Special Considerations
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Pets</label>
                {isEditing ? (
                  <textarea
                    value={planData.specialConsiderations.pets}
                    onChange={(e) => handleInputChange('specialConsiderations', 'pets', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Pet emergency plan"
                    rows={2}
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {planData.specialConsiderations.pets}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Medications</label>
                {isEditing ? (
                  <textarea
                    value={planData.specialConsiderations.medications}
                    onChange={(e) => handleInputChange('specialConsiderations', 'medications', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Medication emergency plan"
                    rows={2}
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {planData.specialConsiderations.medications}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mobility Assistance</label>
                {isEditing ? (
                  <textarea
                    value={planData.specialConsiderations.mobility}
                    onChange={(e) => handleInputChange('specialConsiderations', 'mobility', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Mobility assistance plan"
                    rows={2}
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                    {planData.specialConsiderations.mobility}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Checklist */}
        <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Emergency Action Checklist
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-white mb-2">Immediate Actions</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Ensure everyone's safety first</li>
                <li>• Call 911 if life-threatening</li>
                <li>• Account for all family members</li>
                <li>• Grab emergency supplies if safe</li>
                <li>• Follow evacuation routes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Communication Steps</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Contact out-of-state contact first</li>
                <li>• Update family on social media</li>
                <li>• Check in at meeting points</li>
                <li>• Notify local authorities if needed</li>
                <li>• Keep phone charged for updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPlan;
