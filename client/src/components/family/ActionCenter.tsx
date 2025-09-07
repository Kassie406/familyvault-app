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
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-rose-300">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Action Center error — {err}
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse text-white/60">
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
    <a 
      href="#chores" 
      className={`block rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-200 ${
        hasActions 
          ? "hover:bg-white/10 cursor-pointer border-[#D4AF37]/30" 
          : "border-emerald-500/30"
      }`}
    >
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
    </a>
  );
}