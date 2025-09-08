import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Plus, 
  Search, 
  Filter,
  Heart,
  Clock,
  DollarSign,
  Calendar,
  Tag,
  ChevronUp,
  ChevronDown,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateIdea {
  id: string;
  title: string;
  tags: string[];
  estimatedCost?: number; // in cents
  estimatedTimeMinutes?: number;
  preparation?: string;
  createdBy: string;
  upvotes: { [userId: string]: boolean };
  createdAt: string;
}

interface IdeasListProps {
  className?: string;
}

export function IdeasList({ className }: IdeasListProps) {
  const [ideas, setIdeas] = useState<DateIdea[]>([
    {
      id: '1',
      title: 'Sunset picnic at the park',
      tags: ['outdoor', 'romantic', 'food'],
      estimatedCost: 2500, // $25
      estimatedTimeMinutes: 180, // 3 hours
      preparation: 'Pack sandwiches, drinks, and blanket',
      createdBy: 'Sarah',
      upvotes: { 'sarah': true, 'michael': true },
      createdAt: '2025-01-20'
    },
    {
      id: '2',
      title: 'Cooking class downtown',
      tags: ['learning', 'food', 'indoor'],
      estimatedCost: 12000, // $120
      estimatedTimeMinutes: 120, // 2 hours
      preparation: 'Book in advance, wear comfortable clothes',
      createdBy: 'Michael',
      upvotes: { 'sarah': true },
      createdAt: '2025-01-18'
    },
    {
      id: '3',
      title: 'Movie marathon at home',
      tags: ['cozy', 'indoor', 'relaxing'],
      estimatedCost: 1500, // $15 for snacks
      estimatedTimeMinutes: 240, // 4 hours
      preparation: 'Choose movies, get popcorn and wine',
      createdBy: 'Sarah',
      upvotes: { 'michael': true },
      createdAt: '2025-01-15'
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'cost'>('recent');

  // Get all unique tags
  const allTags = Array.from(new Set(ideas.flatMap(idea => idea.tags)));

  // Filter and sort ideas
  const filteredIdeas = ideas
    .filter(idea => {
      const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           idea.preparation?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => idea.tags.includes(tag));
      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return Object.keys(b.upvotes).length - Object.keys(a.upvotes).length;
        case 'cost':
          return (a.estimatedCost || 0) - (b.estimatedCost || 0);
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleUpvote = (ideaId: string) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id === ideaId) {
        const userId = 'current-user'; // Mock current user ID
        const newUpvotes = { ...idea.upvotes };
        
        if (newUpvotes[userId]) {
          delete newUpvotes[userId];
        } else {
          newUpvotes[userId] = true;
        }
        
        return { ...idea, upvotes: newUpvotes };
      }
      return idea;
    }));
  };

  const formatCost = (cents?: number) => {
    if (!cents) return 'Free';
    return `$${(cents / 100).toFixed(0)}`;
  };

  const formatTime = (minutes?: number) => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Date Ideas</h2>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-[#D4AF37] hover:bg-[#B8941F] text-black"
          data-testid="button-add-idea"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Idea
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-neutral-800 border-neutral-600 text-white"
            data-testid="input-search-ideas"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-800 border border-neutral-600 rounded-md px-3 py-2 text-white text-sm"
              data-testid="select-sort-ideas"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="cost">Lowest Cost</option>
            </select>
          </div>

          <div className="flex-1 flex items-center gap-2 overflow-x-auto">
            <Tag className="h-4 w-4 text-neutral-400 flex-shrink-0" />
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer whitespace-nowrap",
                  selectedTags.includes(tag) 
                    ? "bg-[#D4AF37] text-black hover:bg-[#B8941F]" 
                    : "border-neutral-600 text-neutral-400 hover:text-white"
                )}
                onClick={() => toggleTag(tag)}
                data-testid={`tag-${tag}`}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIdeas.map(idea => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onUpvote={handleUpvote}
              formatCost={formatCost}
              formatTime={formatTime}
            />
          ))}
        </div>

        {filteredIdeas.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400 mb-2">No ideas found</p>
            <p className="text-sm text-neutral-500">
              {searchQuery || selectedTags.length > 0
                ? 'Try adjusting your search or filters'
                : 'Add your first date idea to get started!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface IdeaCardProps {
  idea: DateIdea;
  onUpvote: (id: string) => void;
  formatCost: (cents?: number) => string;
  formatTime: (minutes?: number) => string;
}

function IdeaCard({ idea, onUpvote, formatCost, formatTime }: IdeaCardProps) {
  const upvoteCount = Object.keys(idea.upvotes).length;
  const isUpvoted = idea.upvotes['current-user']; // Mock current user check

  return (
    <Card className="bg-neutral-800 border-neutral-700 p-4 hover:border-[#D4AF37]/30 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white text-sm group-hover:text-[#D4AF37] transition-colors">
          {idea.title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpvote(idea.id)}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
              isUpvoted 
                ? "bg-[#D4AF37] text-black" 
                : "bg-neutral-700 text-neutral-400 hover:text-white"
            )}
            data-testid={`button-upvote-${idea.id}`}
          >
            <Heart className="h-3 w-3" fill={isUpvoted ? "currentColor" : "none"} />
            {upvoteCount}
          </button>
          <MoreVertical className="h-4 w-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Time and Cost */}
      <div className="flex items-center gap-4 mb-3 text-sm text-neutral-400">
        {idea.estimatedTimeMinutes && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(idea.estimatedTimeMinutes)}
          </div>
        )}
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          {formatCost(idea.estimatedCost)}
        </div>
      </div>

      {/* Preparation */}
      {idea.preparation && (
        <p className="text-neutral-300 text-sm mb-3 line-clamp-2">
          {idea.preparation}
        </p>
      )}

      {/* Tags */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 flex-wrap">
          {idea.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-white/5 text-neutral-400 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
          {idea.tags.length > 3 && (
            <span className="text-xs text-neutral-500">
              +{idea.tags.length - 3}
            </span>
          )}
        </div>

        <Button
          size="sm"
          variant="outline"
          className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
          data-testid={`button-add-to-calendar-${idea.id}`}
        >
          <Calendar className="h-3 w-3 mr-1" />
          Schedule
        </Button>
      </div>

      {/* Created by */}
      <div className="mt-3 pt-3 border-t border-neutral-700 text-xs text-neutral-500">
        Added by {idea.createdBy} • {new Date(idea.createdAt).toLocaleDateString()}
      </div>
    </Card>
  );
}