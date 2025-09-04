import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocation } from "wouter";

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

  useEffect(() => { loadResources().then(setData); }, []);

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
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="px-6 pb-16">
        {/* Sticky header */}
        <div className="sticky top-0 z-20 -mx-6 mb-6 border-b border-white/8 bg-[rgb(7_8_10/0.85)] backdrop-blur supports-[backdrop-filter]:bg-black/60">
          <div className="px-6 py-4 flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-white" data-testid="text-page-title">Family Resources</h1>

            {/* spacer */}
            <div className="grow" />

            {/* Search */}
            <div className="relative w-[420px]">
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search resources, categories, or notes"
                className="w-full rounded-full bg-white/6 px-4 py-2 text-sm outline-none ring-0 focus:ring-2 focus:ring-amber-400/25 text-white placeholder:text-white/40"
                aria-label="Search family resources"
                data-testid="input-search"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                <ChevronDown className="size-4 rotate-180" />
              </span>
            </div>
          </div>

          {/* Tabs with pill slider */}
          <div className="px-6 pb-3">
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