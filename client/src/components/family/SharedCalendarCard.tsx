import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { SharedCalendar } from './SharedCalendar';

export function SharedCalendarCard() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#D4AF37]/10">
            <Calendar className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-gray-200 font-semibold">Shared Calendar</h3>
            <p className="text-xs text-gray-500">Family events & schedules</p>
          </div>
        </div>
        
        {/* Calendar controls (subtle gray) */}
        <div className="flex items-center gap-2">
          <button className="p-1 rounded hover:bg-zinc-800 transition-colors">
            <ChevronLeft className="h-4 w-4 text-gray-400" />
          </button>
          <button className="p-1 rounded hover:bg-zinc-800 transition-colors">
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
          <div className="ml-2 text-xs text-gray-500">
            Month
          </div>
        </div>
      </div>

      {/* Calendar Body */}
      <div className="calendar-container">
        <SharedCalendar />
      </div>
    </div>
  );
}