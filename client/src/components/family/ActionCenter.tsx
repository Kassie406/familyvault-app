import { useEffect, useState, useCallback } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { withTimeout } from "@/lib/time";
import "@/styles/action-center.css";

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
        approvePending: summary.pendingApprovals || 0,
        dueToday: summary.dueSoon || 0,
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
      <div id="action-center-shell" className="bg-transparent p-0 h-full">
        <div id="action-center-card" className="p-4 h-full flex flex-col justify-center text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Action Center error — {err}
          </div>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div id="action-center-shell" className="bg-transparent p-0 h-full">
        <div id="action-center-card" className="p-4 h-full flex flex-col justify-center animate-pulse text-white/60">
          Loading Action Center…
        </div>
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
    <div id="action-center-shell" className="bg-transparent p-0 h-full">
      <div id="action-center-card" className={`p-4 h-full flex flex-col justify-center ${hasActions ? "cursor-pointer" : ""}`}>
        <a href="#chores" className="block">
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
      </div>
    </div>
  );
}