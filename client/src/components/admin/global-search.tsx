import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, Users, Ticket, FileText, Shield, 
  Activity, Calendar, DollarSign, Eye, Clock,
  Hash, Mail, Globe, Zap
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'user' | 'coupon' | 'article' | 'audit' | 'plan';
  title: string;
  subtitle?: string;
  metadata?: string;
  timestamp?: string;
  status?: string;
  url: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GlobalSearch({ isOpen, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Search across all admin resources
  const { data: results = [], isLoading } = useQuery({
    queryKey: ['/api/admin/search', query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      
      try {
        const response = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        return data.results as SearchResult[];
      } catch (error) {
        console.error('Global search error:', error);
        return [];
      }
    },
    enabled: query.length >= 2,
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onOpenChange(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onOpenChange]);

  const handleResultClick = (result: SearchResult) => {
    // Navigate to the result URL
    if (result.url.startsWith('/admin/')) {
      window.location.hash = result.url;
    } else {
      window.open(result.url, '_blank');
    }
    onOpenChange(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4 text-blue-500" />;
      case 'coupon': return <Ticket className="h-4 w-4 text-green-500" />;
      case 'article': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'audit': return <Shield className="h-4 w-4 text-red-500" />;
      case 'plan': return <DollarSign className="h-4 w-4 text-orange-500" />;
      default: return <Hash className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-blue-100 text-blue-800';
      case 'coupon': return 'bg-green-100 text-green-800';
      case 'article': return 'bg-purple-100 text-purple-800';
      case 'audit': return 'bg-red-100 text-red-800';
      case 'plan': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (result: SearchResult) => {
    if (!result.status) return null;
    
    const statusColors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      expired: 'bg-red-100 text-red-800',
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-blue-100 text-blue-800',
    };

    return (
      <Badge className={statusColors[result.status] || 'bg-gray-100 text-gray-800'}>
        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Global Search
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 pt-4 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={inputRef}
              placeholder="Search users, coupons, articles, logs... (⌘K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4"
              data-testid="input-global-search"
            />
          </div>

          {/* Search Hints */}
          {query.length === 0 && (
            <div className="text-sm text-gray-500 space-y-2">
              <p><strong>Search across all admin resources:</strong></p>
              <div className="grid grid-cols-2 gap-2">
                <div>• Users by name or email</div>
                <div>• Coupons by code</div>
                <div>• Articles by title or content</div>
                <div>• Audit logs by action</div>
              </div>
              <p className="text-xs">Use ↑↓ arrow keys to navigate, Enter to select</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && query.length >= 2 && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-gray-500">Searching...</span>
            </div>
          )}

          {/* No Results */}
          {!isLoading && query.length >= 2 && results.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
              <p className="text-xs mt-1">Try different keywords or check spelling</p>
            </div>
          )}

          {/* Search Results */}
          {results.length > 0 && (
            <ScrollArea className="max-h-96">
              <div className="space-y-1">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      index === selectedIndex 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleResultClick(result)}
                    data-testid={`search-result-${result.type}-${result.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getTypeIcon(result.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">{result.title}</h4>
                            <Badge className={getTypeColor(result.type)}>
                              {result.type.toUpperCase()}
                            </Badge>
                            {getStatusBadge(result)}
                          </div>
                          {result.subtitle && (
                            <p className="text-xs text-gray-600 mb-1">{result.subtitle}</p>
                          )}
                          {result.metadata && (
                            <p className="text-xs text-gray-500">{result.metadata}</p>
                          )}
                        </div>
                      </div>
                      {result.timestamp && (
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(result.timestamp), 'MMM dd')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Keyboard Shortcuts */}
          <div className="border-t pt-3 text-xs text-gray-500 flex justify-between">
            <span>Press ⌘K to open search anytime</span>
            <span>↑↓ Navigate • Enter Select • Esc Close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook for global keyboard shortcut
export function useGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
}