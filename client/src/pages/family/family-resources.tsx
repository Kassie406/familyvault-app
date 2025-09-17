import { useEffect, useMemo, useState, useRef } from "react";
import { ChevronDown, MoreHorizontal, Check, X, Search, HelpCircle } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from '@/components/ui/button';
import { LuxuryCard } from '@/components/luxury-cards';

/** TYPES */
type Resource = {
  id: string;
  title: string;
  category: "Document" | "Checklist" | "Letter" | "Guide";
  subTitle?: string;
  createdAt: string;   // ISO
  updatedAt?: string;  // ISO
  icon?: string;       // optional emoji or icon key
  isTemplate?: boolean;
};

/** MOCK LOAD (replace with fetch('/api/resources?...')) */
async function loadResources(): Promise<Resource[]> {
  return [
    { id: "r1", title: "Birth Certificate - John Doe", category: "Document", subTitle: "Important Document", createdAt: "2024-01-15" },
    { id: "r2", title: "Emergency Kit Inventory",     category: "Checklist", subTitle: "Emergency Equipment", createdAt: "2024-01-10" },
    { id: "r3", title: "Letter to Sarah",             category: "Letter",    subTitle: "Letter to Loved One", createdAt: "2024-01-05" },
    // templates
    { id: "t1", title: "Household Binder Index (Template)", category: "Guide", isTemplate: true, createdAt: "2024-02-01" },
    { id: "t2", title: "Family Emergency Plan (Template)",  category: "Checklist", isTemplate: true, createdAt: "2024-02-04" },
  ];
}

const tabs = [
  { key: "created", label: "Created" },
  { key: "templates", label: "Templates" },
] as const;
type TabKey = typeof tabs[number]["key"];

/** CARD */
function ResourceCard({ r }: { r: Resource }) {
  const [, setLocation] = useLocation();

  return (
    <article
      className="group rounded-2xl border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 hover:border-white/12 transition shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
      role="listitem"
      data-testid={`resource-card-${r.id}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-amber-400/15 text-amber-300 text-sm">
            {r.icon ?? "📄"}
          </div>
          <div>
            <div className="font-medium leading-tight text-white">{r.title}</div>
            <div className="text-xs text-white/55">
              {r.subTitle ?? r.category} • Created {new Date(r.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-80">
          <button
            onClick={() => setLocation(`/family/resources/${r.id}`)}
            className="rounded-lg bg-white/6 px-3 py-1.5 text-sm hover:bg-white/10 text-white transition-colors"
            data-testid={`button-view-${r.id}`}
          >
            View
          </button>
          <button 
            className="rounded-lg bg-white/6 px-3 py-1.5 text-sm hover:bg-white/10 text-white transition-colors"
            data-testid={`button-edit-${r.id}`}
          >
            Edit
          </button>
          <button 
            className="rounded-lg bg-white/6 px-3 py-1.5 text-sm hover:bg-white/10 text-white transition-colors"
            data-testid={`button-share-${r.id}`}
          >
            Share
          </button>
          <button 
            className="rounded-lg bg-white/6 px-3 py-1.5 text-sm hover:bg-white/10 text-white transition-colors"
            data-testid={`button-more-${r.id}`}
          >
            ⋯
          </button>
        </div>
      </div>
    </article>
  );
}

/** PAGE */
export default function FamilyResources() {
  const [data, setData] = useState<Resource[]>([]);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<TabKey>("created");
  const [addOpen, setAddOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [pageTitle, setPageTitle] = useState('Family Resources');
  const [tempTitle, setTempTitle] = useState('Family Resources');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadResources().then(setData); }, []);

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

  const created = useMemo(() => data.filter(d => !d.isTemplate), [data]);
  const templates = useMemo(() => data.filter(d => !!d.isTemplate), [data]);

  const filtered = useMemo(() => {
    const list = tab === "created" ? created : templates;
    if (!q.trim()) return list;
    const needle = q.toLowerCase();
    return list.filter(r =>
      r.title.toLowerCase().includes(needle) ||
      (r.subTitle ?? "").toLowerCase().includes(needle) ||
      r.category.toLowerCase().includes(needle)
    );
  }, [tab, q, created, templates]);

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
                placeholder="Search resources, categories, or notes"
                value={q}
                onChange={(e) => setQ(e.target.value)}
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
          </div>
        </div>
      </LuxuryCard>

      {/* Content */}
      <div className="px-6 pb-16">
        {/* Tabs with pill slider */}
        <div className="px-6 py-6">
          <div className="relative inline-flex rounded-full bg-white/6 p-1" data-testid="tabs-container">
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`relative z-10 rounded-full px-4 py-1.5 text-sm transition ${
                    active ? "text-black" : "text-white/75 hover:text-white"
                  }`}
                  data-testid={`tab-${t.key}`}
                >
                  {t.label}
                </button>
              );
            })}
            <span
              className={`absolute inset-y-1 w-28 rounded-full bg-amber-400 transition-[left]`}
              style={{ left: tab === "created" ? 4 : 4 + 112 }}
              aria-hidden
            />
          </div>
        </div>

        {/* Add Button and Recommended Items Section */}
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center gap-4">
            {/* Persistent + menu */}
            <div className="relative">
              <button
                aria-label="Add Resource"
                onClick={() => setAddOpen(o => !o)}
                className="h-9 px-4 rounded-lg bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 transition gap-2 flex items-center"
                data-testid="button-add-resource"
              >
                + Add Resource
              </button>
              {addOpen && (
                <div
                  className="absolute left-0 z-30 mt-2 w-64 rounded-xl border border-white/10 bg-[#0b0d11]/95 shadow-xl backdrop-blur"
                  role="menu"
                  data-testid="menu-add-options"
                >
                  {[
                    { label: "New Document", icon: "📄" },
                    { label: "New Checklist", icon: "✅" },
                    { label: "New Letter", icon: "✉️" },
                    { label: "New Guide", icon: "📘" },
                    { label: "Import from Template", icon: "✨" },
                  ].map(opt => (
                    <button
                      key={opt.label}
                      className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-white/5 rounded-lg text-white"
                      onClick={() => setAddOpen(false)}
                      data-testid={`button-${opt.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <span className="text-base">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Items */}
            <div className="flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1.5 rounded-full">
              <span className="text-sm font-medium">
                🔔 {data.length} recommended templates
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div role="list" className="mx-auto grid max-w-6xl gap-3" data-testid="resources-list">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/60" data-testid="empty-state">
              No {tab === "created" ? "created resources" : "templates"} found. Use the
              <span className="mx-1 rounded-full bg-amber-400/25 px-2 py-0.5 text-amber-200"> + </span>
              button to add a new one.
            </div>
          ) : (
            filtered.map(r => <ResourceCard key={r.id} r={r} />)
          )}
        </div>

        {/* Footer CTA */}
        <div className="mx-auto mt-8 max-w-6xl">
          <button
            onClick={() => setAddOpen(true)}
            className="w-full rounded-full bg-amber-400 text-black py-3 font-medium hover:brightness-95 transition"
            data-testid="button-create-resource"
          >
            + Create New Resource
          </button>
        </div>
      </div>
    </div>
  );
}