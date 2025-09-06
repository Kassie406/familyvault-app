import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { MessageCircle, Plus, Users, Bell, Filter, Search, ArrowLeft, Settings } from 'lucide-react';
import { ThreadsList } from '@/components/ThreadsList';
import { NewMessageModal } from '@/components/messaging/NewMessageModal';

export default function MessagesPage() {
  const [, setLocation] = useLocation();
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [view, setView] = useState('threads');
  const [sortBy, setSortBy] = useState('latest');
  const [filterBy, setFilterBy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlView = params.get('view');
    const urlSort = params.get('sort');
    const urlFilter = params.get('filter');
    
    if (urlView) setView(urlView);
    if (urlSort) setSortBy(urlSort);
    if (urlFilter) setFilterBy(urlFilter);
  }, []);

  const quickActions = [
    {
      id: 'new-message',
      label: 'New Message',
      icon: Plus,
      action: () => setNewMessageOpen(true),
      color: 'bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-black'
    },
    {
      id: 'family-chat',
      label: 'Family Group Chat',
      icon: Users,
      action: () => {/* Navigate to family thread */},
      color: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      id: 'mentions',
      label: 'Mentions & Alerts',
      icon: Bell,
      action: () => setFilterBy('mentions'),
      color: 'bg-red-600 hover:bg-red-700 text-white'
    }
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest Activity' },
    { value: 'unread', label: 'Unread First' },
    { value: 'alphabetical', label: 'Alphabetical' },
  ];

  const filterOptions = [
    { value: 'all', label: 'All Messages' },
    { value: 'unread', label: 'Unread Only' },
    { value: 'mentions', label: 'Mentions & Alerts' },
    { value: 'today', label: 'Today\'s Messages' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A1A] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLocation('/family')}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                data-testid="button-back-to-dashboard"
              >
                <ArrowLeft className="h-5 w-5 text-white/70" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Messages</h1>
                  <p className="text-sm text-white/60">Family conversations</p>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setNewMessageOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-black font-medium rounded-lg transition-colors"
                data-testid="button-new-message"
              >
                <Plus className="h-4 w-4" />
                New Message
              </button>
              
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Settings className="h-5 w-5 text-white/70" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-[#D4AF37]" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`p-4 rounded-xl border border-white/10 hover:border-[#D4AF37]/30 transition-all group ${action.color}`}
                  data-testid={`quick-action-${action.id}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{action.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {/* View Toggle */}
              <div className="flex bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setView('threads')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    view === 'threads' 
                      ? 'bg-[#D4AF37] text-black' 
                      : 'text-white/70 hover:text-white'
                  }`}
                  data-testid="view-threads"
                >
                  Threads
                </button>
                <button
                  onClick={() => setView('all')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    view === 'all' 
                      ? 'bg-[#D4AF37] text-black' 
                      : 'text-white/70 hover:text-white'
                  }`}
                  data-testid="view-all"
                >
                  All Messages
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                data-testid="sort-selector"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Filter Dropdown */}
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 py-1.5 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                data-testid="filter-selector"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37] w-full sm:w-80"
                data-testid="search-input"
              />
            </div>
          </div>
        </div>

        {/* Filter indicator */}
        {filterBy !== 'all' && (
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-sm text-white/70">
              Showing: {filterOptions.find(f => f.value === filterBy)?.label}
            </span>
            <button
              onClick={() => setFilterBy('all')}
              className="text-sm text-[#D4AF37] hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Messages Content */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {view === 'threads' ? 'Conversation Threads' : 'All Messages'}
            </h2>
            <span className="text-sm text-white/60">
              {sortBy === 'latest' ? 'Latest activity first' : 
               sortBy === 'unread' ? 'Unread messages first' : 
               'Alphabetical order'}
            </span>
          </div>

          {/* ThreadsList Component */}
          <ThreadsList />
        </div>
      </div>

      {/* New Message Modal */}
      <NewMessageModal 
        open={newMessageOpen}
        onClose={() => setNewMessageOpen(false)}
      />
    </div>
  );
}