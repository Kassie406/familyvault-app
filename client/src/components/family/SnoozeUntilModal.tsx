import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PauseCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

type FamilyUpdateType = {
  id: string;
  type: string;
  title: string;
  body: string;
  severity: 'info' | 'warning' | 'urgent';
  dueAt: string | null;
  actionUrl: string | null;
  metadata: any;
  isDismissed: boolean;
  createdAt: string;
};

interface SnoozeUntilModalProps {
  update: FamilyUpdateType;
  onSnoozed: (updateId: string) => void;
}

export default function SnoozeUntilModal({ update, onSnoozed }: SnoozeUntilModalProps) {
  const [open, setOpen] = useState(false);
  const [snoozeUntil, setSnoozeUntil] = useState('');

  // Calculate min and max dates
  const now = new Date();
  const minDate = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
  const maxDate = update.dueAt 
    ? new Date(update.dueAt) 
    : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

  const formatDateTimeLocal = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const snoozeMutation = useMutation({
    mutationFn: async (until?: string) => {
      const body = until ? { until } : {};
      const response = await fetch(`/api/updates/${update.id}/snooze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return response.json();
    },
    onSuccess: () => {
      onSnoozed(update.id);
      setOpen(false);
      setSnoozeUntil('');
    }
  });

  const handleQuickSnooze = (hours: number) => {
    const until = new Date(now.getTime() + hours * 60 * 60 * 1000);
    snoozeMutation.mutate(until.toISOString());
  };

  const handleCustomSnooze = () => {
    if (!snoozeUntil) return;
    snoozeMutation.mutate(snoozeUntil);
  };

  const getHintText = () => {
    if (update.dueAt) {
      return `You can snooze up to the due time: ${new Date(update.dueAt).toLocaleString()}`;
    }
    return 'Max 30 days.';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200 h-8 w-8 p-0"
          data-testid={`snooze-button-${update.id}`}
          title="Snooze until..."
        >
          <PauseCircle className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-[#D4AF37]">Snooze Update</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-white/70 mb-3">
              {update.title}
            </p>
            <p className="text-xs text-white/50 mb-4">
              {getHintText()}
            </p>
          </div>

          {/* Quick snooze buttons */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick snooze</Label>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-700 text-white hover:bg-zinc-800"
                onClick={() => handleQuickSnooze(1)}
                disabled={snoozeMutation.isPending}
              >
                1 hour
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-700 text-white hover:bg-zinc-800"
                onClick={() => handleQuickSnooze(24)}
                disabled={snoozeMutation.isPending}
              >
                1 day
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-700 text-white hover:bg-zinc-800"
                onClick={() => handleQuickSnooze(24 * 7)}
                disabled={snoozeMutation.isPending}
              >
                1 week
              </Button>
            </div>
          </div>

          {/* Custom snooze */}
          <div className="space-y-2">
            <Label htmlFor="snooze-until" className="text-sm font-medium">
              Custom snooze until
            </Label>
            <Input
              id="snooze-until"
              type="datetime-local"
              value={snoozeUntil}
              onChange={(e) => setSnoozeUntil(e.target.value)}
              min={formatDateTimeLocal(minDate)}
              max={formatDateTimeLocal(maxDate)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-zinc-700 text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCustomSnooze}
              disabled={!snoozeUntil || snoozeMutation.isPending}
              className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
            >
              {snoozeMutation.isPending ? 'Snoozing...' : 'Snooze'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}