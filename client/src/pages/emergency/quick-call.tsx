import React, { useState } from 'react';
import { Phone, Search, Shield, AlertTriangle, Heart, Home, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  isPrimary: boolean;
  category: 'family' | 'medical' | 'emergency' | 'other';
}

const QuickCall: React.FC = () => {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock emergency contacts data
  const emergencyContacts: Contact[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      relationship: 'Primary Doctor',
      phoneNumber: '+1 (555) 123-4567',
      isPrimary: true,
      category: 'medical'
    },
    {
      id: '2',
      name: 'John Smith',
      relationship: 'Spouse',
      phoneNumber: '+1 (555) 987-6543',
      isPrimary: true,
      category: 'family'
    },
    {
      id: '3',
      name: 'Emergency Services',
      relationship: '911',
      phoneNumber: '911',
      isPrimary: true,
      category: 'emergency'
    },
    {
      id: '4',
      name: 'Mary Johnson',
      relationship: 'Mother',
      phoneNumber: '+1 (555) 234-5678',
      isPrimary: false,
      category: 'family'
    },
    {
      id: '5',
      name: 'Poison Control',
      relationship: 'Emergency Service',
      phoneNumber: '1-800-222-1222',
      isPrimary: true,
      category: 'emergency'
    },
    {
      id: '6',
      name: 'Dr. Michael Brown',
      relationship: 'Cardiologist',
      phoneNumber: '+1 (555) 345-6789',
      isPrimary: false,
      category: 'medical'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Contacts', icon: Phone },
    { id: 'emergency', name: 'Emergency', icon: AlertTriangle },
    { id: 'medical', name: 'Medical', icon: Heart },
    { id: 'family', name: 'Family', icon: Home }
  ];

  const filteredContacts = emergencyContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.relationship.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || contact.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCall = (phoneNumber: string, name: string) => {
    // In a real app, this would initiate a phone call
    console.log(`Calling ${name} at ${phoneNumber}`);
    window.location.href = `tel:${phoneNumber}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medical': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'family': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency': return AlertTriangle;
      case 'medical': return Heart;
      case 'family': return Home;
      default: return Phone;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setLocation('/family')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                title="Back to Dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
                <Phone className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Quick Call</h1>
                <p className="text-gray-400">Instantly call your emergency contacts</p>
              </div>
            </div>
          </div>

          {/* Emergency Banner */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-red-400" />
              <div>
                <h3 className="font-medium text-red-400">Emergency Contacts Ready</h3>
                <p className="text-sm text-gray-300">Tap any contact below to call immediately</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              placeholder="Search contacts..."
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                      : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-[#D4AF37]/50'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContacts.map((contact) => {
            const CategoryIcon = getCategoryIcon(contact.category);
            return (
              <div
                key={contact.id}
                className={`bg-gray-800 rounded-lg p-6 border transition-all hover:border-[#D4AF37]/50 ${
                  contact.isPrimary ? 'border-[#D4AF37]/30' : 'border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg border ${getCategoryColor(contact.category)}`}>
                      <CategoryIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white flex items-center">
                        {contact.name}
                        {contact.isPrimary && (
                          <span className="ml-2 px-2 py-1 text-xs bg-[#D4AF37] text-black rounded-full">
                            Primary
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-400">{contact.relationship}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-lg font-mono text-gray-300">{contact.phoneNumber}</p>
                </div>

                <button
                  onClick={() => handleCall(contact.phoneNumber, contact.name)}
                  className="w-full flex items-center justify-center space-x-2 bg-[#D4AF37] text-black font-semibold py-3 rounded-lg hover:bg-[#B8941F] transition-colors"
                >
                  <Phone size={18} />
                  <span>Call Now</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No contacts found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Emergency Instructions */}
        <div className="mt-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-[#D4AF37] mt-0.5" />
            <div>
              <h3 className="font-medium text-white mb-2">Emergency Calling Tips</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• For life-threatening emergencies, always call 911 first</li>
                <li>• Keep your phone charged and accessible</li>
                <li>• Know your location when calling emergency services</li>
                <li>• Have medical information ready to share</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickCall;
