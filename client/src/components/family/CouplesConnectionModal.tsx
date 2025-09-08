import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Calendar, 
  Camera, 
  Gift, 
  Star,
  Plus,
  MapPin,
  Clock,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { LuxuryCard } from '@/components/luxury-cards';

interface CouplesActivity {
  id: string;
  title: string;
  type: 'memory' | 'date-idea' | 'milestone' | 'goal' | 'message';
  date: string;
  description: string;
  location?: string;
  photos?: string[];
  status: 'completed' | 'planned' | 'ongoing' | 'archived';
  tags: string[];
  createdBy: string;
}

interface CouplesConnectionModalProps {
  open: boolean;
  onClose: () => void;
}

export function CouplesConnectionModal({ open, onClose }: CouplesConnectionModalProps) {
  const [activeTab, setActiveTab] = useState<'memories' | 'dates' | 'goals' | 'messages'>('memories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  
  // Mock data for demonstration
  const [activities] = useState<CouplesActivity[]>([
    {
      id: '1',
      title: 'Anniversary Dinner at Luigi\'s',
      type: 'memory',
      date: '2024-12-14',
      description: 'Amazing romantic dinner to celebrate our 5th anniversary. The pasta was incredible!',
      location: 'Luigi\'s Italian Restaurant',
      photos: ['anniversary1.jpg', 'anniversary2.jpg'],
      status: 'completed',
      tags: ['anniversary', 'restaurant', 'romantic'],
      createdBy: 'Sarah'
    },
    {
      id: '2',
      title: 'Weekend Getaway to Mountains',
      type: 'date-idea',
      date: '2025-02-15',
      description: 'Plan a cozy cabin weekend with hiking and star gazing',
      location: 'Blue Ridge Mountains',
      status: 'planned',
      tags: ['nature', 'weekend', 'adventure'],
      createdBy: 'Michael'
    },
    {
      id: '3',
      title: 'Learn Salsa Dancing Together',
      type: 'goal',
      date: '2025-01-30',
      description: 'Take weekly salsa lessons to improve our dancing skills',
      location: 'Dance Studio Downtown',
      status: 'ongoing',
      tags: ['dancing', 'learning', 'fun'],
      createdBy: 'Sarah'
    },
    {
      id: '4',
      title: 'First Home Purchase',
      type: 'milestone',
      date: '2024-08-20',
      description: 'Successfully bought our first home together! Dream come true.',
      location: 'Oak Street House',
      status: 'completed',
      tags: ['milestone', 'home', 'achievement'],
      createdBy: 'Michael'
    },
    {
      id: '5',
      title: 'Love You More Every Day',
      type: 'message',
      date: '2025-01-25',
      description: 'Just wanted to remind you how much you mean to me. Thank you for being my best friend and partner.',
      status: 'completed',
      tags: ['love', 'appreciation'],
      createdBy: 'Sarah'
    }
  ]);

  const filteredActivities = activities.filter(activity => {
    const matchesTab = 
      (activeTab === 'memories' && (activity.type === 'memory' || activity.type === 'milestone')) ||
      (activeTab === 'dates' && activity.type === 'date-idea') ||
      (activeTab === 'goals' && activity.type === 'goal') ||
      (activeTab === 'messages' && activity.type === 'message');
    
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'All' || activity.status === selectedFilter.toLowerCase();
    
    return matchesTab && matchesSearch && matchesFilter;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'memory': return <Camera className="h-4 w-4" />;
      case 'date-idea': return <Calendar className="h-4 w-4" />;
      case 'milestone': return <Star className="h-4 w-4" />;
      case 'goal': return <Gift className="h-4 w-4" />;
      case 'message': return <MessageCircle className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'planned': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ongoing': return 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30';
      case 'archived': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-[#141414] border-[#2A2A33] text-white overflow-hidden">
        <DialogHeader className="border-b border-[#2A2A33] pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
            <Heart className="h-6 w-6 text-[#D4AF37]" />
            Couple's Connection
          </DialogTitle>
          <p className="text-neutral-400 text-sm mt-1">
            Preserve memories, plan dates, set goals, and share love notes
          </p>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between border-b border-[#2A2A33] pb-4 mb-6">
            <div className="flex space-x-1">
              {[
                { key: 'memories', label: 'Memories', icon: Camera },
                { key: 'dates', label: 'Date Ideas', icon: Calendar },
                { key: 'goals', label: 'Goals', icon: Gift },
                { key: 'messages', label: 'Messages', icon: MessageCircle }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === key
                      ? 'bg-[#D4AF37] text-black'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                  data-testid={`tab-${key}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            <Button 
              className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-medium"
              size="sm"
              data-testid="add-activity-button"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add New
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1A1A1A] border-[#2A2A33] text-white placeholder-neutral-400"
                data-testid="search-input"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-neutral-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-[#1A1A1A] border border-[#2A2A33] rounded-md px-3 py-2 text-white text-sm"
                data-testid="filter-select"
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Planned">Planned</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Activity Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActivities.map((activity) => (
                <LuxuryCard 
                  key={activity.id}
                  className="p-4 cursor-pointer group hover:scale-[1.02] transition-all"
                  data-testid={`activity-${activity.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm group-hover:text-[#D4AF37] transition-colors">
                          {activity.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-neutral-400">
                          <Clock className="h-3 w-3" />
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(activity.status)}`}
                      >
                        {activity.status}
                      </Badge>
                      <MoreHorizontal className="h-4 w-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  
                  <p className="text-neutral-300 text-sm mb-3 line-clamp-2">
                    {activity.description}
                  </p>
                  
                  {activity.location && (
                    <div className="flex items-center gap-1 text-xs text-neutral-400 mb-2">
                      <MapPin className="h-3 w-3" />
                      {activity.location}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {activity.tags.slice(0, 2).map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-white/5 text-neutral-400 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {activity.tags.length > 2 && (
                        <span className="text-xs text-neutral-500">
                          +{activity.tags.length - 2}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-neutral-500">
                      by {activity.createdBy}
                    </div>
                  </div>
                </LuxuryCard>
              ))}
            </div>

            {filteredActivities.length === 0 && (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-400 mb-2">No activities found</p>
                <p className="text-sm text-neutral-500">
                  {searchQuery || selectedFilter !== 'All' 
                    ? 'Try adjusting your search or filter'
                    : 'Start by adding your first couple activity!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}