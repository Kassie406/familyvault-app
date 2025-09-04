import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, UserPlus, Shield, Lock, Search, HelpCircle, MoreHorizontal, Check, X } from 'lucide-react';
import { LuxuryCard } from '@/components/luxury-cards';

// Enhanced Manager type
type Manager = {
  id: string;
  name: string;          // e.g. "Angel"
  label: string;         // e.g. "Angel's Password Manager"
  items: number;         // number of credentials
  lastUpdated?: string;  // ISO date
  restricted?: boolean;  // requires elevated access
};

const managersData: Manager[] = [
  { 
    id: "angel", 
    name: "Angel", 
    label: "Angel's Password Manager", 
    items: 12, 
    lastUpdated: "2025-01-04T17:08:00Z" 
  },
  { 
    id: "kassandra", 
    name: "Kassandra", 
    label: "Kassandra's Password Manager", 
    items: 9, 
    lastUpdated: "2025-01-03T13:00:00Z" 
  },
];

export default function FamilyPasswords() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [owner, setOwner] = useState("all");
  const [sort, setSort] = useState<"az" | "items" | "recent">("az");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [pageTitle, setPageTitle] = useState('Passwords');
  const [tempTitle, setTempTitle] = useState('Passwords');

  const titleInputRef = useRef<HTMLInputElement>(null);

  const managers = useMemo(() => {
    let list = managersData;

    // Filter by owner
    if (owner !== "all") {
      list = list.filter(m => m.name.toLowerCase() === owner);
    }

    // Search filter
    if (query.trim()) {
      const searchKey = query.toLowerCase();
      list = list.filter(m =>
        m.label.toLowerCase().includes(searchKey) || 
        m.name.toLowerCase().includes(searchKey)
      );
    }

    // Sort
    if (sort === "az") {
      list = [...list].sort((a, b) => a.label.localeCompare(b.label));
    } else if (sort === "items") {
      list = [...list].sort((a, b) => b.items - a.items);
    } else if (sort === "recent") {
      list = [...list].sort((a, b) => 
        new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime()
      );
    }

    return list;
  }, [query, owner, sort]);

  const navigateToManager = (managerId: string) => {
    setLocation(`/family/passwords/manager/${managerId}`);
  };

  // Handle escape key for title editing
  useEffect(() => {
    if (!isEditingTitle) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditingTitle(false);
        setTempTitle(pageTitle);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEditingTitle, pageTitle]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleEditTitle = () => {
    setTempTitle(pageTitle);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      setPageTitle(tempTitle.trim());
    } else {
      setTempTitle(pageTitle);
    }
    setIsEditingTitle(false);
  };

  const handleCancelEdit = () => {
    setTempTitle(pageTitle);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-900)]">
      {/* Header */}
      <LuxuryCard className="border-b border-[var(--line-700)] px-8 py-6 rounded-none"
        style={{
          background: 'linear-gradient(135deg, #161616 0%, #0F0F0F 100%)',
          borderRadius: '0'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-3">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    className="text-3xl font-bold text-white bg-transparent border-b-2 border-[#D4AF37] outline-none focus:border-[#D4AF37] min-w-0"
                    style={{ background: 'transparent' }}
                    data-testid="title-input"
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="p-1 text-green-400 hover:text-green-300 transition-colors"
                    data-testid="save-title-button"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    data-testid="cancel-title-button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-white shrink-0" data-testid="page-title">{pageTitle}</h1>
                  <button
                    onClick={handleEditTitle}
                    className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                    data-testid="edit-title-button"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ink-400)] h-4 w-4" />
              <input
                type="text"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] w-64"
                data-testid="search-passwords"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-[var(--ink-300)] hover:text-[var(--gold)]">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
            <div className="w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center">
              <span className="text-black text-sm font-medium">KC</span>
            </div>
          </div>
        </div>
      </LuxuryCard>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-8 py-8 text-[#F4F4F6]">
        {/* Page Description */}
        <div className="mb-6">
          <p className="text-sm text-neutral-400">Select a manager to view their vault.</p>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-6">
        {/* Owner Filter */}
        <div className="md:col-span-3">
          <Select value={owner} onValueChange={setOwner}>
            <SelectTrigger className="h-9 bg-[#13141B] border-[#232530] text-neutral-300">
              <SelectValue placeholder="Filter by owner" />
            </SelectTrigger>
            <SelectContent className="bg-[#0F0F0F] border-[#232530]">
              <SelectItem value="all">All owners</SelectItem>
              <SelectItem value="angel">Angel</SelectItem>
              <SelectItem value="kassandra">Kassandra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="md:col-span-3">
          <Select value={sort} onValueChange={(v) => setSort(v as any)}>
            <SelectTrigger className="h-9 bg-[#13141B] border-[#232530] text-neutral-300">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="bg-[#0F0F0F] border-[#232530]">
              <SelectItem value="az">A–Z</SelectItem>
              <SelectItem value="items">Most items</SelectItem>
              <SelectItem value="recent">Recently updated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

        {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button className="rounded-full bg-[#D4AF37] text-black hover:bg-[#c6a02e]">
          <Plus className="h-4 w-4 mr-2" /> Add Manager
        </Button>
        <Button variant="outline" className="rounded-full border-[#232530] bg-[#121319] hover:bg-[#171822] text-neutral-300">
          <UserPlus className="h-4 w-4 mr-2" /> Invite Family Member
        </Button>
      </div>

        {/* Manager Cards or Empty State */}
        {managers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {managers.map((manager) => (
              <ManagerCard key={manager.id} manager={manager} onClick={() => navigateToManager(manager.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ManagerCard({ manager, onClick }: { manager: Manager; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        group block rounded-2xl border border-[#232530]
        bg-gradient-to-b from-[#161616] to-[#0F0F0F]
        shadow-[0_10px_28px_rgba(0,0,0,0.45)]
        hover:-translate-y-0.5 hover:border-[#D4AF37]
        hover:shadow-[0_16px_40px_rgba(212,175,55,0.12)]
        transition-all focus:outline-none focus-visible:outline-none
        text-left w-full
      "
      data-testid={`button-manager-${manager.id}`}
    >
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="h-10 w-10 grid place-items-center rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#232530]">
          <Shield className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium text-white">{manager.label}</div>
          <div className="mt-0.5 text-xs text-neutral-400">
            + {manager.items} items pre-populated
            {manager.lastUpdated && (
              <span className="ml-2 text-neutral-500">
                • updated {new Date(manager.lastUpdated).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        {manager.restricted && (
          <div className="flex items-center gap-1 text-xs text-neutral-400">
            <Lock className="h-3.5 w-3.5" /> Restricted
          </div>
        )}
      </div>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-[#232530] bg-[#0F0F0F] p-8 text-center">
      <div className="text-lg font-medium text-white">No managers yet</div>
      <p className="mt-1 text-sm text-neutral-400">
        Invite a family member or add a manager to start organizing credentials.
      </p>
      <div className="mt-4 flex justify-center gap-3">
        <Button className="rounded-full bg-[#D4AF37] text-black hover:bg-[#c6a02e]">
          <Plus className="h-4 w-4 mr-2" /> Add Manager
        </Button>
        <Button variant="outline" className="rounded-full border-[#232530] bg-[#121319] hover:bg-[#171822] text-neutral-300">
          <UserPlus className="h-4 w-4 mr-2" /> Invite Family Member
        </Button>
      </div>
    </div>
  );
}