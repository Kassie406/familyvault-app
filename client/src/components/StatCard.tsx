import React, {useEffect, useRef, useState} from "react";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";

type PreviewItem = {
  id: string;
  title: string;
  sub?: string;
  href?: string;
  thumbnailUrl?: string;
};

type StatCardProps = {
  label: string;             // e.g. "Family Members"
  value: number | string;    // e.g. 5
  href: string;              // where to go on click
  icon: React.ReactNode;     // icon element
  fetchPreview?: () => Promise<PreviewItem[]>; // called on button click
  emptyText?: string;        // fallback when no recent items
  dropdownActions?: { label: string; href?: string; onClick?: () => void; icon?: React.ReactNode }[]; // action menu items
};

export function StatCard({
  label,
  value,
  href,
  icon,
  fetchPreview,
  emptyText = "No recent activity",
  dropdownActions = [],
}: StatCardProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<PreviewItem[] | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click or ESC
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function ensurePreviewLoaded() {
    if (!fetchPreview || items !== null || loading) return;
    try {
      setLoading(true);
      const data = await fetchPreview();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  // Toggle preview and load data if needed
  function togglePreview() {
    setOpen(prev => !prev);
    if (!open) {
      void ensurePreviewLoaded();
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <Link
        href={href}
        className="group no-hover-bg block rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 to-zinc-950/70 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset] hover:shadow-xl hover:shadow-[#D4AF37]/10 hover:border-[#D4AF37]/30 focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all duration-300"
        aria-describedby={`${label.replace(/\s+/g, "-").toLowerCase()}-desc`}
        data-testid={`stat-card-${label.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {React.cloneElement(icon as React.ReactElement, {
              className: "h-6 w-6 text-amber-400/70 group-hover:text-amber-400 transition-colors"
            })}
            <span className="text-sm font-medium text-zinc-400 group-hover:text-amber-400 transition-colors" id={`${label.replace(/\s+/g, "-").toLowerCase()}-desc`}>
              {label}
            </span>
          </div>

          {/* The ONLY trigger for the preview */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`stat-preview-${label.replace(/\s+/g, "-").toLowerCase()}`}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1
                       text-xs font-medium text-zinc-400 hover:text-amber-400
                       focus:outline-none focus:ring-2 focus:ring-amber-400/40"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              togglePreview();
            }}
          >
            Recent
            <ChevronDown
              className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      </Link>

      {/* Anchored preview panel (no hover logic anywhere) */}
      <div
        id={`stat-preview-${label.replace(/\s+/g, "-").toLowerCase()}`}
        role="region"
        aria-label={`${label} — recent`}
        data-open={open ? "true" : "false"}
        className="
          pointer-events-auto absolute left-0 right-0 top-full z-20 mt-2
          rounded-xl border border-zinc-800/80 bg-zinc-950/95 backdrop-blur
          shadow-lg transition-all w-[28rem]
          opacity-0 translate-y-2 scale-[0.98] hidden
          data-[open=true]:block data-[open=true]:opacity-100 data-[open=true]:translate-y-0 data-[open=true]:scale-100
        "
      >
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <span className="text-[10px] font-semibold tracking-wider text-zinc-400">
            {label.toUpperCase()} — RECENT
          </span>
          <Link
            href={href}
            className="text-[10px] font-medium text-amber-400 hover:underline"
          >
            View all
          </Link>
        </div>

        {loading && (
          <div className="space-y-2 p-2">
            {[0,1,2].map(i => (
              <div key={i} className="h-10 rounded-lg bg-zinc-800/60 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && items?.length === 0 && (
          <div className="p-4 text-sm text-zinc-400">{emptyText}</div>
        )}

        {/* Quick Actions */}
        {dropdownActions.length > 0 && (
          <div className="px-2 pt-1 pb-3 border-b border-zinc-800/60">
            <div className="text-[10px] font-semibold tracking-wider text-zinc-400 mb-2 px-2">
              QUICK ACTIONS
            </div>
            <ul className="space-y-1">
              {dropdownActions.map((action, index) => (
                <li key={index}>
                  {action.href ? (
                    <Link
                      href={action.href}
                      className="flex items-center gap-3 rounded-lg px-2 py-2
                                 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-amber-400
                                 transition-colors cursor-pointer"
                    >
                      {action.icon && (
                        <span className="text-amber-400 opacity-70">
                          {action.icon}
                        </span>
                      )}
                      <span className="leading-tight">{action.label}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        action.onClick?.();
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 rounded-lg px-2 py-2
                                 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-amber-400
                                 transition-colors cursor-pointer text-left"
                    >
                      {action.icon && (
                        <span className="text-amber-400 opacity-70">
                          {action.icon}
                        </span>
                      )}
                      <span className="leading-tight">{action.label}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recent Items */}
        {!loading && items && items.length > 0 && (
          <div className="px-2 pb-3">
            {dropdownActions.length > 0 && (
              <div className="text-[10px] font-semibold tracking-wider text-zinc-400 mb-2 px-2 pt-3">
                RECENT ITEMS
              </div>
            )}
            <ul className="space-y-1">
              {items.slice(0, 5).map((it) => (
                <li key={it.id}>
                  <Link
                    href={it.href ?? href}
                    className="flex items-center gap-2 rounded-lg px-2 py-2
                               text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-amber-400
                               transition-colors cursor-pointer"
                  >
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-600" />
                    <div className="flex-1">
                      <div className="leading-tight">{it.title}</div>
                      {it.sub && (
                        <div className="text-[11px] text-zinc-500">{it.sub}</div>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}