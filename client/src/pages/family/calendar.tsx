import GoogleStyleCalendar from '@/components/calendar/GoogleStyleCalendar';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-900)] p-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/family">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Family Calendar</h1>
        </div>
      </div>

      {/* Full Calendar */}
      <div className="h-[calc(100vh-8rem)] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <GoogleStyleCalendar />
      </div>
    </div>
  );
}