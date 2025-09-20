import { useMemo, useState, useRef, useEffect } from "react";
import { Plus, Search, ChevronRight, AlertTriangle, MapPin, Radio, Heart, Shield, MessageCircle, MoreHorizontal, Check, X, HelpCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { LuxuryCard } from '@/components/luxury-cards';

type SectionKey = "contacts" | "evacuation" | "supplies" | "medical" | "communication" | "insurance";

type Section = {
  key: SectionKey;
  title: string;
  desc: string;
  icon: React.ReactNode;
  count: number;
  href: string;
};

function MenuItem({
  onClick,
  icon,
  children,
}: {
  onClick?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-white/5 transition"
    >
      <span className="text-white/70">{icon}</span>
      <span>{children}</span>
    </button>
  );
}

function SectionCard({ section }: { section: Section }) {
  const [, setLocation] = useLocation();
  
  return (
    <article className="group rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 hover:border-white/12 transition shadow-[0_10px_28px_rgba(0,0,0,0.45)] hover:shadow-[0_16px_40px_rgba(212,175,55,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]/30">
            <span className="text-[#D4AF37]">{section.icon}</span>
          </div>
          <div className="min-w-0">
            <div className="truncate text-[15px] font-medium text-white">{section.title}</div>
            <div className="truncate text-xs text-white/60">{section.desc}</div>
          </div>
        </div>

        <button
          onClick={() => setLocation(section.href)}
          className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white hover:bg-white/10 transition"
          data-testid={`button-view-${section.key}`}
        >
          View
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-3 text-xs text-white/60">{section.count} items</div>
    </article>
  );
}

export default function DisasterPlanning() {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [pageTitle, setPageTitle] = useState('Disaster Planning');
  const [tempTitle, setTempTitle] = useState('Disaster Planning');
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // Mock data - replace with real fetch
  const [sections] = useState<Section[]>([
    {
      key: "contacts",
      title: "Emergency Contacts",
      desc: "Family, authorities, utilities & emergency service numbers",
      icon: <Radio className="h-4 w-4" />,
      count: 0,
      href: "/family/disaster/contacts",
    },
    {
      key: "evacuation",
      title: "Evacuation Plans",
      desc: "Routes, meeting points & evacuation procedures",
      icon: <MapPin className="h-4 w-4" />,
      count: 0,
      href: "/family/disaster/evacuation",
    },
    {
      key: "supplies",
      title: "Emergency Supplies",
      desc: "Food, water, medical supplies & survival equipment inventory",
      icon: <Shield className="h-4 w-4" />,
      count: 0,
      href: "/family/disaster/supplies",
    },
    {
      key: "medical",
      title: "Medical Information",
      desc: "Medical conditions, medications & healthcare provider details",
      icon: <Heart className="h-4 w-4" />,
      count: 0,
      href: "/family/disaster/medical",
    },
    {
      key: "communication",
      title: "Communication Plans",
      desc: "Contact methods, check-in procedures & emergency alerts",
      icon: <MessageCircle className="h-4 w-4" />,
      count: 0,
      href: "/family/disaster/communication",
    },
    {
      key: "insurance",
      title: "Insurance & Legal",
      desc: "Insurance policies, legal documents & important papers",
      icon: <Shield className="h-4 w-4" />,
      count: 0,
      href: "/family/disaster/insurance",
    },
  ]);

  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const addRef = useRef<HTMLButtonElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections.filter(
      s =>
        s.title.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q)
    );
  }, [query, sections]);

  // Handle click outside to close menu
  const handleDocumentClick = (ev: MouseEvent) => {
    if (!addRef.current) return;
    const target = ev.target as Node;
    const clickedButton = addRef.current.contains(target);
    const clickedMenu = document.getElementById("disaster-add-menu")?.contains(target);
    if (!clickedButton && !clickedMenu) setAddOpen(false);
  };

  useState(() => {
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  });

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

  const totalItems = sections.reduce((sum, section) => sum + section.count, 0);

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
                placeholder="Search emergency information…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] w-64"
                data-testid="input-search"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-[var(--ink-300)] hover:text-[var(--gold)]">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
            
            <div className="w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center">
              <span className="text-black text-sm font-medium">KC</span>
            </div>
            
            {/* Notification Bell with Badge */}
            <button 
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => {
                // TODO: Open inbox/notifications
                console.log('Open notifications');
              }}
              data-testid="button-notifications"
            >
              <Bell className="h-5 w-5 text-white/70" />
              {/* Badge */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                3
              </span>
            </button>
          </div>
        </div>
      </LuxuryCard>

      {/* Content */}
      <div className="text-white">
        {/* Add Button and Recommended Items Section */}
        <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center gap-4">
          {/* Persistent + Add */}
          <div className="relative">
            <button
              ref={addRef}
              type="button"
              onClick={() => setAddOpen(v => !v)}
              className="h-9 px-4 rounded-lg bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 transition gap-2 flex items-center"
              aria-expanded={addOpen}
              aria-controls="disaster-add-menu"
              data-testid="button-add-disaster"
            >
              + Add Emergency Item
            </button>

            {addOpen && (
              <div
                id="disaster-add-menu"
                className="absolute left-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#101217] p-2 shadow-xl z-30"
                data-testid="menu-add-options"
              >
                <div className="px-3 py-2 text-xs text-white/50">Add to Emergency Plan</div>
                <MenuItem icon={<Radio className="h-4 w-4" />} onClick={() => setAddOpen(false)}>
                  Emergency Contact
                </MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Evacuation Route</MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Emergency Supply</MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Medical Information</MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Communication Plan</MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Insurance Policy</MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Important Document</MenuItem>
                <div className="px-3 py-2 text-xs text-white/50">Import</div>
                <MenuItem onClick={() => setAddOpen(false)}>Import emergency plan…</MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Import from file…</MenuItem>
              </div>
            )}
          </div>

          {/* Metrics pill */}
          <div className="flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1.5 rounded-full" data-testid="text-section-count">
            <span className="text-sm font-medium">
              🔔 {sections.length} sections • {totalItems} total items
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <p className="text-white/60 text-sm">
            Create comprehensive disaster and emergency plans to keep your family safe and prepared.
          </p>
        </div>

        {/* Sections grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="sections-grid">
          {filtered.map((s) => (
            <SectionCard key={s.key} section={s} />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="mt-20 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center" data-testid="empty-state">
            <div className="text-lg font-medium text-white">No matches</div>
            <div className="mt-1 text-sm text-white/60">
              Try a different search or add a new item with the button above.
            </div>
          </div>
        )}

        {/* Getting Started Section - only show if no items exist */}
        {totalItems === 0 && filtered.length > 0 && (
          <div className="mt-12 text-center" data-testid="getting-started">
            <AlertTriangle className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Prepare for Emergencies</h3>
            <p className="text-white/60 max-w-md mx-auto mb-6">
              Create comprehensive disaster and emergency plans to keep your family safe and prepared.
            </p>
            <Button 
              onClick={() => setAddOpen(true)}
              variant="gold"
              data-testid="button-get-started"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Emergency Plan
            </Button>
          </div>
        )}

        {/* Bottom spacing */}
        <div className="h-8" />
        </div>
      </div>
    </div>
  );
}
