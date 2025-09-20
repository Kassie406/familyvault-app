import React, { useState } from 'react';
import { Users, Phone, Mail, MapPin, Plus, Edit3, Trash2, Search, Filter, Star, AlertTriangle, Heart, Home, Building, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  category: 'family' | 'medical' | 'emergency' | 'work' | 'neighbor' | 'other';
  isPrimary: boolean;
  notes?: string;
  lastContacted?: string;
}

const ContactList: React.FC = () => {
  const [, setLocation] = useLocation();
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      relationship: 'Primary Care Physician',
      phoneNumber: '+1 (555) 123-4567',
      email: 'sarah.johnson@healthcenter.com',
      address: '123 Medical Plaza, Suite 200',
      category: 'medical',
      isPrimary: true,
      notes: 'Available 24/7 for emergencies',
      lastContacted: '2024-01-15'
    },
    {
      id: '2',
      name: 'John Smith',
      relationship: 'Spouse',
      phoneNumber: '+1 (555) 987-6543',
      email: 'john.smith@email.com',
      category: 'family',
      isPrimary: true,
      lastContacted: '2024-01-20'
    },
    {
      id: '3',
      name: 'Emergency Services',
      relationship: '911 Emergency',
      phoneNumber: '911',
      category: 'emergency',
      isPrimary: true,
      notes: 'For life-threatening emergencies only'
    },
    {
      id: '4',
      name: 'Mary Johnson',
      relationship: 'Mother',
      phoneNumber: '+1 (555) 234-5678',
      email: 'mary.johnson@email.com',
      address: '456 Oak Street, Springfield',
      category: 'family',
      isPrimary: false,
      lastContacted: '2024-01-18'
    },
    {
      id: '5',
      name: 'Bob Wilson',
      relationship: 'Next Door Neighbor',
      phoneNumber: '+1 (555) 345-6789',
      category: 'neighbor',
      isPrimary: false,
      notes: 'Has spare house key'
    },
    {
      id: '6',
      name: 'Dr. Michael Brown',
      relationship: 'Cardiologist',
      phoneNumber: '+1 (555) 456-7890',
      email: 'mbrown@heartcenter.com',
      category: 'medical',
      isPrimary: false,
      lastContacted: '2024-01-10'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPrimaryOnly, setShowPrimaryOnly] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);

  const categories = [
    { id: 'all', name: 'All Contacts', icon: Users, color: 'text-gray-400' },
    { id: 'emergency', name: 'Emergency', icon: AlertTriangle, color: 'text-red-400' },
    { id: 'medical', name: 'Medical', icon: Heart, color: 'text-blue-400' },
    { id: 'family', name: 'Family', icon: Home, color: 'text-green-400' },
    { id: 'work', name: 'Work', icon: Building, color: 'text-purple-400' },
    { id: 'neighbor', name: 'Neighbors', icon: MapPin, color: 'text-orange-400' },
    { id: 'other', name: 'Other', icon: Users, color: 'text-gray-400' }
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.relationship.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || contact.category === selectedCategory;
    const matchesPrimary = !showPrimaryOnly || contact.isPrimary;
    return matchesSearch && matchesCategory && matchesPrimary;
  });

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? categoryData.icon : Users;
  };

  const getCategoryColor = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? categoryData.color : 'text-gray-400';
  };

  const handleCall = (phoneNumber: string, name: string) => {
    console.log(`Calling ${name} at ${phoneNumber}`);
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmail = (email: string, name: string) => {
    console.log(`Emailing ${name} at ${email}`);
    window.location.href = `mailto:${email}`;
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
  };

  const togglePrimary = (contactId: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, isPrimary: !contact.isPrimary }
        : contact
    ));
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
                <Users className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Emergency Contacts</h1>
                <p className="text-gray-400">Manage your emergency contact network</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddingContact(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
            >
              <Plus size={16} />
              <span>Add Contact</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
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

          {/* Additional Filters */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={showPrimaryOnly}
                onChange={(e) => setShowPrimaryOnly(e.target.checked)}
                className="rounded border-gray-600 bg-gray-800 text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <span>Primary contacts only</span>
            </label>
            <div className="text-sm text-gray-400">
              Showing {filteredContacts.length} of {contacts.length} contacts
            </div>
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => {
            const CategoryIcon = getCategoryIcon(contact.category);
            const categoryColor = getCategoryColor(contact.category);
            
            return (
              <div
                key={contact.id}
                className={`bg-gray-800 rounded-lg p-6 border transition-all hover:border-[#D4AF37]/50 ${
                  contact.isPrimary ? 'border-[#D4AF37]/30' : 'border-gray-700'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gray-700 ${categoryColor}`}>
                      <CategoryIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white flex items-center">
                        {contact.name}
                        {contact.isPrimary && (
                          <Star className="ml-2 h-4 w-4 text-[#D4AF37] fill-current" />
                        )}
                      </h3>
                      <p className="text-sm text-gray-400">{contact.relationship}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => togglePrimary(contact.id)}
                      className={`p-1 rounded ${contact.isPrimary ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-[#D4AF37]'}`}
                      title={contact.isPrimary ? 'Remove from primary' : 'Mark as primary'}
                    >
                      <Star size={16} className={contact.isPrimary ? 'fill-current' : ''} />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-blue-400">
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteContact(contact.id)}
                      className="p-1 text-gray-500 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-mono text-gray-300">{contact.phoneNumber}</span>
                  </div>
                  
                  {contact.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{contact.email}</span>
                    </div>
                  )}
                  
                  {contact.address && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-300">{contact.address}</span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {contact.notes && (
                  <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-300">{contact.notes}</p>
                  </div>
                )}

                {/* Last Contacted */}
                {contact.lastContacted && (
                  <div className="mb-4 text-xs text-gray-500">
                    Last contacted: {new Date(contact.lastContacted).toLocaleDateString()}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCall(contact.phoneNumber, contact.name)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-[#D4AF37] text-black font-semibold py-2 rounded-lg hover:bg-[#B8941F] transition-colors"
                  >
                    <Phone size={16} />
                    <span>Call</span>
                  </button>
                  
                  {contact.email && (
                    <button
                      onClick={() => handleEmail(contact.email!, contact.name)}
                      className="flex items-center justify-center px-3 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors"
                    >
                      <Mail size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No contacts found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => setIsAddingContact(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
            >
              <Plus size={16} />
              <span>Add Your First Contact</span>
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#D4AF37]">
              {contacts.filter(c => c.isPrimary).length}
            </div>
            <div className="text-sm text-gray-400">Primary Contacts</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {contacts.filter(c => c.category === 'emergency').length}
            </div>
            <div className="text-sm text-gray-400">Emergency Services</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {contacts.filter(c => c.category === 'medical').length}
            </div>
            <div className="text-sm text-gray-400">Medical Contacts</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {contacts.filter(c => c.category === 'family').length}
            </div>
            <div className="text-sm text-gray-400">Family Members</div>
          </div>
        </div>

        {/* Emergency Tips */}
        <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-400 mb-2">Emergency Contact Tips</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Keep at least 3 primary emergency contacts</li>
                <li>• Include one out-of-state contact for disasters</li>
                <li>• Update contact information regularly</li>
                <li>• Share your emergency contacts with family members</li>
                <li>• Keep a printed copy in your wallet or purse</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
