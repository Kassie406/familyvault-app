import React, { useState } from 'react';
import { X, MapPin, Calendar, Plus, Trash2, Edit3, Plane, Hotel, Camera, FileText, Clock, Star, Users, DollarSign } from 'lucide-react';

// Plan Trip Modal
interface PlanTripModalProps {
  open: boolean;
  onClose: () => void;
}

export function PlanTripModal({ open, onClose }: PlanTripModalProps) {
  const [tripData, setTripData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: [''],
    budget: '',
    notes: ''
  });

  const addTraveler = () => {
    setTripData(prev => ({
      ...prev,
      travelers: [...prev.travelers, '']
    }));
  };

  const removeTraveler = (index: number) => {
    setTripData(prev => ({
      ...prev,
      travelers: prev.travelers.filter((_, i) => i !== index)
    }));
  };

  const updateTraveler = (index: number, value: string) => {
    setTripData(prev => ({
      ...prev,
      travelers: prev.travelers.map((traveler, i) => i === index ? value : traveler)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save the trip data
    console.log('Creating trip:', tripData);
    alert('Trip created successfully!');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] border border-[#2A2A33] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A2A33]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
              <MapPin className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <h2 className="text-xl font-semibold text-white">Plan New Trip</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-auto max-h-[75vh]">
          <div className="space-y-6">
            {/* Trip Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trip Title
              </label>
              <input
                type="text"
                value={tripData.title}
                onChange={(e) => setTripData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="e.g., Summer Family Vacation"
                required
              />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Destination
              </label>
              <input
                type="text"
                value={tripData.destination}
                onChange={(e) => setTripData(prev => ({ ...prev, destination: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="e.g., Honolulu, Hawaii"
                required
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={tripData.startDate}
                  onChange={(e) => setTripData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={tripData.endDate}
                  onChange={(e) => setTripData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Travelers */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Travelers
                </label>
                <button
                  type="button"
                  onClick={addTraveler}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-[#D4AF37] text-black rounded hover:bg-[#B8941F] transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add</span>
                </button>
              </div>
              <div className="space-y-2">
                {tripData.travelers.map((traveler, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={traveler}
                      onChange={(e) => updateTraveler(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Traveler name"
                      required
                    />
                    {tripData.travelers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTraveler(index)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Budget (USD)
              </label>
              <input
                type="number"
                value={tripData.budget}
                onChange={(e) => setTripData(prev => ({ ...prev, budget: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="5000"
                min="0"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={tripData.notes}
                onChange={(e) => setTripData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="Special requirements, preferences, etc."
                rows={3}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex space-x-3 mt-6 pt-6 border-t border-[#2A2A33]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#2A2A33] text-white rounded-lg hover:bg-[#3A3A43] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors font-medium"
            >
              Create Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Book Activities Modal
interface BookActivitiesModalProps {
  open: boolean;
  onClose: () => void;
}

export function BookActivitiesModal({ open, onClose }: BookActivitiesModalProps) {
  const [activityData, setActivityData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    category: '',
    cost: '',
    notes: ''
  });

  const categories = [
    'Adventure', 'Cultural', 'Historical', 'Scenic', 'Entertainment', 
    'Food & Dining', 'Shopping', 'Sports', 'Relaxation', 'Educational'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking activity:', activityData);
    alert('Activity booked successfully!');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] border border-[#2A2A33] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A2A33]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
              <Calendar className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <h2 className="text-xl font-semibold text-white">Book Activity</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-auto max-h-[75vh]">
          <div className="space-y-6">
            {/* Activity Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Activity Name
              </label>
              <input
                type="text"
                value={activityData.name}
                onChange={(e) => setActivityData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="e.g., Snorkeling Tour"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={activityData.date}
                  onChange={(e) => setActivityData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={activityData.time}
                  onChange={(e) => setActivityData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={activityData.location}
                onChange={(e) => setActivityData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="e.g., Hanauma Bay"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={activityData.category}
                onChange={(e) => setActivityData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                required
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cost (USD)
              </label>
              <input
                type="number"
                value={activityData.cost}
                onChange={(e) => setActivityData(prev => ({ ...prev, cost: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="150"
                min="0"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={activityData.notes}
                onChange={(e) => setActivityData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="Special requirements, booking details, etc."
                rows={3}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex space-x-3 mt-6 pt-6 border-t border-[#2A2A33]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#2A2A33] text-white rounded-lg hover:bg-[#3A3A43] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors font-medium"
            >
              Book Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Travel Documents Modal
interface TravelDocumentsModalProps {
  open: boolean;
  onClose: () => void;
}

export function TravelDocumentsModal({ open, onClose }: TravelDocumentsModalProps) {
  const [documentData, setDocumentData] = useState({
    name: '',
    type: '',
    expiryDate: '',
    notes: ''
  });

  const documentTypes = [
    'Passport', 'Visa', 'Driver\'s License', 'Travel Insurance', 
    'Flight Ticket', 'Hotel Reservation', 'Car Rental', 'Travel Itinerary',
    'Medical Records', 'Emergency Contacts', 'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding travel document:', documentData);
    alert('Travel document added successfully!');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] border border-[#2A2A33] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A2A33]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
              <FileText className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <h2 className="text-xl font-semibold text-white">Add Travel Document</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-auto max-h-[75vh]">
          <div className="space-y-6">
            {/* Document Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Document Name
              </label>
              <input
                type="text"
                value={documentData.name}
                onChange={(e) => setDocumentData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="e.g., John's Passport"
                required
              />
            </div>

            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Document Type
              </label>
              <select
                value={documentData.type}
                onChange={(e) => setDocumentData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                required
              >
                <option value="">Select document type</option>
                {documentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Expiry Date (if applicable)
              </label>
              <input
                type="date"
                value={documentData.expiryDate}
                onChange={(e) => setDocumentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={documentData.notes}
                onChange={(e) => setDocumentData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="Document number, issuing authority, special notes, etc."
                rows={4}
              />
            </div>

            {/* Document Checklist */}
            <div className="bg-[#1A1A1A] rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Travel Document Checklist</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Document is valid for at least 6 months</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Made copies of important documents</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Stored digital copies in secure location</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Verified entry requirements for destination</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex space-x-3 mt-6 pt-6 border-t border-[#2A2A33]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#2A2A33] text-white rounded-lg hover:bg-[#3A3A43] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors font-medium"
            >
              Add Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
