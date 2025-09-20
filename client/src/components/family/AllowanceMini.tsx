import { useEffect, useState, useCallback } from "react";
import { DollarSign } from "lucide-react";
import { api } from "@/lib/api";
import { withTimeout } from "@/lib/time";
import "@/styles/allowance-mini.css";
import "@/styles/dashboard-card.css";

type Item = { deltaPoints: number; reason: string; createdAt: string };

interface AllowanceMiniProps {
  memberId?: string;
}

export default function AllowanceMini({ memberId = "me" }: AllowanceMiniProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const data = await withTimeout(api(`/api/allowance/summary?memberId=${memberId}`), 8000);
      setBalance(data.balance);
      setItems(data.items.slice(0, 5));
    } catch (e: any) { 
      setErr(e.message); 
    }
  }, [memberId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const handleReload = () => load();
    window.addEventListener("allowance:reload", handleReload);
    return () => window.removeEventListener("allowance:reload", handleReload);
  }, [load]);

  return (
    <section id="allowance-mini" className="dash-card">
      <header className="dash-title relative mb-3">
        <DollarSign className="dash-icon" />
        <span>Allowance</span>
        <button className="dash-meta" type="button">
          Recent
          <svg className="h-4 w-4 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </header>
      
      {err && (
        <div className="mt-2 inline-flex items-center gap-2 text-xs rounded-full border border-[#5a3f1a] bg-[#2a1f12] px-3 py-1 text-[#ffd99a]">
          Allowance is unavailable right now. Please try again later.
        </div>
      )}
      
      {balance === null ? (
        <div className="animate-pulse text-white/60">Loading…</div>
      ) : (
        <>
          <div className="kpi-value text-[#D4AF37] mb-3">
            {balance} pts
          </div>
          
          <div className="bg-transparent">
            <ul className="space-y-2">
              {items.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span className="truncate text-white/80 mr-2">
                    {item.reason}
                  </span>
                  <span className={item.deltaPoints >= 0 ? "text-emerald-300" : "text-rose-300"}>
                    {item.deltaPoints >= 0 ? "+" : ""}{item.deltaPoints}
                  </span>
                </li>
              ))}
              {!items.length && (
                <li className="text-white/50 text-sm">No history yet.</li>
              )}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}
