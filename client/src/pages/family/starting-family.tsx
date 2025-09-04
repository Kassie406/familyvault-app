import { useMemo, useState, useRef } from "react";
import { Plus, Search, ChevronRight, Users as FamilyIcon, Heart, Baby, Shield, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

type SectionKey = "planning" | "pregnancy" | "financial" | "support" | "medical" | "preparation";

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

export default function StartingFamily() {
  // Mock data - replace with real fetch
  const [sections] = useState<Section[]>([
    {
      key: "planning",
      title: "Family Planning",
      desc: "Healthcare providers, fertility information & planning resources",
      icon: <Calendar className="h-4 w-4" />,
      count: 0,
      href: "/family/starting-family/planning",
    },
    {
      key: "pregnancy",
      title: "Pregnancy & Birth",
      desc: "Medical records, birth plans & pregnancy tracking information",
      icon: <Baby className="h-4 w-4" />,
      count: 0,
      href: "/family/starting-family/pregnancy",
    },
    {
      key: "financial",
      title: "Financial Planning",
      desc: "Budget planning, insurance & family financial preparation",
      icon: <Shield className="h-4 w-4" />,
      count: 0,
      href: "/family/starting-family/financial",
    },
    {
      key: "support",
      title: "Support Network",
      desc: "Family support contacts, parenting resources & community connections",
      icon: <Heart className="h-4 w-4" />,
      count: 0,
      href: "/family/starting-family/support",
    },
    {
      key: "medical",
      title: "Medical Records",
      desc: "Health information, vaccinations & pediatric care documentation",
      icon: <FileText className="h-4 w-4" />,
      count: 0,
      href: "/family/starting-family/medical",
    },
    {
      key: "preparation",
      title: "Baby Preparation",
      desc: "Nursery planning, baby items & preparation checklists",
      icon: <FamilyIcon className="h-4 w-4" />,
      count: 0,
      href: "/family/starting-family/preparation",
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
    const clickedMenu = document.getElementById("family-add-menu")?.contains(target);
    if (!clickedButton && !clickedMenu) setAddOpen(false);
  };

  useState(() => {
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  });

  const totalItems = sections.reduce((sum, section) => sum + section.count, 0);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 -mx-6 border-b border-white/8 bg-black/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-3">
          <h1 className="text-[28px] font-semibold tracking-tight text-white" data-testid="text-page-title">Starting a Family</h1>

          {/* Persistent + Add */}
          <div className="relative">
            <button
              ref={addRef}
              type="button"
              onClick={() => setAddOpen(v => !v)}
              className="h-8 rounded-full bg-amber-400/20 px-3 text-amber-200 hover:bg-amber-400/30 transition"
              aria-expanded={addOpen}
              aria-controls="family-add-menu"
              data-testid="button-add-family"
            >
              + Add
            </button>

            {addOpen && (
              <div
                id="family-add-menu"
                className="absolute left-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#101217] p-2 shadow-xl z-30"
                data-testid="menu-add-options"
              >
                <div className="px-3 py-2 text-xs text-white/50">Add to Family Planning</div>
                <MenuItem icon={<Calendar className="h-4 w-4" />} onClick={() => setAddOpen(false)}>
                  Planning Information
                </MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Pregnancy Record</MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Financial Plan</MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Support Contact</MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Medical Record</MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Baby Preparation</MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Healthcare Provider</MenuItem>
                <div className="px-3 py-2 text-xs text-white/50">Import</div>
                <MenuItem onClick={() => setAddOpen(false)}>Import medical records…</MenuItem>
                <MenuItem onClick={() => setAddOpen(false)}>Import from file…</MenuItem>
              </div>
            )}
          </div>

          {/* Metrics pill */}
          <div className="rounded-full bg-amber-400/15 px-3 py-1 text-sm text-amber-200" data-testid="text-section-count">
            {sections.length} sections • {totalItems} total items
          </div>

          <div className="grow" />

          {/* Search */}
          <div className="relative w-[420px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search family planning information…"
              className="w-full rounded-full bg-white/6 px-4 py-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-amber-400/25 text-white placeholder:text-white/40"
              data-testid="input-search"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <p className="text-white/60 text-sm">
            Organize all aspects of starting and growing your family with helpful resources and planning tools.
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
            <FamilyIcon className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Plan Your Growing Family</h3>
            <p className="text-white/60 max-w-md mx-auto mb-6">
              Organize all aspects of starting and growing your family with helpful resources and planning tools.
            </p>
            <Button 
              onClick={() => setAddOpen(true)}
              variant="gold"
              data-testid="button-get-started"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start Family Planning
            </Button>
          </div>
        )}

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}