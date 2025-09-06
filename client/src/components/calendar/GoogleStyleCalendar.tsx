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
  Repeat,
  ChevronDown,
  CheckSquare,
  Flag,
  Users,
  Bell
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

interface Task {
  id: string;
  title: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
  description?: string;
  color?: string;
  calendar?: string;
}

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  attendees?: string[];
  appointmentType: 'medical' | 'business' | 'personal' | 'consultation' | 'meeting';
  notes?: string;
  reminderMinutes?: number;
  color?: string;
  calendar?: string;
}

type ViewType = 'month' | 'week' | 'day';

interface CalendarState {
  view: ViewType;
  currentDate: Date;
  events: CalendarEvent[];
  tasks: Task[];
  appointments: Appointment[];
  selectedEvent: CalendarEvent | null;
  selectedTask: Task | null;
  selectedAppointment: Appointment | null;
  isEventModalOpen: boolean;
  isTaskModalOpen: boolean;
  isAppointmentModalOpen: boolean;
  eventModalMode: 'create' | 'edit';
  taskModalMode: 'create' | 'edit';
  appointmentModalMode: 'create' | 'edit';
  newEventDate: Date | null;
  newTaskDate: Date | null;
  newAppointmentDate: Date | null;
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
function RightShortcuts({ onCreate, onAddHolidays, className }: { 
  onCreate: () => void; 
  onAddHolidays: () => void;
  className?: string;
}) {
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
            onClick={onAddHolidays}
            variant="outline"
            className="w-full justify-start border-zinc-700 text-gray-300 hover:bg-zinc-800"
            size="sm"
          >
            <CalIcon className="h-4 w-4 mr-2" />
            Add US Holidays (5 yrs)
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

// ---- Holiday helpers ----
const nthWeekdayOfMonth = (year: number, monthIndex: number, weekday: number, n: number) => {
  // monthIndex: 0-11, weekday: 0=Sun..6=Sat, n: 1..4 (or -1 for last)
  const first = new Date(year, monthIndex, 1);
  const firstWeekday = first.getDay();
  let day = 1 + ((7 + weekday - firstWeekday) % 7); // first target weekday in month

  if (n > 0) {
    day += (n - 1) * 7;
  } else if (n === -1) {
    // last weekday of month
    const last = new Date(year, monthIndex + 1, 0); // last day of month
    const lastWeekday = last.getDay();
    day = last.getDate() - ((7 + lastWeekday - weekday) % 7);
  }
  return new Date(year, monthIndex, day);
};

const observedDate = (d: Date) => {
  // If holiday falls on Sat -> observed Friday; if Sun -> observed Monday
  const wd = d.getDay();
  if (wd === 6) return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
  if (wd === 0) return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  return d;
};

const makeAllDay = (d: Date) => ({
  start: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0),
  end:   new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59),
});

function genUSHolidaysForYear(year: number): CalendarEvent[] {
  // Federal holidays (official)
  const list: { title: string; date: Date }[] = [];

  // Fixed-date (observed): New Year's Day, Juneteenth, Independence Day, Veterans Day, Christmas
  list.push({ title: "New Year's Day",      date: observedDate(new Date(year, 0, 1))  });
  list.push({ title: "Juneteenth National Independence Day", date: observedDate(new Date(year, 5, 19)) });
  list.push({ title: "Independence Day",    date: observedDate(new Date(year, 6, 4))  });
  list.push({ title: "Veterans Day",        date: observedDate(new Date(year, 10, 11)) });
  list.push({ title: "Christmas Day",       date: observedDate(new Date(year, 11, 25)) });

  // Floating (weekday rules)
  list.push({ title: "Birthday of Martin Luther King, Jr.", date: nthWeekdayOfMonth(year, 0, 1, 3) }); // Jan, Mon(1), 3rd
  list.push({ title: "Washington's Birthday",               date: nthWeekdayOfMonth(year, 1, 1, 3) }); // Feb, Mon, 3rd
  list.push({ title: "Memorial Day",                        date: nthWeekdayOfMonth(year, 4, 1, -1) }); // May, Mon, last
  list.push({ title: "Labor Day",                           date: nthWeekdayOfMonth(year, 8, 1, 1)  }); // Sep, Mon, 1st
  list.push({ title: "Columbus Day",                        date: nthWeekdayOfMonth(year, 9, 1, 2)  }); // Oct, Mon, 2nd
  list.push({ title: "Thanksgiving Day",                    date: nthWeekdayOfMonth(year, 10, 4, 4) }); // Nov, Thu(4), 4th

  // Convert to your event objects
  return list.map(({ title, date }, index) => {
    const { start, end } = makeAllDay(date);
    return {
      id: `holiday-${year}-${index}`,
      title,
      start,
      end,
      allDay: true,
      color: "#10B981", // green
      calendar: "Holidays in United States"
    };
  });
}

