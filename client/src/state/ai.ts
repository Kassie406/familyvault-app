import { create } from "zustand";

export type ExtractField = { key: string; value: string; confidence: number; pii?: boolean };

type AIScan =
  | { state: "idle" }
  | { state: "analyzing"; id: string; step: 1 | 2 | 3 }
  | { state: "ready" | "partial"; id: string; count: number; fields: ExtractField[]; suggestion?: { memberId: string; memberName: string; confidence: number } }
  | { state: "none" | "failed" | "unsupported"; id: string; message: string };

type AIStore = {
  scan: AIScan;
  start: (id: string) => void;
  update: (scan: Partial<AIScan> & { state: AIScan["state"] }) => void;
  reset: () => void;
};

export const useAI = create<AIStore>((set) => ({
  scan: { state: "idle" },
  start: (id) => set({ scan: { state: "analyzing", id, step: 1 } }),
  update: (next) => set((s) => ({ scan: { ...s.scan, ...next } as AIScan })),
  reset: () => set({ scan: { state: "idle" } }),
}));