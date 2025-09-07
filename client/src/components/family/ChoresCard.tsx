import { useEffect, useState } from "react";
import { Clock, CheckCircle2, AlertCircle, User, Plus } from "lucide-react";
import CreateChoreModal from "./CreateChoreModal";

type Member = { id: string; name: string; role: "parent"|"teen"|"child" };
type Chore = {
  id: string; 
  title: string; 
  details?: string; 
  dueAt: string; 
  points: number;
  status: "todo"|"done"|"approved"; 
  assignee: Member; 
  assigneeId: string;
};

interface ChoresCardProps {
  currentUser: Member;
}

export default function ChoresCard({ currentUser }: ChoresCardProps) {
  const [tab, setTab] = useState<"mine"|"family">("mine");
  const [rows, setRows] = useState<Chore[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const isParent = currentUser.role === "parent";

  async function load() {
    setErr(null);
    try {
      const response = await fetch("/api/chores", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch chores");
      const data = await response.json();
      setRows(data);
    } catch (e: any) { 
      setErr(e.message); 
    }
  }

  useEffect(() => { 
    load(); 
    
    // Listen for reload events
    const handleReload = () => load();
    window.addEventListener("chores:reload", handleReload);
    return () => window.removeEventListener("chores:reload", handleReload);
  }, []);

  async function markDone(id: string) {
    const prev = rows!;
    setRows(prev.map(r => r.id === id ? {...r, status: "done"} : r));
    
    try { 
      const response = await fetch(`/api/chores/${id}/done`, { 
        method: "POST",
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to mark chore done");
    } catch {
      setRows(prev);
    }
  }

  async function approve(id: string) {
    const prev = rows!;
    setRows(prev.map(r => r.id === id ? {...r, status: "approved"} : r));
    
    try { 
      const response = await fetch(`/api/chores/${id}/approve`, { 
        method: "POST",
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to approve chore");
    } catch {
      setRows(prev);
    }
  }

  if (err) {
    return (
      <Card id="chores">
        <Header>
          <div className="text-rose-300">Failed to load chores — {err} 
            <button onClick={load} className="underline ml-2 hover:text-rose-200">
              Retry
            </button>
          </div>
        </Header>
      </Card>
    );
  }

  if (!rows) {
    return (
      <Card id="chores">
        <Header>
          <div className="animate-pulse text-white/60">Loading chores…</div>
        </Header>
      </Card>
    );
  }

  const mine = rows.filter(r => r.assigneeId === currentUser.id);
  const family = rows;

  return (
    <>
      <Card id="chores">
        <div className="flex items-center justify-between mb-4">
          <div className="text-white/80 font-medium">Chores & Allowance</div>
          {isParent && (
            <button 
              onClick={() => setCreateModalOpen(true)} 
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#D4AF37] text-black font-semibold hover:brightness-110 transition-all text-sm"
            >
              <Plus className="w-4 h-4" />
              New Chore
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-3">
          <Tab current={tab === "mine"} onClick={() => setTab("mine")}>My chores</Tab>
          <Tab current={tab === "family"} onClick={() => setTab("family")}>Family</Tab>
        </div>

        {tab === "mine" && (
          <List
            rows={mine}
            renderAction={(r) => (
              r.status === "todo" ? (
                <Primary onClick={() => markDone(r.id)}>Mark done</Primary>
              ) : r.status === "done" ? (
                <span className="text-amber-300 text-sm">Awaiting approval</span>
              ) : (
                <span className="text-emerald-300 text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Approved
                </span>
              )
            )}
          />
        )}

        {tab === "family" && (
          <List
            rows={family}
            renderAction={(r) => (
              r.status === "done" && isParent ? (
                <Primary onClick={() => approve(r.id)}>Approve +{r.points}</Primary>
              ) : r.status === "approved" ? (
                <span className="text-emerald-300 text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Approved
                </span>
              ) : (
                <span className="text-white/50 text-sm">—</span>
              )
            )}
          />
        )}
      </Card>

      {createModalOpen && (
        <CreateChoreModal
          open={createModalOpen}
          onClose={(created) => {
            setCreateModalOpen(false);
            if (created) {
              load(); // Reload chores
            }
          }}
          currentUser={currentUser}
        />
      )}
    </>
  );
}

function List({ rows, renderAction }: { 
  rows: Chore[]; 
  renderAction: (r: Chore) => React.ReactNode 
}) {
  if (!rows.length) {
    return (
      <div className="text-center py-8 text-white/60">
        <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <div>No chores here</div>
        <div className="text-sm text-white/40 mt-1">Add one to get started!</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {rows.map(r => (
        <div 
          key={r.id} 
          className={`flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-3 transition-colors ${
            r.status === "done" ? "border-amber-500/30" : 
            r.status === "approved" ? "border-emerald-500/30" : 
            "hover:bg-black/60"
          }`}
        >
          <div className="min-w-0 flex-1 mr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-medium">{r.title}</span>
              {r.status === "done" && (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              {r.status === "approved" && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            
            {r.details && (
              <div className="text-white/60 text-sm truncate mb-1">
                {r.details}
              </div>
            )}
            
            <div className="flex items-center gap-3 text-xs text-white/50">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Due {new Date(r.dueAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {r.assignee?.name || "Unassigned"}
              </div>
              <div className="text-[#D4AF37]">
                {r.points} pts
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            {renderAction(r)}
          </div>
        </div>
      ))}
    </div>
  );
}

function Card({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
      {children}
    </section>
  );
}

function Header({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

function Tab({ current, onClick, children }: { 
  current: boolean; 
  onClick: () => void; 
  children: React.ReactNode; 
}) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        current 
          ? "bg-[#D4AF37] text-black" 
          : "text-white/70 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function Primary({ onClick, children }: { 
  onClick: () => void; 
  children: React.ReactNode; 
}) {
  return (
    <button 
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black font-medium hover:brightness-110 transition-all text-sm"
    >
      {children}
    </button>
  );
}