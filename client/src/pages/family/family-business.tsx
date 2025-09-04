import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { MoreHorizontal, Check, X } from 'lucide-react';
import CardActions from "@/components/card-actions";

type Manager = {
  id: string;
  name: string;
  role?: string;
  itemCount?: number;
  initials?: string;
};

function MenuItem({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-white/5 transition"
    >
      {children}
    </button>
  );
}

export default function FamilyBusiness() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [pageTitle, setPageTitle] = useState('Business');
  const [tempTitle, setTempTitle] = useState('Business');
  const [, setLocation] = useLocation();
  const addRef = useRef<HTMLButtonElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);

    (async () => {
      try {
        setError(null);
        console.log('Fetching business managers...');
        
        const res = await fetch("/api/business/managers", {
          signal: ctrl.signal,
          credentials: "include",
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json().catch(() => ({}));
        console.log('API response:', data);
        
        const raw = Array.isArray(data) ? data : (data?.items ?? data?.managers ?? []);
        const mapped: Manager[] = raw.map((m: any, i: number) => ({
          id: String(m.id ?? m.managerId ?? i),
          name: String(m.name ?? m.fullName ?? "Unnamed"),
          role: m.role ?? m.title ?? "Manager",
          itemCount: Number(m.itemCount ?? m.itemsCount ?? m.count ?? 0),
          initials: m.initials ?? m.name?.split(" ").map((s: string) => s[0]).slice(0, 2).join("") ?? "??",
        }));
        
        console.log('Mapped managers:', mapped);
        setManagers(mapped);
      } catch (e: any) {
        console.error('Error fetching managers:', e);
        setError(e?.name === "AbortError" ? "Request timed out." : (e?.message || "Failed to load managers."));
        
        // Fallback to default managers on error
        setManagers([
          { id: "angel", name: "Angel Johnson", role: "Managing Member", itemCount: 5, initials: "AJ" },
          { id: "kassandra", name: "Kassandra Johnson", role: "Operations Director", itemCount: 2, initials: "KJ" },
          { id: "family", name: "Family Shared", role: "Joint Ownership", itemCount: 2, initials: "FS" }
        ]);
      } finally {
        clearTimeout(t);
        setLoading(false);
      }
    })();

    // Keep the + popover from closing when clicking it again
    const onDocClick = (ev: MouseEvent) => {
      if (!addRef.current) return;
      const target = ev.target as Node;
      const clickedButton = addRef.current.contains(target);
      const clickedMenu = document.getElementById("business-add-menu")?.contains(target);
      // Only close if click was outside both button and menu
      if (!clickedButton && !clickedMenu) setAddOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    
    return () => {
      ctrl.abort();
      clearTimeout(t);
      document.removeEventListener("mousedown", onDocClick);
    };
  }, []);

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

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return managers;
    return managers.filter(m =>
      m.name.toLowerCase().includes(needle) ||
      (m.role ?? "").toLowerCase().includes(needle)
    );
  }, [q, managers]);

  const totalItems = managers.reduce((sum, manager) => sum + (manager.itemCount || 0), 0);

  // Avatar colors for managers
  const avatarColors: Record<string, string> = {
    'angel': '#D4AF37',
    'kassandra': '#9333EA', 
    'family': '#059669'
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 -mx-6 border-b border-white/8 bg-black/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-3">
          <div className="flex items-center gap-3">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  className="text-[28px] font-semibold tracking-tight text-white bg-transparent border-b-2 border-[#D4AF37] outline-none focus:border-[#D4AF37] min-w-0"
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
                <h1 className="text-[28px] font-semibold tracking-tight text-white" data-testid="text-page-title">{pageTitle}</h1>
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

          <div className="grow" />

          {/* Search */}
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search managers or business items..."
            className="w-[420px] rounded-full bg-white/6 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400/25 text-white placeholder:text-white/40"
            data-testid="input-search"
          />
        </div>
      </div>

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
              aria-controls="business-add-menu"
              data-testid="button-add-business"
            >
              + Add Business Item
            </button>

            {addOpen && (
              <div
                id="business-add-menu"
                className="absolute left-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#101217] p-2 shadow-xl z-30"
                data-testid="menu-add-options"
              >
                <div className="px-3 py-2 text-xs text-white/50">Create</div>
                <MenuItem onClick={() => setAddOpen(false)}>Business Manager</MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Company / Entity</MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Contract / Agreement</MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>License / Permit</MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Business Insurance</MenuItem>
                <div className="px-3 py-2 text-xs text-white/50">Import</div>
                <MenuItem onClick={() => setAddOpen(false)}>Import from file…</MenuItem>
              </div>
            )}
          </div>

          {/* Metrics pill */}
          <div className="flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1.5 rounded-full" data-testid="text-manager-count">
            <span className="text-sm font-medium">
              🔔 {managers.length} managers • {totalItems} total items
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* States */}
        {loading && (
          <div className="py-16 text-center text-white/60" data-testid="loading-state">
            Loading business managers…
          </div>
        )}

        {!loading && error && (
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200" data-testid="error-state">
            {error}{" "}
            <button
              className="ml-2 underline hover:no-underline"
              onClick={() => window.location.reload()}
              data-testid="button-retry"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70" data-testid="empty-state">
            No managers found. Click <span className="text-amber-300">+ Add</span> to create one.
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="managers-grid">
            {filtered.map(m => (
              <div
                key={m.id}
                className="group rounded-2xl border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 hover:border-white/12 transition cursor-pointer"
                onClick={() => setLocation(`/family/business/${m.id}`)}
                data-testid={`manager-card-${m.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="grid size-12 place-items-center rounded-full text-black font-semibold text-sm"
                      style={{ backgroundColor: avatarColors[m.id] || '#D4AF37' }}
                    >
                      {m.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-white group-hover:text-[#D4AF37] transition-colors">
                        {m.name}
                      </div>
                      <div className="text-xs text-white/60">{m.role}</div>
                      <div className="text-xs text-white/50">{m.itemCount ?? 0} items</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation(`/family/business/${m.id}`);
                      }}
                      className="rounded-lg bg-white/10 px-2 py-1 text-xs hover:bg-white/20 transition"
                      data-testid={`button-view-${m.id}`}
                    >
                      View
                    </button>
                    <div onClick={(e) => e.stopPropagation()}>
                      <CardActions
                        id={m.id}
                        kind="manager"
                        name={m.name}
                        onAction={(action) => {
                          if (action === "view") {
                            setLocation(`/family/business/${m.id}`);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}