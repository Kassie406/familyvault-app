import { useEffect, useState, useCallback } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { withTimeout } from "@/lib/time";

type Counts = { 
  approvePending: number; 
  dueToday: number; 
  mealsUnplanned: number; 
};

export default function ActionCenter() {
  const [data, setData] = useState<Counts | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setErr(null);
      const summary = await withTimeout(api("/api/chores/summary"), 8000);
      setData({
        approvePending: summary.pendingApproval,
        dueToday: summary.dueToday,
        mealsUnplanned: 0 // TODO: Wire up meals unplanned count
      });
    } catch (e: any) {
      setErr(e.message || "Failed to load summary");
    }
  }, []);

  useEffect(() => { 
    load(); 
  }, [load]);

  useEffect(() => {
    let inFlight = false;
    const handleReload = async () => {
      if (inFlight) return;
      inFlight = true;
      try { 
        await load(); 
      } finally { 
        inFlight = false; 
      }
    };
    window.addEventListener("actioncenter:reload", handleReload);
    window.addEventListener("chores:reload", handleReload);
    return () => {
      window.removeEventListener("actioncenter:reload", handleReload);
      window.removeEventListener("chores:reload", handleReload);
    };
  }, [load]);

  if (err) {
    return (
      <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 to-zinc-950/70 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset] transition-all duration-300 text-rose-300">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Action Center error — {err}
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 to-zinc-950/70 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset] transition-all duration-300 animate-pulse text-white/60">
        Loading Action Center…
      </div>
    );
  }

  const hasActions = data.approvePending > 0 || data.dueToday > 0 || data.mealsUnplanned > 0;
  const items = [
    data.approvePending > 0 && `${data.approvePending} ${data.approvePending === 1 ? "chore" : "chores"} to approve`,
    data.dueToday > 0 && `${data.dueToday} due today`,
    data.mealsUnplanned > 0 && `${data.mealsUnplanned} meals unplanned`,
  ].filter(Boolean);

  return (
    <a href="#chores" className="block no-underline">
      <div className={`rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 to-zinc-950/70 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset] hover:shadow-xl hover:shadow-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-300 ${
        hasActions 
          ? "cursor-pointer" 
          : ""
      }`}>
        <div className="flex items-center gap-2 mb-1">
          {hasActions ? (
            <AlertCircle className="w-5 h-5 text-[#D4AF37]" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <div className="text-white/80 text-sm font-medium">Action Center</div>
        </div>
        
        <div className="text-white text-base">
          {hasActions ? (
            items.join(" • ")
          ) : (
            "All caught up! 🎉"
          )}
        </div>
      </div>
    </a>
  );
}