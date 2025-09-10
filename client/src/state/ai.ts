import { create } from "zustand";
import type { ExtractField, AISuggestions } from "@shared/types/inbox";
import { pollWithHeartbeat } from "@/lib/unstickable";

// Legacy format for backward compatibility
type LegacyExtractField = { key: string; value: string; confidence: number; pii?: boolean };
type LegacySuggestion = { memberId: string; memberName: string; confidence: number };

type AIScan =
  | { state: "idle" }
  | { state: "analyzing"; id: string; step: string; progress?: number }
  | { state: "ready" | "partial"; id: string; count: number; fields: ExtractField[]; suggestion?: LegacySuggestion; suggestions?: AISuggestions }
  | { state: "none" | "failed" | "unsupported" | "timeout"; id: string; message: string; error?: string; stage?: string; code?: number };

type AIStore = {
  scan: AIScan;
  start: (id: string) => Promise<void>;
  update: (scan: Partial<AIScan> & { state: AIScan["state"] }) => void;
  reset: () => void;
  setProgress: (step: string, progress?: number) => void;
};

export const useAI = create<AIStore>((set, get) => ({
  scan: { state: "idle" },
  
  start: async (id) => {
    set({ scan: { state: "analyzing", id, step: "Starting analysis...", progress: 0 } });
    
    try {
      const suggestions = await pollWithHeartbeat(
        id,
        (step, progress) => {
          // Update progress in real-time
          set(state => ({
            scan: { ...state.scan, step, progress } as AIScan
          }));
        },
        { maxMs: 120000, maxSilenceMs: 30000 }
      );
      
      // Success state
      const hasConfidentSuggestion = suggestions && suggestions.confidence >= 0.7;
      set({
        scan: {
          state: hasConfidentSuggestion ? 'ready' : 'partial',
          id,
          count: suggestions?.fields?.length ?? 0,
          fields: suggestions?.fields ?? [],
          suggestion: suggestions,
          suggestions: suggestions
        }
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      const isTimeout = errorMessage.includes('Timeout') || errorMessage.includes('heartbeat');
      
      set({
        scan: {
          state: isTimeout ? 'timeout' : 'failed',
          id,
          message: errorMessage,
          error: errorMessage,
          stage: isTimeout ? 'timeout' : 'unknown',
          code: isTimeout ? 408 : 500
        }
      });
    }
  },
  
  update: (next) => set((s) => ({ scan: { ...s.scan, ...next } as AIScan })),
  reset: () => set({ scan: { state: "idle" } }),
  setProgress: (step, progress) => {
    set(state => {
      if (state.scan.state === 'analyzing') {
        return {
          scan: { ...state.scan, step, progress } as AIScan
        };
      }
      return state;
    });
  }
}));