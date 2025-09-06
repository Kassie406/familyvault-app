import { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalIcon,
  MapPin,
  FileText,
  X,
  Clock,
  MoreHorizontal,
  Grid3X3,
  List,
  Eye,
  EyeOff,
  Menu,
  Download,
  Repeat
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Types
interface RecurrenceRule {
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  interval: number;
  byWeekday?: string[]; // ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
  count?: number;
  until?: Date;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  location?: string;
  notes?: string;
  color?: string;
  recurrence?: RecurrenceRule;
  calendar?: string;
}

type ViewType = 'month' | 'week' | 'day';

interface CalendarState {
  view: ViewType;
  currentDate: Date;
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  isEventModalOpen: boolean;
  eventModalMode: 'create' | 'edit';
  newEventDate: Date | null;
  sidebarOpen: boolean;
}

// Color options for events
const eventColors = [
  '#D4AF37', // Gold (default)
  '#EF4444', // Red
  '#10B981', // Green  
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#6B7280'  // Gray
];

// Calendar labels and icons
const Circle = ({ className, style }: { className: string; style?: any }) => (
  <div className={`rounded-full ${className}`} style={style} />
);

// Right Shortcuts Component
function RightShortcuts({ onCreate, className }: { onCreate: () => void; className?: string }) {
  return (
    <aside className={`hidden xl:flex xl:flex-col p-4 ${className || ''}`}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4">
        <div className="text-sm font-medium mb-3 text-gray-300">Shortcuts</div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={onCreate}
            className="w-full justify-start bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create event
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start border-zinc-700 text-gray-300 hover:bg-zinc-800"
            size="sm"
          >
            <CalIcon className="h-4 w-4 mr-2" />
            Tasks
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start border-zinc-700 text-gray-300 hover:bg-zinc-800"
            size="sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Notes
          </Button>
        </div>
      </div>
    </aside>
  );
}

// Utility functions
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

const startOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day;
  result.setDate(diff);
  return result;
};

const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const getMonthDays = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const startWeek = startOfWeek(start);
  
  const days: Date[] = [];
  let current = startWeek;
  
  // Get 6 weeks to fill the calendar grid
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }
  
  return days;
};

const getWeekDays = (date: Date): Date[] => {
  const start = startOfWeek(date);
  const days: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i));
  }
  
  return days;
};

const toLocalISOString = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().slice(0, 16);
};

