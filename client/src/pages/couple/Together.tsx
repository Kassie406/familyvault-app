import CouplesQuickActions from '@/components/couple/CouplesQuickActions';
import ActivityFeed from '@/components/couple/ActivityFeed';
import ChoresList from '@/components/couple/ChoresList';

export default function Together() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 p-6" data-testid="page-header">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 rounded border border-[#D4AF37] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>
            </div>
            <div className="text-sm text-[#D4AF37] font-medium">
              Couple's Connection
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Together
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Activity Feed */}
          <div className="space-y-6">
            <ActivityFeed />
          </div>
          
          {/* Quick Actions */}
          <div className="space-y-6">
            <CouplesQuickActions />
          </div>
        </div>

        {/* Chores Section (Full Width) */}
        <div>
          <ChoresList />
        </div>
      </div>
    </div>
  );
}