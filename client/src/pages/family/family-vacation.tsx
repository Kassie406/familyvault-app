import React, { useState } from 'react';
import { MapPin, Plus, Search, Calendar, Users, DollarSign, ArrowLeft, Edit3, Trash2, Plane, Hotel, Camera, FileText, Clock, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';

interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'booked' | 'completed' | 'cancelled';
  budget: number;
  spent: number;
  travelers: string[];
  activities: Activity[];
  accommodations: Accommodation[];
  transportation: Transportation[];
  documents: Document[];
  photos: Photo[];
  notes: string;
  createdBy: string;
  isFavorite: boolean;
}

interface Activity {
  id: string;
  name: string;
  date: string;
  time?: string;
  cost: number;
  location: string;
  status: 'planned' | 'booked' | 'completed';
  category: string;
}

interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'resort' | 'rental' | 'camping' | 'other';
  checkIn: string;
  checkOut: string;
  cost: number;
  location: string;
  status: 'researching' | 'booked' | 'confirmed';
  rating?: number;
}

interface Transportation {
  id: string;
  type: 'flight' | 'car' | 'train' | 'bus' | 'cruise' | 'other';
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  cost: number;
  status: 'researching' | 'booked' | 'confirmed';
  confirmationNumber?: string;
}

interface Document {
  id: string;
  name: string;
  type: 'passport' | 'visa' | 'ticket' | 'reservation' | 'insurance' | 'other';
  expiryDate?: string;
  status: 'needed' | 'obtained' | 'expired';
  notes?: string;
}

interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
  location: string;
}

