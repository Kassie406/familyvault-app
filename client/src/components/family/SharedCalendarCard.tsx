import GoogleStyleCalendar from '@/components/calendar/GoogleStyleCalendar';

export function SharedCalendarCard() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden h-[600px]">
      <GoogleStyleCalendar />
    </div>
  );
}