import React, { useState, useMemo, useEffect } from 'react';
import {
  ListTodo, CalendarDays, User, Plus, X, CheckCircle2, Trash2
} from 'lucide-react';
import { loadItems, addItem, toggleItem, deleteItem, ensureProfile, subscribeToListItems, type ListItem } from '@/lib/supabaseHelpers';

type SharedListsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SharedListsModal({ open, onClose }: SharedListsModalProps) {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [assignee, setAssignee] = useState("");
  const [due, setDue] = useState("");

  const pendingCount = useMemo(() => items.filter(i => !i.done).length, [items]);

  // Load items when modal opens
  useEffect(() => {
    if (open) {
      loadItemsData();
    }
  }, [open]);

  // Set up real-time subscription
  useEffect(() => {
    if (open) {
      const familyId = 'fam_default'; // In a real app, get this from user profile
      const unsubscribe = subscribeToListItems(familyId, loadItemsData);
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [open]);

  async function loadItemsData() {
    try {
      setLoading(true);
      await ensureProfile(); // Make sure user has a profile
      const data = await loadItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addNewItem() {
    if (!text.trim() || loading) return;
    try {
      setLoading(true);
      const newItem = await addItem({
        text: text.trim(),
        assignee: assignee.trim() || "Unassigned",
        due: due || null
      });
      setItems(prev => [newItem, ...prev]);
      setText("");
      setAssignee("");
      setDue("");
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleItem(id: string) {
    if (loading) return;
    try {
      setLoading(true);
      const updatedItem = await toggleItem(id);
      setItems(prev => prev.map(i => i.id === id ? updatedItem : i));
    } catch (error) {
      console.error('Failed to toggle item:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteItem(id: string) {
    if (loading) return;
    try {
      setLoading(true);
      await deleteItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-[#0b0b0b] text-white border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ListTodo size={22} color="#D4AF37" strokeWidth={2.5} />
            <h2 className="text-xl font-semibold">Shared Lists</h2>
            <span className="px-2 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium">
              {pendingCount} pending
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Add Row */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add an item (e.g., 'Buy broccoli')"
            className="md:col-span-6 bg-black/40 border border-white/10 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#D4AF37] text-white placeholder-gray-400"
            onKeyDown={(e) => e.key === 'Enter' && addNewItem()}
          />
          <input
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Assignee (optional)"
            className="md:col-span-3 bg-black/40 border border-white/10 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#D4AF37] text-white placeholder-gray-400"
          />
          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="md:col-span-2 bg-black/40 border border-white/10 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#D4AF37] text-white"
          />
          <button
            onClick={addNewItem}
            disabled={loading}
            className="md:col-span-1 inline-flex items-center justify-center gap-1 bg-[#D4AF37] text-black font-semibold rounded-xl px-3 py-2 hover:brightness-95 transition-all disabled:opacity-50"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* List */}
        <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto space-y-3">
          {items.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <ListTodo size={48} className="mx-auto mb-4 opacity-30" />
              <p>No items yet. Add your first task above!</p>
            </div>
          )}

          {items.map((item) => (
            <ListRow
              key={item.id}
              item={item}
              onToggle={() => handleToggleItem(item.id)}
              onDelete={() => handleDeleteItem(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ListRow({ item, onToggle, onDelete }: {
  item: ListItem;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const dueLabel = useMemo(() => {
    if (!item.due_date) return null;
    const d = new Date(item.due_date);
    const days = Math.ceil((d.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (isNaN(days)) return null;
    const tone =
      days < 0 ? "Overdue" : days === 0 ? "Due today" : `Due in ${days}d`;
    return { tone, days };
  }, [item.due_date]);

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all
          ${item.done 
            ? "bg-[#D4AF37] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30" 
            : "border-white/30 hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/20"
          }`}
        aria-label={item.done ? "Mark as not done" : "Mark as done"}
      >
        {item.done && <CheckCircle2 size={18} className="text-black" />}
      </button>

      {/* Text + meta */}
      <div className="flex-1 min-w-0">
        <div className={`font-medium truncate ${item.done ? "line-through text-gray-500" : "text-white"}`}>
          {item.text}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
          {item.assignee && item.assignee !== "Unassigned" && (
            <span className="inline-flex items-center gap-1">
              <User size={14} /> {item.assignee}
            </span>
          )}
          {dueLabel && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border
                ${dueLabel.days < 1 
                  ? "border-red-400/30 text-red-400 bg-red-400/10" 
                  : dueLabel.days <= 2
                  ? "border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/10"
                  : "border-white/20 text-gray-300"
                }`}
            >
              <CalendarDays size={14} />
              {dueLabel.tone}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-gray-400 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Delete item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}