const FamilyVacation: React.FC = () => {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<string>('current');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'budget' | 'documents'>('overview');
  const [isAddingTrip, setIsAddingTrip] = useState(false);

  // Mock data for family vacation
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      title: 'Hawaii Family Adventure',
      destination: 'Honolulu, Hawaii',
      startDate: '2024-07-15',
      endDate: '2024-07-22',
      status: 'booked',
      budget: 8500,
      spent: 6200,
      travelers: ['Mom', 'Dad', 'Sarah', 'Alex'],
      activities: [
        { id: '1', name: 'Snorkeling Tour', date: '2024-07-18', time: '09:00', cost: 280, location: 'Hanauma Bay', status: 'booked', category: 'Adventure' },
        { id: '2', name: 'Pearl Harbor Visit', date: '2024-07-20', time: '10:00', cost: 120, location: 'Pearl Harbor', status: 'booked', category: 'Historical' },
        { id: '3', name: 'Luau Dinner', date: '2024-07-21', time: '18:00', cost: 320, location: 'Polynesian Cultural Center', status: 'booked', category: 'Cultural' }
      ],
      accommodations: [
        { id: '1', name: 'Beachfront Resort', type: 'resort', checkIn: '2024-07-15', checkOut: '2024-07-22', cost: 2800, location: 'Waikiki Beach', status: 'confirmed', rating: 4.5 }
      ],
      transportation: [
        { id: '1', type: 'flight', departure: 'LAX', arrival: 'HNL', departureTime: '2024-07-15 08:00', arrivalTime: '2024-07-15 12:30', cost: 1600, status: 'confirmed', confirmationNumber: 'ABC123' },
        { id: '2', type: 'flight', departure: 'HNL', arrival: 'LAX', departureTime: '2024-07-22 14:00', arrivalTime: '2024-07-22 22:30', cost: 1600, status: 'confirmed', confirmationNumber: 'ABC124' }
      ],
      documents: [
        { id: '1', name: 'Flight Tickets', type: 'ticket', status: 'obtained' },
        { id: '2', name: 'Hotel Reservation', type: 'reservation', status: 'obtained' },
        { id: '3', name: 'Travel Insurance', type: 'insurance', expiryDate: '2024-12-31', status: 'obtained' }
      ],
      photos: [],
      notes: 'Remember to pack sunscreen and snorkeling gear. Check weather forecast before departure.',
      createdBy: 'Mom',
      isFavorite: true
    },
    {
      id: '2',
      title: 'European Adventure',
      destination: 'Paris, France',
      startDate: '2024-12-20',
      endDate: '2024-12-28',
      status: 'planning',
      budget: 12000,
      spent: 2400,
      travelers: ['Mom', 'Dad', 'Sarah'],
      activities: [
        { id: '4', name: 'Eiffel Tower Visit', date: '2024-12-22', cost: 75, location: 'Eiffel Tower', status: 'planned', category: 'Sightseeing' },
        { id: '5', name: 'Louvre Museum', date: '2024-12-23', cost: 120, location: 'Louvre', status: 'planned', category: 'Cultural' },
        { id: '6', name: 'Seine River Cruise', date: '2024-12-24', cost: 180, location: 'Seine River', status: 'planned', category: 'Scenic' }
      ],
      accommodations: [
        { id: '2', name: 'Boutique Hotel', type: 'hotel', checkIn: '2024-12-20', checkOut: '2024-12-28', cost: 2400, location: 'Marais District', status: 'researching', rating: 4.2 }
      ],
      transportation: [
        { id: '3', type: 'flight', departure: 'LAX', arrival: 'CDG', departureTime: '2024-12-20 10:00', arrivalTime: '2024-12-21 06:00', cost: 2400, status: 'researching' }
      ],
      documents: [
        { id: '4', name: 'Passports', type: 'passport', expiryDate: '2026-05-15', status: 'obtained' },
        { id: '5', name: 'Travel Visa', type: 'visa', status: 'needed' },
        { id: '6', name: 'Travel Insurance', type: 'insurance', status: 'needed' }
      ],
      photos: [],
      notes: 'Need to research best neighborhoods to stay in. Consider day trips to Versailles.',
      createdBy: 'Dad',
      isFavorite: false
    }
  ]);

  const tripStatuses = ['all', 'planning', 'booked', 'completed', 'cancelled'];

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || trip.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const currentTrip = trips.find(trip => trip.id === selectedTrip) || trips[0];

  const toggleFavorite = (tripId: string) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { ...trip, isFavorite: !trip.isFavorite }
        : trip
    ));
  };

  const deleteTrip = (tripId: string) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'text-yellow-400 bg-yellow-500/10';
      case 'booked': return 'text-blue-400 bg-blue-500/10';
      case 'completed': return 'text-green-400 bg-green-500/10';
      case 'cancelled': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'text-yellow-400';
      case 'booked': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const calculateBudgetProgress = (trip: Trip) => {
    return trip.budget > 0 ? (trip.spent / trip.budget) * 100 : 0;
  };

  const getTripDuration = (trip: Trip) => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
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
                <MapPin className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Family Vacation Planner</h1>
                <p className="text-gray-400">Plan, organize, and track your family adventures</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddingTrip(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
            >
              <Plus size={16} />
              <span>Plan New Trip</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-sm text-gray-400">Total Trips</span>
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {trips.length}
            </div>
            <div className="text-sm text-gray-400">Planned Adventures</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-400" />
              </div>
              <span className="text-sm text-gray-400">Completed</span>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {trips.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-400">Trips Taken</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <span className="text-sm text-gray-400">Total Budget</span>
            </div>
            <div className="text-2xl font-bold text-[#D4AF37] mb-1">
              ${trips.reduce((sum, trip) => sum + trip.budget, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">All Trips</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <span className="text-sm text-gray-400">Travelers</span>
            </div>
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {Math.max(...trips.map(t => t.travelers.length))}
            </div>
            <div className="text-sm text-gray-400">Max Group Size</div>
          </div>
        </div>

        {/* Trip Selection and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              placeholder="Search trips or destinations..."
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-400 font-medium">Trip:</span>
              {trips.map((trip) => (
                <button
                  key={trip.id}
                  onClick={() => setSelectedTrip(trip.id)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedTrip === trip.id
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {trip.title}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-400 font-medium">Status:</span>
              {tripStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedStatus === status
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
          {[
            { id: 'overview', name: 'Trip Overview', icon: MapPin },
            { id: 'itinerary', name: 'Itinerary', icon: Calendar },
            { id: 'budget', name: 'Budget', icon: DollarSign },
            { id: 'documents', name: 'Documents', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-[#D4AF37] text-black'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && currentTrip && (
          <div className="space-y-6">
            {/* Current Trip Details */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{currentTrip.title}</h3>
                  <p className="text-gray-400">{currentTrip.destination}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleFavorite(currentTrip.id)}
                    className={`p-2 rounded transition-colors ${
                      currentTrip.isFavorite 
                        ? 'text-red-400 hover:text-red-300' 
                        : 'text-gray-500 hover:text-red-400'
                    }`}
                  >
                    <Star className={`h-4 w-4 ${currentTrip.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <span className={`px-3 py-1 rounded-lg text-sm ${getStatusColor(currentTrip.status)}`}>
                    {currentTrip.status.charAt(0).toUpperCase() + currentTrip.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Travel Dates</h4>
                  <p className="text-white">
                    {new Date(currentTrip.startDate).toLocaleDateString()} - {new Date(currentTrip.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-400">{getTripDuration(currentTrip)} days</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Travelers</h4>
                  <div className="flex flex-wrap gap-1">
                    {currentTrip.travelers.map((traveler, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm">
                        {traveler}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Budget Progress</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(calculateBudgetProgress(currentTrip), 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-400">
                      ${currentTrip.spent.toLocaleString()} / ${currentTrip.budget.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {currentTrip.notes && (
                <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Trip Notes</h4>
                  <p className="text-gray-300">{currentTrip.notes}</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <Plane className="h-5 w-5 text-blue-400" />
                  <div>
                    <div className="text-lg font-semibold text-white">{currentTrip.transportation.length}</div>
                    <div className="text-sm text-gray-400">Transportation</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <Hotel className="h-5 w-5 text-green-400" />
                  <div>
                    <div className="text-lg font-semibold text-white">{currentTrip.accommodations.length}</div>
                    <div className="text-sm text-gray-400">Accommodations</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  <div>
                    <div className="text-lg font-semibold text-white">{currentTrip.activities.length}</div>
                    <div className="text-sm text-gray-400">Activities</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-[#D4AF37]" />
                  <div>
                    <div className="text-lg font-semibold text-white">{currentTrip.documents.length}</div>
                    <div className="text-sm text-gray-400">Documents</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'itinerary' && currentTrip && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Trip Itinerary</h3>
              <button
                onClick={() => alert('Add activity functionality would go here')}
                className="flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
              >
                <Plus size={16} />
                <span>Add Activity</span>
              </button>
            </div>

            {/* Activities by Date */}
            <div className="space-y-4">
              {currentTrip.activities.map((activity) => (
                <div key={activity.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-white">{activity.name}</h4>
                        <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                          {activity.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                        {activity.time && (
                          <span className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{activity.time}</span>
                          </span>
                        )}
                        <span>{activity.location}</span>
                        <span className="text-[#D4AF37]">${activity.cost}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-blue-400">
                        <Edit3 size={16} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Accommodations */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-4">Accommodations</h4>
              <div className="space-y-3">
                {currentTrip.accommodations.map((accommodation) => (
                  <div key={accommodation.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <div>
                      <h5 className="font-medium text-white">{accommodation.name}</h5>
                      <p className="text-sm text-gray-400">
                        {accommodation.location} • {new Date(accommodation.checkIn).toLocaleDateString()} - {new Date(accommodation.checkOut).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-[#D4AF37]">${accommodation.cost.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {accommodation.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-400">{accommodation.rating}</span>
                        </div>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(accommodation.status)}`}>
                        {accommodation.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transportation */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-4">Transportation</h4>
              <div className="space-y-3">
                {currentTrip.transportation.map((transport) => (
                  <div key={transport.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <div>
                      <h5 className="font-medium text-white capitalize">{transport.type}</h5>
                      <p className="text-sm text-gray-400">
                        {transport.departure} → {transport.arrival}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(transport.departureTime).toLocaleString()} - {new Date(transport.arrivalTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-[#D4AF37]">${transport.cost.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {transport.confirmationNumber && (
                        <span className="text-xs text-gray-400">#{transport.confirmationNumber}</span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(transport.status)}`}>
                        {transport.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'budget' && currentTrip && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Budget Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#D4AF37]">
                    ${currentTrip.budget.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Total Budget</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    ${currentTrip.spent.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Amount Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    ${(currentTrip.budget - currentTrip.spent).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Remaining</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Budget Progress</span>
                  <span className="text-sm text-gray-400">
                    {Math.round(calculateBudgetProgress(currentTrip))}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-[#D4AF37] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(calculateBudgetProgress(currentTrip), 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Budget Breakdown */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Expense Breakdown</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Plane className="h-5 w-5 text-blue-400" />
                      <span className="text-white">Transportation</span>
                    </div>
                    <span className="text-[#D4AF37]">
                      ${currentTrip.transportation.reduce((sum, t) => sum + t.cost, 0).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Hotel className="h-5 w-5 text-green-400" />
                      <span className="text-white">Accommodations</span>
                    </div>
                    <span className="text-[#D4AF37]">
                      ${currentTrip.accommodations.reduce((sum, a) => sum + a.cost, 0).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-purple-400" />
                      <span className="text-white">Activities</span>
                    </div>
                    <span className="text-[#D4AF37]">
                      ${currentTrip.activities.reduce((sum, a) => sum + a.cost, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && currentTrip && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Travel Documents</h3>
              <button
                onClick={() => alert('Add document functionality would go here')}
                className="flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
              >
                <Plus size={16} />
                <span>Add Document</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentTrip.documents.map((document) => (
                <div key={document.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">{document.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(document.status)}`}>
                      {document.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="capitalize">{document.type}</span>
                    </div>
                    
                    {document.expiryDate && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Expires: {new Date(document.expiryDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {document.notes && (
                      <div className="mt-2 p-2 bg-gray-900 rounded text-xs">
                        {document.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <button className="flex-1 px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors">
                      View
                    </button>
                    <button className="p-1 text-gray-500 hover:text-blue-400">
                      <Edit3 size={14} />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Document Status Summary */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-4">Document Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {currentTrip.documents.filter(d => d.status === 'obtained').length}
                  </div>
                  <div className="text-sm text-gray-400">Obtained</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {currentTrip.documents.filter(d => d.status === 'needed').length}
                  </div>
                  <div className="text-sm text-gray-400">Still Needed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {currentTrip.documents.filter(d => d.status === 'expired').length}
                  </div>
                  <div className="text-sm text-gray-400">Expired</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Trips List */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-white">All Family Trips</h3>
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-[#D4AF37]/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-white text-lg">{trip.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                    <span>{trip.destination}</span>
                    <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                    <span>{getTripDuration(trip)} days</span>
                    <span>{trip.travelers.length} travelers</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-300">
                    <span>Budget: ${trip.budget.toLocaleString()}</span>
                    <span>Spent: ${trip.spent.toLocaleString()}</span>
                    <span>Created by {trip.createdBy}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleFavorite(trip.id)}
                    className={`p-2 rounded transition-colors ${
                      trip.isFavorite 
                        ? 'text-red-400 hover:text-red-300' 
                        : 'text-gray-500 hover:text-red-400'
                    }`}
                  >
                    <Star className={`h-4 w-4 ${trip.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={() => setSelectedTrip(trip.id)}
                    className="p-2 text-gray-500 hover:text-blue-400"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => deleteTrip(trip.id)}
                    className="p-2 text-gray-500 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Trip Modal */}
        {isAddingTrip && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">Plan New Trip</h3>
              <p className="text-gray-400 mb-4">Trip planning form would go here</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsAddingTrip(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Trip creation form would open here');
                    setIsAddingTrip(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
                >
                  Create Trip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyVacation;
