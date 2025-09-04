import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

type Manager = {
  id: string;
  name: string;
  role?: string;
  itemCount?: number;
  initials?: string;
};

export default function FamilyBusiness() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [q, setQ] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000); // safety cap

    (async () => {
      try {
        setError(null);
        console.log('Fetching business managers...');
        
        const res = await fetch("/api/business/managers", { 
          signal: ctrl.signal, 
          credentials: "include" 
        });
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json().catch(() => ({}));
        console.log('API response:', data);
        
        // Accept several shapes - handle both array and object responses
        const raw = Array.isArray(data) ? data : (data?.items ?? data?.managers ?? []);

        const mapped: Manager[] = raw.map((m: any, i: number) => ({
          id: String(m.id ?? m.managerId ?? i),
          name: String(m.name ?? m.fullName ?? "Unnamed"),
          role: m.role ?? m.title ?? "Manager",
          itemCount: Number(m.itemCount ?? m.itemsCount ?? m.count ?? 0),
          initials: m.initials ?? m.name?.split(" ").map((s: string) => s[0]).slice(0, 2).join("") ?? "??",
        }));

        setManagers(mapped);
        console.log('Mapped managers:', mapped);
      } catch (e: any) {
        console.error('Error fetching managers:', e);
        if (e?.name === "AbortError") {
          setError("Request timed out. Please try again.");
        } else {
          setError(e?.message || "Failed to load managers.");
        }
        
        // Fallback to default managers on error
        setManagers([
          { id: "angel", name: "Angel Johnson", role: "Managing Member", itemCount: 42, initials: "AJ" },
          { id: "kassandra", name: "Kassandra Johnson", role: "Operations Director", itemCount: 28, initials: "KJ" },
          { id: "family", name: "Family Shared", role: "Joint Ownership", itemCount: 15, initials: "FS" }
        ]);
      } finally {
        clearTimeout(t);
        setLoading(false);
      }
    })();

    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, []);

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
      <div className="px-6 pb-12">
        {/* Header */}
        <div className="sticky top-0 z-10 -mx-6 border-b border-white/8 bg-black/60 backdrop-blur">
          <div className="px-6 py-4 flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-white" data-testid="text-page-title">Business</h1>
            <button
              className="rounded-full bg-amber-400/25 px-3 py-1.5 text-amber-200 hover:bg-amber-400/35 transition"
              onClick={() => {/* open add menu/modal */}}
              data-testid="button-add-business"
            >
              + Add
            </button>
            <div className="rounded-full bg-amber-400/15 px-3 py-1 text-amber-200 text-sm" data-testid="text-manager-count">
              {managers.length} managers • {totalItems} total items
            </div>
            <div className="grow" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search managers or business items..."
              className="w-[420px] rounded-full bg-white/6 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400/25 text-white placeholder:text-white/40"
              data-testid="input-search"
            />
          </div>
        </div>

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
          <div className="mx-auto mt-6 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="managers-grid">
            {filtered.map(m => (
              <button
                key={m.id}
                onClick={() => setLocation(`/family/business/${m.id}`)}
                className="rounded-2xl border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 hover:border-white/12 transition hover:scale-[1.02] text-left"
                data-testid={`manager-card-${m.id}`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="grid size-10 place-items-center rounded-full text-black font-semibold"
                    style={{ backgroundColor: avatarColors[m.id] || '#D4AF37' }}
                  >
                    {m.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-white">{m.name}</div>
                    <div className="text-xs text-white/60">{m.role} • {m.itemCount ?? 0} items</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}