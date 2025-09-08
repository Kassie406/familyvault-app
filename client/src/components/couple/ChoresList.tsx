import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CheckCircle, Plus, Calendar } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { CoupleChore } from '@shared/schema';

export default function ChoresList() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChoreTitle, setNewChoreTitle] = useState('');
  const [newChoreDue, setNewChoreDue] = useState('');
  const { toast } = useToast();

  const { data: chores = [], isLoading } = useQuery({
    queryKey: ['/api/couple/chores'],
    retry: false
  });

  const completeChore = useMutation({
    mutationFn: async (choreId: string) => {
      return apiRequest(`/api/couple/chores/${choreId}/complete`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/couple/chores'] });
      document.dispatchEvent(new Event('feed:update'));
      toast({
        title: "Chore completed!",
        description: "Great job! Points added to your activity feed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete chore. Please try again.",
        variant: "destructive"
      });
    }
  });

  const addChore = useMutation({
    mutationFn: async (data: { title: string; dueOn?: string; points?: number }) => {
      return apiRequest('/api/couple/chores', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/couple/chores'] });
      setNewChoreTitle('');
      setNewChoreDue('');
      setShowAddForm(false);
      toast({
        title: "Chore added!",
        description: "New chore has been added to your list.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add chore. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleAddChore = () => {
    if (!newChoreTitle.trim()) return;

    addChore.mutate({
      title: newChoreTitle.trim(),
      dueOn: newChoreDue || undefined,
      points: 10
    });
  };

  const formatDueDate = (dueOn: string) => {
    const date = new Date(dueOn);
    const today = new Date();
    const diffMs = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: 'Overdue', class: 'text-red-400' };
    } else if (diffDays === 0) {
      return { text: 'Due today', class: 'text-yellow-400' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', class: 'text-orange-400' };
    } else if (diffDays < 7) {
      return { text: `Due in ${diffDays} days`, class: 'text-neutral-400' };
    } else {
      return { text: `Due ${date.toLocaleDateString()}`, class: 'text-neutral-500' };
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900" data-testid="chores-loading">
        <div className="p-4 border-b border-neutral-800 font-medium text-white">Chores</div>
        <div className="p-4">
          <div className="animate-pulse text-neutral-500">Loading chores...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900" data-testid="chores-list">
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <h3 className="font-medium text-white">Chores</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#B8941F] transition-colors"
          data-testid="button-add-chore"
        >
          <Plus className="w-4 h-4" />
          Add Chore
        </button>
      </div>

      {showAddForm && (
        <div className="p-4 border-b border-neutral-800 bg-neutral-800/30" data-testid="add-chore-form">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newChoreTitle}
              onChange={(e) => setNewChoreTitle(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
              data-testid="input-chore-title"
              autoFocus
            />
            <input
              type="date"
              value={newChoreDue}
              onChange={(e) => setNewChoreDue(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
              data-testid="input-chore-due"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddChore}
                disabled={!newChoreTitle.trim() || addChore.isPending}
                className="px-4 py-2 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#B8941F] transition-colors disabled:opacity-50"
                data-testid="button-save-chore"
              >
                {addChore.isPending ? 'Adding...' : 'Add'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewChoreTitle('');
                  setNewChoreDue('');
                }}
                className="px-4 py-2 bg-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-600 transition-colors"
                data-testid="button-cancel-chore"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {chores.length === 0 ? (
        <div className="p-6 text-center text-neutral-500" data-testid="text-no-chores">
          No chores yet. Add one to get started!
        </div>
      ) : (
        <div className="divide-y divide-neutral-800">
          {chores.map((chore: CoupleChore) => (
            <div 
              key={chore.id} 
              className="p-4 flex items-center justify-between hover:bg-neutral-800/30 transition-colors"
              data-testid={`chore-item-${chore.id}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-neutral-200 truncate">
                    {chore.title}
                  </h4>
                  {chore.completedAt && (
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  )}
                </div>
                
                {chore.dueOn && !chore.completedAt && (
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    <span className={`text-xs ${formatDueDate(chore.dueOn).class}`}>
                      {formatDueDate(chore.dueOn).text}
                    </span>
                  </div>
                )}

                {chore.completedAt && (
                  <div className="text-xs text-green-400 mt-1">
                    Completed {new Date(chore.completedAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 ml-4">
                {chore.points > 0 && (
                  <span className="text-sm text-[#D4AF37] font-medium">
                    +{chore.points}
                  </span>
                )}
                
                {chore.completedAt ? (
                  <span className="text-xs text-green-400 font-medium px-3 py-1 bg-green-400/10 rounded-full">
                    Completed
                  </span>
                ) : (
                  <button
                    onClick={() => completeChore.mutate(chore.id)}
                    disabled={completeChore.isPending}
                    className="px-3 py-1.5 bg-[#D4AF37] text-black text-sm font-medium rounded-lg hover:bg-[#B8941F] transition-colors disabled:opacity-50"
                    data-testid={`button-complete-${chore.id}`}
                  >
                    {completeChore.isPending ? 'Completing...' : `Mark done (+${chore.points})`}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}