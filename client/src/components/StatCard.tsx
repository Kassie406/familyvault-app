import React, {useEffect, useRef, useState} from "react";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import "@/styles/stat-cards.css";

type PreviewItem = {
  id: string;
  title: string;
  sub?: string;
  href?: string;
  thumbnailUrl?: string;
};

type StatCardProps = {
  label: string | React.ReactNode;             // e.g. "Family Members" or JSX
  value: number | string;    // e.g. 5
  href: string;              // where to go on click
  icon: React.ReactNode;     // icon element
  secondaryIcon?: React.ReactNode; // optional secondary icon after label
  onClick?: () => void;      // optional click handler instead of href
  fetchPreview?: () => Promise<PreviewItem[]>; // called on button click
  emptyText?: string;        // fallback when no recent items
  dropdownActions?: { label: string; href?: string; onClick?: () => void; icon?: React.ReactNode }[]; // action menu items
  onViewAll?: () => void;    // custom "View all" handler
};

export function StatCard({
  label,
  value,
  href,
  icon,
  secondaryIcon,
  onClick,
  fetchPreview,
  emptyText = "No recent activity",
  dropdownActions = [],
  onViewAll,
}: StatCardProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<PreviewItem[] | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const baseClassName = "group no-hover-bg rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 to-zinc-950/70 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset] hover:bg-[#D4AF37]/8 focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all duration-300";
  
  return (
    <div ref={wrapRef} className="relative">
      {onClick ? (
        <button
          onClick={onClick}
          type="button"
          className={`${baseClassName} w-full text-left`}
          aria-describedby={`${typeof label === 'string' ? label.replace(/\s+/g, "-").toLowerCase() : 'stat-card'}-desc`}
          data-testid={`stat-card-${typeof label === 'string' ? label.replace(/\s+/g, "-").toLowerCase() : 'custom'}`}
        >
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {React.cloneElement(icon as React.ReactElement, {
              className: "h-6 w-6 text-amber-400/70 group-hover:text-amber-400 group-hover:shadow-lg group-hover:shadow-[#D4AF37]/30 transition-all"
            })}
            <span className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors flex items-center gap-2" id={`${typeof label === 'string' ? label.replace(/\s+/g, "-").toLowerCase() : 'stat-card'}-desc`}>
              {label}
              {secondaryIcon && (
                <span className="h-4 w-4 text-amber-400/70 group-hover:text-amber-400 transition-all flex items-center">
                  {secondaryIcon}
                </span>
              )}
            </span>
          </div>

          {/* The ONLY trigger for the preview */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`stat-preview-${typeof label === 'string' ? label.replace(/\s+/g, "-").toLowerCase() : 'custom'}`}
            className="inline-flex items-center gap-1 rounded-md px-3 py-2
                       text-xs font-medium text-zinc-500 hover:text-amber-400
                       focus:outline-none focus:ring-2 focus:ring-amber-400/40
                       touch-manipulation min-h-[44px] md:min-h-0 md:px-2 md:py-1"
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

          <p className="mt-3 text-3xl font-bold text-[#D4AF37]">{value}</p>
        </button>
      ) : (
        <Link
          href={href}
          className={`${baseClassName} block`}
          aria-describedby={`${typeof label === 'string' ? label.replace(/\s+/g, "-").toLowerCase() : 'stat-card'}-desc`}
          data-testid={`stat-card-${typeof label === 'string' ? label.replace(/\s+/g, "-").toLowerCase() : 'custom'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {React.cloneElement(icon as React.ReactElement, {
                className: "h-6 w-6 text-amber-400/70 group-hover:text-amber-400 group-hover:shadow-lg group-hover:shadow-[#D4AF37]/30 transition-all"
              })}
              <span className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors flex items-center gap-2" id={`${typeof label === 'string' ? label.replace(/\s+/g, "-").toLowerCase() : 'stat-card'}-desc`}>
                {label}
                {secondaryIcon && (
                  <span className="h-4 w-4 text-amber-400/70 group-hover:text-amber-400 transition-all flex items-center">
                    {secondaryIcon}
                  </span>
                )}
              </span>
            </div>

            {/* The ONLY trigger for the preview */}
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`stat-preview-${typeof label === 'string' ? label.replace(/\s+/g, "-").toLowerCase() : 'custom'}`}
              className="inline-flex items-center gap-1 rounded-md px-3 py-2
                         text-xs font-medium text-zinc-500 hover:text-amber-400
                         focus:outline-none focus:ring-2 focus:ring-amber-400/40
                         touch-manipulation min-h-[44px] md:min-h-0 md:px-2 md:py-1"
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

          <p className="mt-3 text-3xl font-bold text-[#D4AF37]">{value}</p>
        </Link>
      )}

      {/* Anchored preview panel (responsive) */}
      <div
        id={`stat-preview-${typeof label === 'string' ? label.replace(/\s+/g, "-").toLowerCase() : 'custom'}`}
        role="region"
        aria-label={`${typeof label === 'string' ? label : 'StatCard'} — recent`}
        data-open={open ? "true" : "false"}
        className={`
          pointer-events-auto absolute z-20 mt-2
          rounded-xl border border-zinc-800/80 bg-zinc-950/95 backdrop-blur
          shadow-lg transition-all
          opacity-0 translate-y-2 scale-[0.98] hidden
          data-[open=true]:block data-[open=true]:opacity-100 data-[open=true]:translate-y-0 data-[open=true]:scale-100
          ${
            isMobile 
              ? 'fixed left-4 right-4 top-1/2 -translate-y-1/2 max-h-[80vh] overflow-y-auto'
              : 'left-0 right-0 top-full w-[28rem] max-w-[90vw]'
          }
        `}
      >
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <span className="text-[10px] font-semibold tracking-wider text-zinc-400">
            {typeof label === 'string' ? label.toUpperCase() : 'RECENT'} — RECENT
          </span>
          <div className="flex items-center gap-2">
            {isMobile && (
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-zinc-400 hover:text-amber-400 touch-manipulation"
                aria-label="Close"
              >
                <ChevronDown className="h-4 w-4 rotate-180" />
              </button>
            )}
            {onViewAll ? (
              <button
                onClick={() => {
                  onViewAll();
                  setOpen(false);
                }}
                className="text-[10px] font-medium text-amber-400 hover:underline touch-manipulation"
              >
                View all
              </button>
            ) : (
              <Link
                href={href}
                className="text-[10px] font-medium text-amber-400 hover:underline touch-manipulation"
              >
                View all
              </Link>
            )}
          </div>
        </div>

        {loading && (
          <div className="space-y-2 p-2">
            {[0,1,2].map(i => (
              <div key={i} className={`${isMobile ? 'h-12' : 'h-10'} rounded-lg bg-zinc-800/60 animate-pulse`} />
            ))}
          </div>
        )}

        {!loading && items?.length === 0 && (
          <div className={`p-4 text-sm text-zinc-400 ${isMobile ? 'text-center py-8' : ''}`}>{emptyText}</div>
        )}

        {/* Quick Actions */}
        {dropdownActions.length > 0 && (
          <div className="px-2 pt-1 pb-3 border-b border-zinc-800/60">
            <div className="text-[10px] font-semibold tracking-wider text-zinc-400 mb-2 px-2">
              QUICK ACTIONS
            </div>
            <ul id="family-quick-actions" className="space-y-1">
              {dropdownActions.map((action, index) => (
                <li key={index} className="hover:!bg-transparent">
                  {action.href ? (
                    <Link
                      href={action.href}
                      className={`qa-row flex items-center gap-3 rounded-lg px-2 py-3 min-h-[48px] w-full text-zinc-300 transition-colors cursor-pointer touch-manipulation`}
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
                      className={`qa-row w-full flex items-center gap-3 rounded-lg px-2 py-3 min-h-[48px] text-zinc-300 transition-colors cursor-pointer text-left touch-manipulation`}
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
                <li key={it.id} className="hover:!bg-transparent">
                  <Link
                    href={it.href ?? href}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 text-sm text-zinc-300 hover:!bg-[#D4AF37]/14 active:!bg-[#D4AF37]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]/60 transition-colors cursor-pointer touch-manipulation ${isMobile ? 'py-3 min-h-[48px]' : 'py-2'}`}
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