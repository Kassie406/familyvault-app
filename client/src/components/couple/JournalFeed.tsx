import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus,
  Search,
  Filter,
  Heart,
  Camera,
  MapPin,
  Calendar,
  Tag,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface JournalEntry {
  id: string;
  occurredOn: string;
  text: string;
  mediaUrls: string[];
  tags: string[];
  authorId: string;
  authorName: string;
  createdAt: string;
}

interface JournalFeedProps {
  className?: string;
}

export function JournalFeed({ className }: JournalFeedProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      occurredOn: '2025-01-25',
      text: 'Had the most amazing dinner at that new Italian place downtown. The pasta was incredible, and we spent hours just talking and laughing. These are the moments I want to remember forever. ❤️',
      mediaUrls: ['https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400'],
      tags: ['date-night', 'restaurant', 'romantic'],
      authorId: 'sarah',
      authorName: 'Sarah',
      createdAt: '2025-01-25T22:30:00'
    },
    {
      id: '2',
      occurredOn: '2025-01-20',
      text: 'Surprise picnic in the park today! Michael set up everything with fairy lights and our favorite snacks. Even brought the bluetooth speaker for our playlist. Perfect Saturday afternoon together.',
      mediaUrls: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
      tags: ['surprise', 'picnic', 'outdoors', 'music'],
      authorId: 'michael',
      authorName: 'Michael',
      createdAt: '2025-01-20T18:45:00'
    },
    {
      id: '3',
      occurredOn: '2025-01-15',
      text: 'Movie marathon Sunday - we watched three romantic comedies back to back with homemade popcorn and wine. Sometimes the best dates are the simplest ones at home.',
      mediaUrls: [],
      tags: ['cozy', 'movies', 'home', 'wine'],
      authorId: 'sarah',
      authorName: 'Sarah',
      createdAt: '2025-01-15T21:15:00'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Get all unique tags
  const allTags = Array.from(new Set(entries.flatMap(entry => entry.tags)));

  // Filter entries
  const filteredEntries = entries
    .filter(entry => {
      const matchesSearch = entry.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => entry.tags.includes(tag));
      return matchesSearch && matchesTags;
    })
    .sort((a, b) => new Date(b.occurredOn).getTime() - new Date(a.occurredOn).getTime());

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const openImageViewer = (entry: JournalEntry, imageIndex: number) => {
    setSelectedEntry(entry);
    setSelectedImageIndex(imageIndex);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedEntry || selectedImageIndex === null) return;
    
    const maxIndex = selectedEntry.mediaUrls.length - 1;
    if (direction === 'prev') {
      setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : maxIndex);
    } else {
      setSelectedImageIndex(selectedImageIndex < maxIndex ? selectedImageIndex + 1 : 0);
    }
  };

  const closeImageViewer = () => {
    setSelectedEntry(null);
    setSelectedImageIndex(null);
  };

  return (
    <>
      <div className={cn("h-full flex flex-col", className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Our Journal</h2>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-[#D4AF37] hover:bg-[#B8941F] text-black"
            data-testid="button-add-memory"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Memory
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-neutral-800 border-neutral-600 text-white"
              data-testid="input-search-journal"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto">
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
                  data-testid={`journal-tag-${tag}`}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Journal Entries */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {filteredEntries.map(entry => (
            <Card key={entry.id} className="bg-neutral-800 border-neutral-700 p-6">
              {/* Entry Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(entry.occurredOn)}</span>
                      <span>•</span>
                      <span>by {entry.authorName}</span>
                    </div>
                  </div>
                </div>
                <MoreVertical className="h-4 w-4 text-neutral-400 hover:text-white cursor-pointer" />
              </div>

              {/* Entry Content */}
              <div className="mb-4">
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                  {entry.text}
                </p>
              </div>

              {/* Media Gallery */}
              {entry.mediaUrls.length > 0 && (
                <div className="mb-4">
                  <div className={cn(
                    "grid gap-2",
                    entry.mediaUrls.length === 1 && "grid-cols-1",
                    entry.mediaUrls.length === 2 && "grid-cols-2",
                    entry.mediaUrls.length >= 3 && "grid-cols-3"
                  )}>
                    {entry.mediaUrls.slice(0, 6).map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => openImageViewer(entry, index)}
                      >
                        <img
                          src={url}
                          alt={`Memory ${index + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        {index === 5 && entry.mediaUrls.length > 6 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-medium">
                              +{entry.mediaUrls.length - 6}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="absolute bottom-2 right-2 h-4 w-4 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {entry.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {entry.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white/5 text-neutral-400 text-xs rounded cursor-pointer hover:bg-white/10"
                      onClick={() => toggleTag(tag)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}

          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 mb-2">No memories found</p>
              <p className="text-sm text-neutral-500">
                {searchQuery || selectedTags.length > 0
                  ? 'Try adjusting your search or filters'
                  : 'Start capturing your special moments together!'}
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="mt-4 bg-[#D4AF37] hover:bg-[#B8941F] text-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Memory
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Image Viewer Modal */}
      {selectedEntry && selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeImageViewer}
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation */}
            {selectedEntry.mediaUrls.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 text-white hover:bg-white/10"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 text-white hover:bg-white/10"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Image */}
            <img
              src={selectedEntry.mediaUrls[selectedImageIndex]}
              alt={`Memory ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Counter */}
            {selectedEntry.mediaUrls.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-white text-sm">
                {selectedImageIndex + 1} of {selectedEntry.mediaUrls.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}