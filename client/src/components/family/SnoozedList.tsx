import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SnoozedItem {
  id: string;
  updateId: string;
  until: string;
  update?: {
    id: string;
    title: string;
    type: string;
    severity: string;
  };
}

interface SnoozedListProps {
  onRestored?: (updateId: string) => void;
}

export default function SnoozedList({ onRestored }: SnoozedListProps) {
  const [items, setItems] = useState<SnoozedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/updates/snoozed");
      const data = await response.json();
      setItems(data.items ?? []);
    } catch (error) {
      console.error("Failed to load snoozed updates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const unsnooze = async (updateId: string) => {
    try {
      const response = await fetch(`/api/updates/${updateId}/unsnooze`, {
        method: "POST",
      });
      
      if (response.ok) {
        setItems(prev => prev.filter(x => x.updateId !== updateId));
        onRestored?.(updateId);
        toast({
          title: "Snooze reset — notice restored",
          variant: "default",
        });
      } else {
        toast({
          title: "Could not reset snooze",
          description: "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to unsnooze update:", error);
      toast({
        title: "Could not reset snooze",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="mt-3 border-t border-zinc-800 pt-3">
        <div className="text-xs text-white/50 mb-2">Loading snoozed updates...</div>
      </div>
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <div className="mt-6 border-t border-zinc-800 pt-4">
      <div className="text-sm text-white/70 mb-3 font-medium">Snoozed until…</div>
      <ul className="space-y-3">
        {items.map(snooze => (
          <li 
            key={snooze.id} 
            className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-800"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white text-sm">
                {snooze.update?.title ?? 'Update'}
              </div>
              <div className="text-xs text-white/50 mt-1">
                Until {new Date(snooze.until).toLocaleString()}
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-200 ml-3"
              onClick={() => unsnooze(snooze.updateId)}
              data-testid={`unsnooze-button-${snooze.updateId}`}
            >
              Reset snooze
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}