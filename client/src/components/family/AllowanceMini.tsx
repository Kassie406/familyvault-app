import { useEffect, useState, useCallback } from "react";
import { DollarSign } from "lucide-react";
import { api } from "@/lib/api";
import { withTimeout } from "@/lib/time";
import "@/styles/allowance-mini.css";

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
    <section id="allowance-mini" className="rounded-2xl border border-white/10 bg-white/5 p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="w-5 h-5 text-[#D4AF37]" />
        <div className="text-white/80">Allowance</div>
      </div>
      
      {err && (
        <div className="text-rose-300 text-sm">{err}</div>
      )}
      
      {balance === null ? (
        <div className="animate-pulse text-white/60">Loading…</div>
      ) : (
        <>
          <div className="text-2xl text-[#D4AF37] font-semibold mb-3">
            {balance} pts
          </div>
          
          <div className="text-sm text-white/70 mb-2">Recent</div>
          
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
        </>
      )}
    </section>
  );
}