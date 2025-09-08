import { useState } from 'react';
import { Heart, Calendar, Target, Lightbulb } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

type ActionType = 'memory' | 'plan_date' | 'love_note' | 'goal';

interface QuickAction {
  type: ActionType;
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    type: 'memory',
    icon: <Heart className="w-4 h-4" />,
    label: 'Add Memory',
    placeholder: 'What special moment do you want to remember?',
    color: 'text-pink-400'
  },
  {
    type: 'plan_date',
    icon: <Calendar className="w-4 h-4" />,
    label: 'Plan Date',
    placeholder: 'What date idea sounds fun?',
    color: 'text-blue-400'
  },
  {
    type: 'love_note',
    icon: <Heart className="w-4 h-4" />,
    label: 'Send Love Note',
    placeholder: 'What do you want to tell them?',
    color: 'text-red-400'
  },
  {
    type: 'goal',
    icon: <Target className="w-4 h-4" />,
    label: 'Set Goals',
    placeholder: 'What goal do you want to work on together?',
    color: 'text-green-400'
  }
];

export default function CouplesQuickActions() {
  const [open, setOpen] = useState<ActionType | null>(null);
  const [title, setTitle] = useState('');
  const [extra, setExtra] = useState('');
  const { toast } = useToast();

  const createActivityMutation = useMutation({
    mutationFn: async (data: { type: ActionType; title: string; payload?: any }) => {
      return apiRequest('/api/couple/activities/quick', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/couple/activities'] });
      setOpen(null);
      setTitle('');
      setExtra('');
      toast({
        title: "Added to feed!",
        description: "Your activity has been saved.",
      });
      // Dispatch custom event for feed refresh
      document.dispatchEvent(new Event('feed:update'));
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save activity. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    createActivityMutation.mutate({
      type: open!,
      title: title.trim(),
      payload: extra.trim() ? { details: extra.trim() } : {}
    });
  };

  const currentAction = quickActions.find(action => action.type === open);

  return (
    <>
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4" data-testid="quick-actions-card">
        <div className="text-sm text-neutral-400 mb-3">QUICK ACTIONS</div>
        <div className="grid gap-2">
          {quickActions.map((action) => (
            <button
              key={action.type}
              onClick={() => setOpen(action.type)}
              className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-neutral-800 transition-colors group"
              data-testid={`button-${action.type.replace('_', '-')}`}
            >
              <span className={`${action.color} group-hover:text-[#D4AF37] transition-colors`}>
                {action.icon}
              </span>
              <span className="text-neutral-200 group-hover:text-white transition-colors">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {open && currentAction && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" data-testid="activity-modal">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <span className={`${currentAction.color}`}>
                {currentAction.icon}
              </span>
              <h3 className="text-xl font-semibold text-white">
                {currentAction.label}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Title
                </label>
                <input
                  className="w-full h-11 px-3 rounded-lg border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                  placeholder={currentAction.placeholder}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  data-testid="input-activity-title"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Details (optional)
                </label>
                <textarea
                  className="w-full h-24 p-3 rounded-lg border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors resize-none"
                  placeholder="Add any additional details..."
                  value={extra}
                  onChange={e => setExtra(e.target.value)}
                  data-testid="input-activity-details"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                className="px-4 h-10 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
                onClick={() => setOpen(null)}
                data-testid="button-cancel"
              >
                Cancel
              </button>
              <button
                className="px-6 h-10 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#B8941F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={!title.trim() || createActivityMutation.isPending}
                data-testid="button-save"
              >
                {createActivityMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}