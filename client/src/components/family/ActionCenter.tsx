import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

type Counts = { 
  approvePending: number; 
  dueToday: number; 
  mealsUnplanned: number; 
};

export default function ActionCenter() {
  const [data, setData] = useState<Counts | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    
    (async () => {
      try {
        const response = await fetch("/api/chores?since=" + new Date().toISOString(), {
          credentials: "include"
        });
        
        if (!response.ok) throw new Error("Failed to fetch chores data");
        
        const chores = await response.json();
        const today = new Date().toDateString();
        
        const approvePending = chores.filter((c: any) => c.status === "done").length;
        const dueToday = chores.filter((c: any) => 
          new Date(c.dueAt).toDateString() === today && c.status === "todo"
        ).length;
        
        // mealsUnplanned placeholder (wire up later)
        const mealsUnplanned = 0;
        
        if (alive) setData({ approvePending, dueToday, mealsUnplanned });
      } catch (e: any) { 
        if (alive) setErr(e.message); 
      }
    })();
    
    return () => { alive = false; };
  }, []);

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