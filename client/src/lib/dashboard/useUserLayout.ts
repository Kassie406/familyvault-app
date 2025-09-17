import { useEffect, useMemo, useState } from "react";
import { DEFAULTS, Layout, CardId, CARD_REGISTRY } from "./cards";

export function useUserLayout(userId: string, role: "parent" | "teen") {
  const key = `dash-layout:${userId}`;
  const [layout, setLayout] = useState<Layout>(() => {
    if (typeof window === "undefined") return DEFAULTS[role];
    
    const raw = localStorage.getItem(key);
    if (!raw) return DEFAULTS[role];
    
    try {
      const parsed = JSON.parse(raw) as Layout;
      // Clean up stale card references (like removed quickActions)
      const validCardIds = new Set(CARD_REGISTRY.map(c => c.id));
      const cleaned = parsed.filter(item => {
        const isValid = validCardIds.has(item.id);
        if (!isValid) {
          console.log('Removing stale card from layout:', item.id);
        }
        return isValid;
      });
      
      // Save cleaned layout if we removed anything
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(key, JSON.stringify(cleaned));
      }
      
      return cleaned;
    } catch (e) {
      console.warn('Failed to parse dashboard layout:', e);
      return DEFAULTS[role];
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(layout));
    }
  }, [key, layout]);

  const visible = useMemo(() => layout.filter((i) => !i.hidden), [layout]);

  const hide = (id: CardId) =>
    setLayout((L) => L.map((i) => (i.id === id ? { ...i, hidden: true } : i)));

  const show = (id: CardId) =>
    setLayout((L) => {
      const hit = L.find((i) => i.id === id);
      return hit ? L.map((i) => (i.id === id ? { ...i, hidden: false } : i)) : [...L, { id }];
    });

  const reorder = (from: number, to: number) =>
    setLayout((L) => {
      const vis = L.filter((i) => !i.hidden);
      const [moved] = vis.splice(from, 1);
      vis.splice(to, 0, moved);
      const hidden = L.filter((i) => i.hidden);
      return [...vis, ...hidden];
    });

  const resetToRole = () => setLayout(DEFAULTS[role]);

  return { layout, visible, hide, show, reorder, resetToRole };
}