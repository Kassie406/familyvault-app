import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Member = { id: string; name: string; role: "parent"|"teen"|"child" };

interface CreateChoreModalProps {
  open: boolean;
  onClose: (created?: boolean) => void;
  currentUser: Member;
}

export default function CreateChoreModal({ open, onClose, currentUser }: CreateChoreModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueAt, setDueAt] = useState<string>(() => new Date().toISOString().slice(0,16)); // yyyy-MM-ddTHH:mm
  const [points, setPoints] = useState(10);
  const [rotationKey, setRotationKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  useEffect(() => {
    if (!open) return;
    
    // Reset form when opening modal
    setTitle("");
    setDetails("");
    setPoints(10);
    setRotationKey("");
    setErr(null);

    (async () => {
      try {
        const response = await fetch("/api/members", { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch members");
        const data = await response.json();
        setMembers(data);
        if (!assigneeId && data.length) setAssigneeId(data[0].id);
      } catch (e: any) { 
        setErr(e.message); 
      }
    })();
  }, [open, assigneeId]);

  if (!open) return null;
  
  const canSave = title.trim().length >= 2 && assigneeId && dueAt;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave || saving) return;
    
    setSaving(true); 
    setErr(null);
    
    try {
      const response = await fetch("/api/chores", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          credentials: "include" 
        },
        body: JSON.stringify({
          title: title.trim(),
          details: details.trim() || undefined,
          assigneeId,
          dueAt: new Date(dueAt).toISOString(),
          points,
          rotationKey: rotationKey.trim() || undefined,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create chore");
      }
      
      onClose(true);
    } catch (e: any) {
      setErr(e.message || "Could not create chore");
    } finally {
      setSaving(false);
    }
  }

  if (currentUser.role !== "parent") {
    return (
      <Modal onClose={() => onClose()}>
        <div className="text-white">Only parents can create chores.</div>
      </Modal>
    );
  }

  return (
    <Modal onClose={() => onClose()}>
      <form onSubmit={onSubmit} className="space-y-3">
        <h3 className="text-lg text-white">Create Chore</h3>

        <div>
          <label className="block text-sm text-white/70 mb-1">Title</label>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            placeholder="Dishes, Trash, Walk dog…"
            className="w-full rounded-lg bg-black/60 border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]" 
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">Details (optional)</label>
          <textarea 
            value={details} 
            onChange={e => setDetails(e.target.value)}
            rows={2}
            placeholder="Instructions or additional info..."
            className="w-full rounded-lg bg-black/60 border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-white/70 mb-1">Assignee</label>
            <select 
              value={assigneeId} 
              onChange={e => setAssigneeId(e.target.value)}
              className="w-full rounded-lg bg-black/60 border border-white/10 px-3 py-2 text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Due</label>
            <input 
              type="datetime-local" 
              value={dueAt} 
              onChange={e => setDueAt(e.target.value)}
              className="w-full rounded-lg bg-black/60 border border-white/10 px-3 py-2 text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-white/70 mb-1">Points</label>
            <input 
              type="number" 
              min={1} 
              max={100} 
              value={points} 
              onChange={e => setPoints(Number(e.target.value))}
              className="w-full rounded-lg bg-black/60 border border-white/10 px-3 py-2 text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]" 
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Rotation Key (optional)</label>
            <input 
              value={rotationKey} 
              onChange={e => setRotationKey(e.target.value)}
              placeholder="evening-dishes, trash-night"
              className="w-full rounded-lg bg-black/60 border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]" 
            />
          </div>
        </div>

        {err && <div className="text-rose-300 text-sm">{err}</div>}

        <div className="flex justify-end gap-2 pt-2">
          <button 
            type="button" 
            onClick={() => onClose()} 
            className="px-4 py-2 rounded-lg border border-white/15 text-white/90 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={!canSave || saving}
            className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold disabled:opacity-60 hover:brightness-110 transition-all"
          >
            {saving ? "Creating…" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur">
      <div className="w-[92vw] max-w-lg rounded-2xl border border-white/10 bg-[var(--bg-850)] p-4 shadow-xl">
        <div className="flex justify-end mb-2">
          <button 
            onClick={onClose} 
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}