export default function GoogleStyleCalendar() {
  const [state, setState] = useState<CalendarState>({
    view: 'month',
    currentDate: new Date(),
    events: [
      {
        id: '1',
        title: 'Family Movie Night',
        start: new Date(2025, 0, 30, 19, 0),
        end: new Date(2025, 0, 30, 21, 30),
        color: '#D4AF37',
        location: 'Living Room',
        calendar: 'Family Events'
      },
      {
        id: '2',
        title: 'Soccer Practice',
        start: new Date(2025, 0, 31, 16, 0),
        end: new Date(2025, 0, 31, 17, 30),
        color: '#3B82F6',
        location: 'Community Center',
        calendar: 'Personal'
      },
      {
        id: '3',
        title: 'Birthday Party',
        start: new Date(2025, 1, 2, 14, 0),
        end: new Date(2025, 1, 2, 17, 0),
        color: '#EF4444',
        location: 'Park',
        calendar: 'Birthdays'
      },
      {
        id: '4',
        title: 'Martin Luther King Jr. Day',
        start: new Date(2025, 0, 20, 0, 0),
        end: new Date(2025, 0, 20, 23, 59),
        color: '#10B981',
        allDay: true,
        calendar: 'Holidays in United States'
      }
    ],
    selectedEvent: null,
    isEventModalOpen: false,
    eventModalMode: 'create',
    newEventDate: null,
    sidebarOpen: true
  });

  // Calendar visibility state - exactly like your image
  const [myCals, setMyCals] = useState<Record<string, boolean>>({
    'Family Events': true,
    'Personal': true,
    'Work': true,
    'Birthdays': true
  });
  const [otherCals, setOtherCals] = useState<Record<string, boolean>>({
    'Holidays in United States': true
  });

  // Filter events by calendar visibility (memoized for performance)
  const filteredEvents = useMemo(() => {
    return state.events.filter(event => {
      // Check calendar visibility
      const allCalendars: Record<string, boolean> = { ...myCals, ...otherCals };
      if (event.calendar && allCalendars[event.calendar] === false) {
        return false;
      }
      return true;
    });
  }, [state.events, myCals, otherCals]);


  // Navigation functions
  const goToToday = () => {
    setState(prev => ({ ...prev, currentDate: new Date() }));
  };

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  };

  const navigatePrevious = () => {
    setState(prev => ({
      ...prev,
      currentDate: prev.view === 'month' 
        ? addMonths(prev.currentDate, -1)
        : prev.view === 'week'
        ? addDays(prev.currentDate, -7)
        : addDays(prev.currentDate, -1)
    }));
  };

  const navigateNext = () => {
    setState(prev => ({
      ...prev,
      currentDate: prev.view === 'month' 
        ? addMonths(prev.currentDate, 1)
        : prev.view === 'week'
        ? addDays(prev.currentDate, 7)
        : addDays(prev.currentDate, 1)
    }));
  };

  const changeView = (view: ViewType) => {
    setState(prev => ({ ...prev, view }));
  };

  // Event functions
  const openEventModal = (mode: 'create' | 'edit', event?: CalendarEvent, date?: Date) => {
    setState(prev => ({
      ...prev,
      isEventModalOpen: true,
      eventModalMode: mode,
      selectedEvent: event || null,
      newEventDate: date || null
    }));
  };

  // ICS Export function
  const exportToICS = () => {
    const formatICSDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const formatRecurrence = (recurrence?: RecurrenceRule): string => {
      if (!recurrence) return '';
      
      let rrule = `RRULE:FREQ=${recurrence.freq}`;
      if (recurrence.interval > 1) {
        rrule += `;INTERVAL=${recurrence.interval}`;
      }
      if (recurrence.freq === 'WEEKLY' && recurrence.byWeekday?.length) {
        rrule += `;BYDAY=${recurrence.byWeekday.join(',')}`;
      }
      if (recurrence.count) {
        rrule += `;COUNT=${recurrence.count}`;
      }
      if (recurrence.until) {
        rrule += `;UNTIL=${formatICSDate(recurrence.until)}`;
      }
      return rrule;
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Family Vault//Family Calendar//EN',
      'CALSCALE:GREGORIAN',
      ...state.events.map(event => [
        'BEGIN:VEVENT',
        `UID:${event.id}@familyvault.com`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${formatICSDate(event.start)}`,
        `DTEND:${formatICSDate(event.end)}`,
        `SUMMARY:${event.title}`,
        event.location ? `LOCATION:${event.location}` : '',
        event.notes ? `DESCRIPTION:${event.notes}` : '',
        formatRecurrence(event.recurrence),
        'END:VEVENT'
      ].filter(Boolean)).flat(),
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'family-calendar.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const closeEventModal = () => {
    setState(prev => ({
      ...prev,
      isEventModalOpen: false,
      selectedEvent: null,
      newEventDate: null
    }));
  };

  const createEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString()
    };
    
    setState(prev => ({
      ...prev,
      events: [...prev.events, newEvent]
    }));
  };

  const updateEvent = (id: string, eventData: Omit<CalendarEvent, 'id'>) => {
    setState(prev => ({
      ...prev,
      events: prev.events.map(event => 
        event.id === id ? { ...eventData, id } : event
      )
    }));
  };

  const deleteEvent = (id: string) => {
    setState(prev => ({
      ...prev,
      events: prev.events.filter(event => event.id !== id)
    }));
  };

  // Get title for current view
  const getViewTitle = () => {
    const { view, currentDate } = state;
    
    if (view === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (view === 'week') {
      const weekDays = getWeekDays(currentDate);
      const start = weekDays[0];
      const end = weekDays[6];
      
      if (start.getMonth() === end.getMonth()) {
        return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
      } else {
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${start.getFullYear()}`;
      }
    } else {
      return formatDate(currentDate);
    }
  };

  return (
    <div className="h-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden grid grid-cols-12">
      {/* Left Sidebar */}
      {state.sidebarOpen && (
        <div className="col-span-3 bg-zinc-900 border-r border-zinc-800 p-4">
        {/* Mini Calendar */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <CalIcon className="h-4 w-4 text-[#D4AF37]" />
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <MiniCalendar 
            currentDate={state.currentDate}
            onDateSelect={(date) => setState(prev => ({ ...prev, currentDate: date }))}
          />
        </div>

        {/* My Calendars */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">My calendars</h3>
          <div className="space-y-2">
            {Object.keys(myCals).map((calName, i) => (
              <label key={calName} className="flex items-center gap-2 cursor-pointer select-none text-sm">
                <input
                  type="checkbox"
                  checked={myCals[calName]}
                  onChange={() => setMyCals(prev => ({ ...prev, [calName]: !prev[calName] }))}
                  className="accent-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <Circle className="h-3 w-3" style={{ backgroundColor: eventColors[i % eventColors.length] }} />
                <span className="text-gray-300">{calName}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Other Calendars */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Other calendars</h3>
          <div className="space-y-2">
            {Object.keys(otherCals).map((calName, i) => (
              <label key={calName} className="flex items-center gap-2 cursor-pointer select-none text-sm">
                <input
                  type="checkbox"
                  checked={otherCals[calName]}
                  onChange={() => setOtherCals(prev => ({ ...prev, [calName]: !prev[calName] }))}
                  className="accent-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <Circle className="h-3 w-3" style={{ backgroundColor: eventColors[(i + Object.keys(myCals).length) % eventColors.length] }} />
                <span className="text-gray-300">{calName}</span>
              </label>
            ))}
          </div>
        </div>
        </div>
      )}

      {/* Main Calendar */}
      <div className={`${state.sidebarOpen ? 'col-span-7' : 'col-span-10'} flex flex-col`}>
        {/* Toolbar */}
        <div className="border-b border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Sidebar Toggle */}
              <Button
                onClick={toggleSidebar}
                variant="outline"
                size="sm"
                className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] bg-zinc-800"
                title={state.sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              {/* Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={goToToday}
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-gray-300 hover:bg-zinc-800"
                >
                  Today
                </Button>
                <Button
                  onClick={navigatePrevious}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-300 hover:bg-zinc-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  onClick={navigateNext}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-300 hover:bg-zinc-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Title */}
              <h1 className="text-xl font-semibold text-white">
                {getViewTitle()}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* View Switcher */}
              <div className="flex items-center bg-zinc-800 rounded-lg p-1">
                {(['month', 'week', 'day'] as ViewType[]).map(view => (
                  <button
                    key={view}
                    onClick={() => changeView(view)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      state.view === view
                        ? 'bg-[#D4AF37] text-black font-medium'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>

              {/* Export ICS Button */}
              <Button
                onClick={exportToICS}
                variant="outline"
                size="sm"
                className="border-zinc-700 text-gray-300 hover:bg-zinc-800 mr-2"
                title="Export to ICS file"
              >
                <Download className="h-4 w-4 mr-2" />
                Export ICS
              </Button>

              {/* Add Event Button */}
              <Button
                onClick={() => openEventModal('create', undefined, state.currentDate)}
                className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="flex-1 overflow-hidden">
          {state.view === 'month' && (
            <MonthView 
              currentDate={state.currentDate}
              events={filteredEvents}
              onDateClick={(date) => openEventModal('create', undefined, date)}
              onEventClick={(event) => openEventModal('edit', event)}
            />
          )}
          {state.view === 'week' && (
            <WeekView 
              currentDate={state.currentDate}
              events={filteredEvents}
              onTimeSlotClick={(date) => openEventModal('create', undefined, date)}
              onEventClick={(event) => openEventModal('edit', event)}
            />
          )}
          {state.view === 'day' && (
            <DayView 
              currentDate={state.currentDate}
              events={filteredEvents}
              onTimeSlotClick={(date) => openEventModal('create', undefined, date)}
              onEventClick={(event) => openEventModal('edit', event)}
            />
          )}
        </div>
      </div>

      {/* Right Shortcuts Sidebar */}
      <RightShortcuts 
        onCreate={() => openEventModal('create', undefined, state.currentDate)}
        className={state.sidebarOpen ? 'col-span-2' : 'col-span-2'}
      />

      {/* Event Modal */}
      {state.isEventModalOpen && (
        <EventModal
          mode={state.eventModalMode}
          event={state.selectedEvent}
          defaultDate={state.newEventDate}
          onClose={closeEventModal}
          onCreate={createEvent}
          onUpdate={updateEvent}
          onDelete={deleteEvent}
        />
      )}
    </div>
  );
}

// Mini Calendar Component
function MiniCalendar({ currentDate, onDateSelect }: { 
  currentDate: Date; 
  onDateSelect: (date: Date) => void; 
}) {
  const [displayDate, setDisplayDate] = useState(new Date());
  const days = getMonthDays(displayDate);
  const today = new Date();
  
  return (
    <div className="text-xs">
      {/* Mini calendar header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setDisplayDate(addMonths(displayDate, -1))}
          className="p-1 hover:bg-zinc-800 rounded"
        >
          <ChevronLeft className="h-3 w-3 text-gray-400" />
        </button>
        <span className="text-gray-300 font-medium">
          {displayDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
        <button
          onClick={() => setDisplayDate(addMonths(displayDate, 1))}
          className="p-1 hover:bg-zinc-800 rounded"
        >
          <ChevronRight className="h-3 w-3 text-gray-400" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center text-gray-500 font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === displayDate.getMonth();
          const isToday = isSameDay(day, today);
          const isSelected = isSameDay(day, currentDate);
          
          return (
            <button
              key={index}
              onClick={() => onDateSelect(day)}
              className={`
                h-6 w-6 text-center rounded-sm transition-colors
                ${!isCurrentMonth ? 'text-gray-600' : 'text-gray-300'}
                ${isToday ? 'bg-[#D4AF37] text-black font-bold' : ''}
                ${isSelected && !isToday ? 'bg-zinc-700 text-white' : ''}
                ${isCurrentMonth && !isToday && !isSelected ? 'hover:bg-zinc-800' : ''}
              `}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Month View Component  
function MonthView({ 
  currentDate, 
  events, 
  onDateClick, 
  onEventClick 
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}) {
  const days = getMonthDays(currentDate);
  const today = new Date();
  
  return (
    <div className="h-full flex flex-col">
      {/* Days of week header */}
      <div className="grid grid-cols-7 border-b border-zinc-800">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-400 border-r border-zinc-800 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(day, today);
          const dayEvents = events.filter(event => isSameDay(event.start, day));
          
          return (
            <div
              key={index}
              className={`
                border-r border-b border-zinc-800 last:border-r-0 p-2 min-h-0
                ${!isCurrentMonth ? 'bg-zinc-900/50' : 'bg-zinc-900'}
                hover:bg-zinc-800/50 cursor-pointer transition-colors
              `}
              onClick={() => onDateClick(day)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`
                  text-sm font-medium
                  ${!isCurrentMonth ? 'text-gray-600' : 'text-gray-300'}
                  ${isToday ? 'bg-[#D4AF37] text-black rounded-full w-6 h-6 flex items-center justify-center' : ''}
                `}>
                  {day.getDate()}
                </span>
              </div>
              
              {/* Events */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className="text-xs px-2 py-1 rounded text-white cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: event.color || '#D4AF37' }}
                  >
                    {event.allDay ? event.title : `${formatTime(event.start)} ${event.title}`}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 px-2">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Week View Component
function WeekView({ 
  currentDate, 
  events, 
  onTimeSlotClick, 
  onEventClick 
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onTimeSlotClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}) {
  const weekDays = getWeekDays(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <div className="h-full flex flex-col">
      {/* Week header */}
      <div className="grid grid-cols-8 border-b border-zinc-800">
        <div className="p-3"></div> {/* Empty corner */}
        {weekDays.map(day => (
          <div key={day.toISOString()} className="p-3 text-center border-r border-zinc-800 last:border-r-0">
            <div className="text-sm font-medium text-gray-400">
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={`
              text-lg font-semibold mt-1
              ${isSameDay(day, new Date()) ? 'bg-[#D4AF37] text-black rounded-full w-8 h-8 flex items-center justify-center mx-auto' : 'text-gray-300'}
            `}>
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-8 min-h-full">
          {/* Time labels */}
          <div className="border-r border-zinc-800">
            {hours.map(hour => (
              <div key={hour} className="h-16 border-b border-zinc-800 p-2 text-xs text-gray-500">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
            ))}
          </div>

          {/* Days */}
          {weekDays.map(day => (
            <div key={day.toISOString()} className="border-r border-zinc-800 last:border-r-0 relative">
              {hours.map(hour => (
                <div
                  key={hour}
                  className="h-16 border-b border-zinc-800 hover:bg-zinc-800/30 cursor-pointer"
                  onClick={() => {
                    const clickDate = new Date(day);
                    clickDate.setHours(hour, 0, 0, 0);
                    onTimeSlotClick(clickDate);
                  }}
                />
              ))}
              
              {/* Events for this day */}
              {events
                .filter(event => isSameDay(event.start, day))
                .map(event => {
                  const startHour = event.start.getHours() + event.start.getMinutes() / 60;
                  const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
                  
                  return (
                    <div
                      key={event.id}
                      className="absolute left-1 right-1 rounded text-white text-xs p-1 cursor-pointer hover:opacity-80"
                      style={{
                        top: `${startHour * 4}rem`,
                        height: `${Math.max(duration * 4, 1)}rem`,
                        backgroundColor: event.color || '#D4AF37'
                      }}
                      onClick={() => onEventClick(event)}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      {!event.allDay && (
                        <div className="opacity-90">{formatTime(event.start)}</div>
                      )}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Day View Component
function DayView({ 
  currentDate, 
  events, 
  onTimeSlotClick, 
  onEventClick 
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onTimeSlotClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}) {
  return (
    <WeekView 
      currentDate={currentDate}
      events={events.filter(event => isSameDay(event.start, currentDate))}
      onTimeSlotClick={onTimeSlotClick}
      onEventClick={onEventClick}
    />
  );
}

// Event Modal Component
function EventModal({
  mode,
  event,
  defaultDate,
  onClose,
  onCreate,
  onUpdate,
  onDelete
}: {
  mode: 'create' | 'edit';
  event?: CalendarEvent | null;
  defaultDate?: Date | null;
  onClose: () => void;
  onCreate: (eventData: Omit<CalendarEvent, 'id'>) => void;
  onUpdate: (id: string, eventData: Omit<CalendarEvent, 'id'>) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState(event?.title || '');
  const [allDay, setAllDay] = useState(event?.allDay || false);
  const [start, setStart] = useState(
    event?.start ? toLocalISOString(event.start) : 
    defaultDate ? toLocalISOString(defaultDate) : 
    toLocalISOString(new Date())
  );
  const [end, setEnd] = useState(
    event?.end ? toLocalISOString(event.end) : 
    defaultDate ? toLocalISOString(addDays(defaultDate, 1)) : 
    toLocalISOString(addDays(new Date(), 1))
  );
  const [location, setLocation] = useState(event?.location || '');
  const [notes, setNotes] = useState(event?.notes || '');
  const [color, setColor] = useState(event?.color || eventColors[0]);
  
  // Recurrence state
  const [recur, setRecur] = useState(event?.recurrence ? 'custom' : 'none');
  const [freq, setFreq] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>(event?.recurrence?.freq || 'WEEKLY');
  const [interval, setInterval] = useState(event?.recurrence?.interval || 1);
  const [byWeekday, setByWeekday] = useState<string[]>(event?.recurrence?.byWeekday || []);
  
  // Recurrence end options
  const [endMode, setEndMode] = useState(
    event?.recurrence?.count ? 'count' :
    event?.recurrence?.until ? 'until' : 'never'
  );
  const [count, setCount] = useState(event?.recurrence?.count || 10);
  const [until, setUntil] = useState(
    event?.recurrence?.until
      ? toLocalISOString(event.recurrence.until)
      : toLocalISOString(addDays(new Date(start), 30))
  );
  
  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekCodes = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  
  const toggleWeekday = (code: string) => {
    setByWeekday(prev => 
      prev.includes(code) 
        ? prev.filter(d => d !== code)
        : [...prev, code]
    );
  };
  
  const buildRecurrenceRule = (): RecurrenceRule | undefined => {
    if (recur === 'none') return undefined;
    const rule: RecurrenceRule = { freq, interval };
    if (freq === 'WEEKLY' && byWeekday.length) {
      rule.byWeekday = byWeekday;
    }
    if (endMode === 'count') {
      rule.count = Math.max(1, Number(count) || 1);
    }
    if (endMode === 'until') {
      rule.until = new Date(until);
    }
    return rule;
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    const eventData = {
      title: title.trim(),
      start: new Date(start),
      end: new Date(end),
      allDay,
      location: location.trim(),
      notes: notes.trim(),
      color,
      recurrence: buildRecurrenceRule(),
      calendar: mode === 'create' ? 'Family Events' : event?.calendar || 'Family Events'
    };

    if (mode === 'create') {
      onCreate(eventData);
    } else if (event) {
      onUpdate(event.id, eventData);
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (event) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalIcon className="h-5 w-5 text-[#D4AF37]" />
            <h2 className="text-lg font-semibold text-white">
              {mode === 'create' ? 'New Event' : 'Edit Event'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              autoFocus
            />
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="allDay"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37] bg-zinc-800 border-zinc-600"
            />
            <label htmlFor="allDay" className="text-sm text-gray-300">
              All day
            </label>
          </div>

          {/* Date/Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Start</label>
              <input
                type={allDay ? 'date' : 'datetime-local'}
                value={allDay ? start.split('T')[0] : start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">End</label>
              <input
                type={allDay ? 'date' : 'datetime-local'}
                value={allDay ? end.split('T')[0] : end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Add location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          {/* Notes */}
          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-gray-400 flex-shrink-0 mt-2" />
            <textarea
              placeholder="Add description"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
            />
          </div>

          {/* Recurrence */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Repeat className="h-4 w-4 text-[#D4AF37]" />
              <label className="text-sm text-gray-300 font-medium">Repeat</label>
            </div>
            <select 
              value={recur} 
              onChange={(e) => setRecur(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="none">Does not repeat</option>
              <option value="custom">Custom…</option>
            </select>
            
            {recur === 'custom' && (
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Every</span>
                  <input 
                    type="number" 
                    min={1} 
                    value={interval} 
                    onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                    className="w-16 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white text-center focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                  <select 
                    value={freq} 
                    onChange={(e) => setFreq(e.target.value as 'DAILY' | 'WEEKLY' | 'MONTHLY')}
                    className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="DAILY">day(s)</option>
                    <option value="WEEKLY">week(s)</option>
                    <option value="MONTHLY">month(s)</option>
                  </select>
                </div>
                
                {freq === 'WEEKLY' && (
                  <div className="flex gap-2 flex-wrap">
                    {weekLabels.map((label, i) => (
                      <button 
                        key={label} 
                        type="button" 
                        onClick={() => toggleWeekday(weekCodes[i])}
                        className={`px-3 py-1 rounded-lg border text-xs font-medium transition-colors ${
                          byWeekday.includes(weekCodes[i]) 
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' 
                            : 'border-zinc-600 text-gray-400 hover:border-zinc-500'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* End options */}
                <div className="space-y-3">
                  <div className="text-xs text-gray-400">Ends</div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input 
                        type="radio" 
                        name="endMode" 
                        checked={endMode === 'never'} 
                        onChange={() => setEndMode('never')} 
                        className="text-[#D4AF37] focus:ring-[#D4AF37]" 
                      />
                      <span className="text-gray-300">Never</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input 
                        type="radio" 
                        name="endMode" 
                        checked={endMode === 'count'} 
                        onChange={() => setEndMode('count')} 
                        className="text-[#D4AF37] focus:ring-[#D4AF37]" 
                      />
                      <span className="text-gray-300">After</span>
                      <input 
                        type="number" 
                        min={1} 
                        value={count} 
                        onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                        className="w-16 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white text-center focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        disabled={endMode !== 'count'}
                      />
                      <span className="text-gray-300">occurrences</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input 
                        type="radio" 
                        name="endMode" 
                        checked={endMode === 'until'} 
                        onChange={() => setEndMode('until')} 
                        className="text-[#D4AF37] focus:ring-[#D4AF37]" 
                      />
                      <span className="text-gray-300">On date</span>
                      <input 
                        type="date" 
                        value={until.split('T')[0]} 
                        onChange={(e) => setUntil(e.target.value + 'T23:59')}
                        className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        disabled={endMode !== 'until'}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Color</label>
            <div className="flex gap-2">
              {eventColors.map(colorOption => (
                <button
                  key={colorOption}
                  onClick={() => setColor(colorOption)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    color === colorOption ? 'border-white' : 'border-zinc-600'
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          {mode === 'edit' ? (
            <Button
              onClick={handleDelete}
              variant="outline"
              size="sm"
              className="text-red-400 border-red-400/30 hover:bg-red-400/10"
            >
              Delete
            </Button>
          ) : (
            <div />
          )}
          
          <div className="flex gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="border-zinc-600 text-gray-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
              disabled={!title.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}