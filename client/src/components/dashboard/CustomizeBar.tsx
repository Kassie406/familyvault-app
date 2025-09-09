"use client";
import { CARD_REGISTRY, CardId } from "@/lib/dashboard/cards";
import { Settings, RotateCcw } from "lucide-react";

export function CustomizeBar({
  hiddenIds, onShow, onReset, editing, setEditing,
}: {
  hiddenIds: CardId[];
  onShow: (id: CardId) => void;
  onReset: () => void;
  editing: boolean;
  setEditing: (b: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4 p-4 rounded-2xl border border-white/10 bg-white/5">
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4 text-[#D4AF37]" />
        <span className="text-white font-medium">Dashboard Layout</span>
      </div>
      
      <div className="flex items-center gap-3">
        {editing && hiddenIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">Hidden:</span>
            <div className="flex gap-2">
              {hiddenIds.map((id) => {
                const title = CARD_REGISTRY.find((c) => c.id === id)?.title ?? id;
                return (
                  <button 
                    key={id} 
                    onClick={() => onShow(id)} 
                    className="px-2 py-1 text-xs rounded-lg bg-[#2A2A33] text-white/80 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-colors"
                    data-testid={`show-${id}`}
                  >
                    + {title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {editing && (
          <button 
            onClick={onReset} 
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2A2A33] text-white/80 hover:bg-red-500/20 hover:text-red-400 transition-colors"
            data-testid="reset-layout"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
        
        <button 
          onClick={() => setEditing(!editing)} 
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            editing 
              ? 'bg-[#D4AF37] text-black hover:bg-[#B8860B]' 
              : 'bg-[#2A2A33] text-white hover:bg-[#D4AF37]/20 hover:text-[#D4AF37]'
          }`}
          data-testid="customize-toggle"
        >
          {editing ? "Done" : "Customize"}
        </button>
      </div>
    </div>
  );
}