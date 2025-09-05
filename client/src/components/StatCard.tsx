import React, {useEffect, useRef, useState} from "react";
import { Link } from "wouter";

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
  fetchPreview?: () => Promise<PreviewItem[]>; // called on hover/focus
  emptyText?: string;        // fallback when no recent items
};

export function StatCard({
  label,
  value,
  href,
  icon,
  fetchPreview,
  emptyText = "No recent activity",
}: StatCardProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<PreviewItem[] | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const popRef  = useRef<HTMLDivElement | null>(null);

  // Close popover on outside click / Esc
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node;
      if (cardRef.current?.contains(target) || popRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

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

  // Accessible open on hover/focus
  function openPreview() {
    setOpen(true);
    void ensurePreviewLoaded();
  }

  return (
    <div
      ref={cardRef}
      className="relative"
      onMouseEnter={openPreview}
      onFocus={openPreview}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        // only close if focus moved outside both card & popover
        const next = e.relatedTarget as Node | null;
        if (!cardRef.current?.contains(next) && !popRef.current?.contains(next)) setOpen(false);
      }}
    >
      <Link
        href={href}
        className="group block rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 to-zinc-950/70 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset] focus:outline-none focus:ring-2 focus:ring-amber-400/40 hover:bg-transparent"
        aria-describedby={`${label.replace(/\s+/g, "-").toLowerCase()}-desc`}
        data-testid={`stat-card-${label.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <div className="flex items-center gap-3">
          {React.cloneElement(icon as React.ReactElement, {
            className: "h-6 w-6 text-amber-400/70 group-hover:text-amber-400 transition-colors"
          })}
          <span className="text-sm font-medium text-zinc-400 group-hover:text-amber-400 transition-colors" id={`${label.replace(/\s+/g, "-").toLowerCase()}-desc`}>
            {label}
          </span>
        </div>
        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      </Link>

      {/* Hover / focus preview */}
      {open && (
        <div
          ref={popRef}
          tabIndex={-1}
          className="absolute left-0 z-20 mt-2 w-[28rem] rounded-xl border border-zinc-800/80 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80 shadow-2xl"
        >
          <div className="flex items-center justify-between px-4 pt-3">
            <span className="text-xs uppercase tracking-wide text-zinc-400">{label} — Recent</span>
            <Link
              href={href}
              className="text-xs text-amber-400 hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/40 rounded px-1.5 py-0.5"
            >
              View all
            </Link>
          </div>

          <div className="px-2 py-2">
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

            {!loading && items && items.length > 0 && (
              <ul className="max-h-64 overflow-auto px-2 py-1">
                {items.slice(0, 6).map((it) => (
                  <li key={it.id}>
                    <Link
                      href={it.href ?? href}
                      className="group flex items-center gap-3 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    >
                      {it.thumbnailUrl ? (
                        <img
                          src={it.thumbnailUrl}
                          alt=""
                          className="h-8 w-8 rounded-md object-cover ring-1 ring-zinc-800/80"
                          loading="lazy"
                        />
                      ) : (
                        <span className="h-8 w-8 rounded-md bg-zinc-800/60 ring-1 ring-zinc-700/60" />
                      )}
                      <div className="min-w-0">
                        <div className="truncate text-sm text-zinc-400 group-hover:text-amber-400 transition-colors">{it.title}</div>
                        {it.sub && <div className="truncate text-xs text-zinc-400">{it.sub}</div>}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}