/** Generate and return holidays for a range of years */
function genUSHolidays(yearStart = new Date().getFullYear(), years = 5): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  for (let y = yearStart; y < yearStart + years; y++) {
    events.push(...genUSHolidaysForYear(y));
  }
  return events;
}

const startOfDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
    tasks: [
      {
        id: 'task-1',
        title: 'Plan weekend trip',
        dueDate: new Date(2025, 1, 5),
        priority: 'high',
        completed: false,
        description: 'Research destinations and book accommodation',
        color: '#D4AF37',
        calendar: 'Personal Tasks'
      },
      {
        id: 'task-2', 
        title: 'Buy groceries',
        dueDate: new Date(2025, 0, 31),
        priority: 'medium',
        completed: false,
        description: 'Milk, bread, eggs, vegetables',
        color: '#3B82F6',
        calendar: 'Personal Tasks'
      }
    ],
    appointments: [
      {
        id: 'appt-1',
        title: 'Doctor Appointment',
        start: new Date(2025, 1, 3, 10, 0),
        end: new Date(2025, 1, 3, 11, 0),
        location: 'Medical Center',
        attendees: ['Dr. Smith'],
        appointmentType: 'medical',
        notes: 'Annual checkup',
        reminderMinutes: 30,
        color: '#EF4444',
        calendar: 'Medical Appointments'
      },
      {
        id: 'appt-2',
        title: 'Client Meeting',
        start: new Date(2025, 1, 4, 14, 0),
        end: new Date(2025, 1, 4, 15, 30),
        location: 'Office Conference Room',
        attendees: ['John Doe', 'Jane Smith'],
        appointmentType: 'business',
        notes: 'Project discussion and planning',
        reminderMinutes: 15,
        color: '#3B82F6',
        calendar: 'Business Appointments'
      }
    ],
    selectedEvent: null,
    selectedTask: null,
    selectedAppointment: null,
    isEventModalOpen: false,
    isTaskModalOpen: false,
    isAppointmentModalOpen: false,
    eventModalMode: 'create',
    taskModalMode: 'create',
    appointmentModalMode: 'create',
    newEventDate: null,
    newTaskDate: null,
    newAppointmentDate: null,
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

  // Collapsed state for calendar sections
  const [myCalendarsCollapsed, setMyCalendarsCollapsed] = useState(false);
  const [otherCalendarsCollapsed, setOtherCalendarsCollapsed] = useState(false);

  // Dropdown state for Create button
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (createDropdownOpen && !target.closest('.create-dropdown')) {
        setCreateDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [createDropdownOpen]);

  // Add US Holidays function
  const addUSHolidays = (startYear = new Date().getFullYear(), years = 5) => {
    const holidays = genUSHolidays(startYear, years);
    setState(prev => {
      // avoid duplicates by (title + start date) key
      const seen = new Set(prev.events.map(e => `${e.title}|${startOfDay(e.start).toDateString()}`));
      const fresh = holidays.filter(e => !seen.has(`${e.title}|${startOfDay(e.start).toDateString()}`));
      return {
        ...prev,
        events: [...prev.events, ...fresh]
      };
    });
  };

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
    setCreateDropdownOpen(false); // Close dropdown when opening modal
  };

  const handleCreateOptionClick = (type: 'event' | 'task' | 'appointment') => {
    if (type === 'task') {
      openTaskModal('create', undefined, state.currentDate);
    } else if (type === 'appointment') {
      openAppointmentModal('create', undefined, state.currentDate);
    } else {
      // For events, open the event modal
      openEventModal('create', undefined, state.currentDate);
    }
  };

  // Task functions
  const openTaskModal = (mode: 'create' | 'edit', task?: Task, date?: Date) => {
    setState(prev => ({
      ...prev,
      isTaskModalOpen: true,
      taskModalMode: mode,
      selectedTask: task || null,
      newTaskDate: date || null
    }));
    setCreateDropdownOpen(false); // Close dropdown when opening modal
  };

  const closeTaskModal = () => {
    setState(prev => ({
      ...prev,
      isTaskModalOpen: false,
      selectedTask: null,
      newTaskDate: null
    }));
  };

  const createTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString()
    };
    
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
  };

  const updateTask = (id: string, taskData: Omit<Task, 'id'>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === id ? { ...taskData, id } : task
      )
    }));
  };

  const deleteTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id)
    }));
  };

  // Appointment functions
  const openAppointmentModal = (mode: 'create' | 'edit', appointment?: Appointment, date?: Date) => {
    setState(prev => ({
      ...prev,
      isAppointmentModalOpen: true,
      appointmentModalMode: mode,
      selectedAppointment: appointment || null,
      newAppointmentDate: date || null
    }));
    setCreateDropdownOpen(false); // Close dropdown when opening modal
  };

  const closeAppointmentModal = () => {
    setState(prev => ({
      ...prev,
      isAppointmentModalOpen: false,
      selectedAppointment: null,
      newAppointmentDate: null
    }));
  };

  const createAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString()
    };
    
    setState(prev => ({
      ...prev,
      appointments: [...prev.appointments, newAppointment]
    }));
  };

  const updateAppointment = (id: string, appointmentData: Omit<Appointment, 'id'>) => {
    setState(prev => ({
      ...prev,
      appointments: prev.appointments.map(appointment => 
        appointment.id === id ? { ...appointmentData, id } : appointment
      )
    }));
  };

  const deleteAppointment = (id: string) => {
    setState(prev => ({
      ...prev,
      appointments: prev.appointments.filter(appointment => appointment.id !== id)
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
    <div className="h-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex">
      {/* Left Sidebar */}
      {state.sidebarOpen && (
        <div className="w-64 bg-zinc-900 border-r border-zinc-800 p-4 flex-shrink-0">
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">My calendars</h3>
            <button
              onClick={() => setMyCalendarsCollapsed(!myCalendarsCollapsed)}
              className="p-1 hover:bg-zinc-800 rounded transition-colors"
            >
              <ChevronDown 
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  myCalendarsCollapsed ? '-rotate-90' : ''
                }`} 
              />
            </button>
          </div>
          {!myCalendarsCollapsed && (
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
          )}
        </div>

        {/* Other Calendars */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Other calendars</h3>
            <button
              onClick={() => setOtherCalendarsCollapsed(!otherCalendarsCollapsed)}
              className="p-1 hover:bg-zinc-800 rounded transition-colors"
            >
              <ChevronDown 
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  otherCalendarsCollapsed ? '-rotate-90' : ''
                }`} 
              />
            </button>
          </div>
          {!otherCalendarsCollapsed && (
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
          )}
        </div>
        </div>
      )}

      {/* Main Calendar */}
      <div className="flex-1 flex flex-col">
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

              {/* Create Dropdown */}
              <div className="relative create-dropdown">
                <Button
                  onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
                  className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                  <ChevronDown className="h-3 w-3 ml-2" />
                </Button>
                
                {createDropdownOpen && (
                  <div className="absolute top-full mt-1 right-0 z-50 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg min-w-[140px]">
                    <div className="py-1">
                      <button
                        onClick={() => handleCreateOptionClick('event')}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                      >
                        Event
                      </button>
                      <button
                        onClick={() => handleCreateOptionClick('task')}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                      >
                        Task
                      </button>
                      <button
                        onClick={() => handleCreateOptionClick('appointment')}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                      >
                        Appointment Schedule
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="flex-1 overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
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

      {/* Right Shortcuts Panel */}
      <RightShortcuts 
        onCreate={() => openEventModal('create', undefined, state.currentDate)} 
        onAddHolidays={() => addUSHolidays()}
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

      {/* Task Modal */}
      {state.isTaskModalOpen && (
        <TaskModal
          mode={state.taskModalMode}
          task={state.selectedTask}
          defaultDate={state.newTaskDate}
          onClose={closeTaskModal}
          onCreate={createTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      )}

      {/* Appointment Modal */}
      {state.isAppointmentModalOpen && (
        <AppointmentModal
          mode={state.appointmentModalMode}
          appointment={state.selectedAppointment}
          defaultDate={state.newAppointmentDate}
          onClose={closeAppointmentModal}
          onCreate={createAppointment}
          onUpdate={updateAppointment}
          onDelete={deleteAppointment}
        />
      )}
    </div>
  );
}

// Task Modal Component
function TaskModal({
  mode,
  task,
  defaultDate,
  onClose,
  onCreate,
  onUpdate,
  onDelete
}: {
  mode: 'create' | 'edit';
  task?: Task | null;
  defaultDate?: Date | null;
  onClose: () => void;
  onCreate: (taskData: Omit<Task, 'id'>) => void;
  onUpdate: (id: string, taskData: Omit<Task, 'id'>) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState(task?.title || '');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? toLocalISOString(task.dueDate).split('T')[0] : 
    defaultDate ? toLocalISOString(defaultDate).split('T')[0] : 
    toLocalISOString(new Date()).split('T')[0]
  );
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>(task?.priority || 'medium');
  const [completed, setCompleted] = useState(task?.completed || false);
  const [description, setDescription] = useState(task?.description || '');
  const [color, setColor] = useState(task?.color || eventColors[0]);
  
  const priorityOptions = [
    { value: 'low', label: 'Low', color: '#10B981' },
    { value: 'medium', label: 'Medium', color: '#3B82F6' },
    { value: 'high', label: 'High', color: '#F59E0B' },
    { value: 'urgent', label: 'Urgent', color: '#EF4444' }
  ] as const;

  const handleSave = () => {
    if (!title.trim()) return;
    
    const taskData = {
      title: title.trim(),
      dueDate: dueDate ? new Date(dueDate + 'T23:59:59') : undefined,
      priority,
      completed,
      description: description.trim(),
      color,
      calendar: mode === 'create' ? 'Personal Tasks' : task?.calendar || 'Personal Tasks'
    };

    if (mode === 'create') {
      onCreate(taskData);
    } else if (task) {
      onUpdate(task.id, taskData);
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (task) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-[#D4AF37]" />
            <h2 className="text-lg font-semibold text-white">
              {mode === 'create' ? 'New Task' : 'Edit Task'}
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
              placeholder="Add task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              autoFocus
            />
          </div>

          {/* Completed Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37] bg-zinc-800 border-zinc-600"
            />
            <label htmlFor="completed" className="text-sm text-gray-300">
              Mark as completed
            </label>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          {/* Priority */}
          <div className="flex items-center gap-3">
            <Flag className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">Priority</label>
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value as typeof priority)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-gray-400 flex-shrink-0 mt-2" />
            <textarea
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
            />
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

// Appointment Modal Component
function AppointmentModal({
  mode,
  appointment,
  defaultDate,
  onClose,
  onCreate,
  onUpdate,
  onDelete
}: {
  mode: 'create' | 'edit';
  appointment?: Appointment | null;
  defaultDate?: Date | null;
  onClose: () => void;
  onCreate: (appointmentData: Omit<Appointment, 'id'>) => void;
  onUpdate: (id: string, appointmentData: Omit<Appointment, 'id'>) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState(appointment?.title || '');
  const [start, setStart] = useState(
    appointment?.start ? toLocalISOString(appointment.start) : 
    defaultDate ? toLocalISOString(defaultDate) : 
    toLocalISOString(new Date())
  );
  const [end, setEnd] = useState(
    appointment?.end ? toLocalISOString(appointment.end) : 
    defaultDate ? (() => {
      const endDate = new Date(defaultDate);
      endDate.setHours(endDate.getHours() + 1);
      return toLocalISOString(endDate);
    })() : 
    (() => {
      const endDate = new Date();
      endDate.setHours(endDate.getHours() + 1);
      return toLocalISOString(endDate);
    })()
  );
  const [location, setLocation] = useState(appointment?.location || '');
  const [attendees, setAttendees] = useState(appointment?.attendees?.join(', ') || '');
  const [appointmentType, setAppointmentType] = useState<'medical' | 'business' | 'personal' | 'consultation' | 'meeting'>(
    appointment?.appointmentType || 'personal'
  );
  const [notes, setNotes] = useState(appointment?.notes || '');
  const [reminderMinutes, setReminderMinutes] = useState(appointment?.reminderMinutes || 15);
  const [color, setColor] = useState(appointment?.color || eventColors[0]);
  
  const appointmentTypeOptions = [
    { value: 'medical', label: 'Medical', color: '#EF4444' },
    { value: 'business', label: 'Business', color: '#3B82F6' },
    { value: 'personal', label: 'Personal', color: '#10B981' },
    { value: 'consultation', label: 'Consultation', color: '#F59E0B' },
    { value: 'meeting', label: 'Meeting', color: '#8B5CF6' }
  ] as const;

  const reminderOptions = [
    { value: 5, label: '5 minutes before' },
    { value: 15, label: '15 minutes before' },
    { value: 30, label: '30 minutes before' },
    { value: 60, label: '1 hour before' },
    { value: 1440, label: '1 day before' }
  ];

  const handleSave = () => {
    if (!title.trim()) return;
    
    const appointmentData = {
      title: title.trim(),
      start: new Date(start),
      end: new Date(end),
      location: location.trim(),
      attendees: attendees.trim() ? attendees.split(',').map(a => a.trim()) : [],
      appointmentType,
      notes: notes.trim(),
      reminderMinutes,
      color,
      calendar: mode === 'create' ? `${appointmentType.charAt(0).toUpperCase() + appointmentType.slice(1)} Appointments` : appointment?.calendar || 'Personal Appointments'
    };

    if (mode === 'create') {
      onCreate(appointmentData);
    } else if (appointment) {
      onUpdate(appointment.id, appointmentData);
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (appointment) {
      onDelete(appointment.id);
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
              {mode === 'create' ? 'New Appointment' : 'Edit Appointment'}
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
              placeholder="Add appointment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              autoFocus
            />
          </div>

          {/* Date/Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Start</label>
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">End</label>
              <input
                type="datetime-local"
                value={end}
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

          {/* Attendees */}
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Add attendees (comma separated)"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          {/* Appointment Type */}
          <div className="flex items-center gap-3">
            <Flag className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">Type</label>
              <select 
                value={appointmentType} 
                onChange={(e) => setAppointmentType(e.target.value as typeof appointmentType)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                {appointmentTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reminder */}
          <div className="flex items-center gap-3">
            <Bell className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">Reminder</label>
              <select 
                value={reminderMinutes} 
                onChange={(e) => setReminderMinutes(parseInt(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                {reminderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-gray-400 flex-shrink-0 mt-2" />
            <textarea
              placeholder="Add notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
            />
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
  // Reorder hours to start with 1 AM (like in reference image)
  const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0];
  
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
      <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 180px)', minHeight: '700px' }}>
        <div className="grid grid-cols-8" style={{ height: `${24 * 90 + 60}px` }}>
          {/* Time labels */}
          <div className="border-r border-zinc-800 bg-zinc-900">
            {/* GMT indicator */}
            <div className="h-10 border-b border-zinc-800 p-2 text-xs text-gray-500 flex items-center">
              GMT+01
            </div>
            {hours.map(hour => (
              <div key={hour} className="h-16 border-b border-zinc-800 p-2 text-xs text-gray-500 flex items-start pt-2">
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
                  className="h-16 border-b border-zinc-800 hover:bg-zinc-800/30 cursor-pointer flex-shrink-0"
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