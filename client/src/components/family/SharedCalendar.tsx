import React, { useState, useEffect } from "react";
import { Calendar, Clock, Plus, MapPin, Users, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  eventType: "birthday" | "reminder" | "urgent" | "general";
  color: string;
  isAllDay: boolean;
}

export function SharedCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week">("month");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [focusedDayIndex, setFocusedDayIndex] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create stable month/year values
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Fetch calendar events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['/api/calendar/events', currentYear, currentMonth],
    queryFn: async () => {
      const startOfMonth = new Date(currentYear, currentMonth, 1);
      const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
      
      const response = await fetch(`/api/calendar/events?from=${startOfMonth.toISOString()}&to=${endOfMonth.toISOString()}`);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      return data.events || [];
    },
  });

  // Add event mutation
  const addEventMutation = useMutation({
    mutationFn: async (eventData: Partial<CalendarEvent>) => {
      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to create event');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Event Added",
        description: "Calendar event has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/events'] });
      setShowAddDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    },
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    eventType: "general" as const,
    isAllDay: false,
  });

  const resetForm = () => {
    setEventForm({
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      location: "",
      eventType: "general",
      isAllDay: false,
    });
  };

  const handleAddEvent = () => {
    if (!eventForm.title || !eventForm.startDate) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and start date.",
        variant: "destructive",
      });
      return;
    }

    const startDateTime = eventForm.isAllDay 
      ? new Date(eventForm.startDate)
      : new Date(`${eventForm.startDate}T${eventForm.startTime || '09:00'}`);
    
    const endDateTime = eventForm.endDate
      ? eventForm.isAllDay 
        ? new Date(eventForm.endDate)
        : new Date(`${eventForm.endDate}T${eventForm.endTime || '10:00'}`)
      : null;

    const eventTypeColors = {
      birthday: "#E91E63",
      reminder: "#FFC107",
      urgent: "#F44336",
      general: "#D4AF37"
    };

    addEventMutation.mutate({
      title: eventForm.title,
      description: eventForm.description || undefined,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime?.toISOString(),
      location: eventForm.location || undefined,
      eventType: eventForm.eventType,
      color: eventTypeColors[eventForm.eventType],
      isAllDay: eventForm.isAllDay,
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event: CalendarEvent) => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const cols = 7;
    const totalDays = 42;
    
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setFocusedDayIndex(prev => Math.min(prev + 1, totalDays - 1));
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setFocusedDayIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedDayIndex(prev => Math.min(prev + cols, totalDays - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedDayIndex(prev => Math.max(prev - cols, 0));
        break;
    }
  };

  const renderCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return (
      <div 
        role="grid" 
        aria-label="Calendar month view"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="grid grid-cols-7 gap-1 outline-none"
      >
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-zinc-400">
            {day}
          </div>
        ))}
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === month;
          const isToday = date.toDateString() === new Date().toDateString();
          const isFocused = index === focusedDayIndex;
          const dayEvents = getEventsForDate(date);
          
          return (
            <div
              key={index}
              role="gridcell"
              tabIndex={isFocused ? 0 : -1}
              onFocus={() => setFocusedDayIndex(index)}
              className={`min-h-[80px] p-1 border border-zinc-800/50 rounded-lg transition-colors ${
                isCurrentMonth 
                  ? 'bg-zinc-900/40 hover:bg-zinc-800/60' 
                  : 'bg-zinc-950/20 text-zinc-600'
              } ${isToday ? 'ring-2 ring-[#D4AF37]/50' : ''} ${
                isFocused ? 'ring-2 ring-blue-400/50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className={`text-sm ${isToday ? 'font-bold text-[#D4AF37]' : isCurrentMonth ? 'text-white' : 'text-zinc-600'}`}>
                  {date.getDate()}
                </div>
                {/* Multi-event dots (up to 3) */}
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5">
                    {dayEvents.slice(0, 3).map((event: CalendarEvent, dotIndex: number) => (
                      <div
                        key={`${event.id}-dot`}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: event.color }}
                        title={event.title}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event: CalendarEvent) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded truncate"
                    style={{ backgroundColor: `${event.color}20`, color: event.color, borderLeft: `2px solid ${event.color}` }}
                    title={`${event.title}${event.location ? ` - ${event.location}` : ''}`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-zinc-500 px-1">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-[#2A2A33] bg-gradient-to-br from-[#161616] to-[#0F0F0F] shadow-lg hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300 hover:border-[#D4AF37]/30 min-h-[600px]">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center relative">
            <Calendar className="w-6 h-6 mr-3 text-[#D4AF37]" />
            <span className="border-b-2 border-[#D4AF37]/30 pb-1">Shared Calendar</span>
          </h3>
          
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex bg-zinc-800/50 rounded-lg p-1">
              <button
                onClick={() => setView("month")}
                className={`px-3 py-1 text-sm rounded ${
                  view === "month" 
                    ? "bg-[#D4AF37] text-black font-medium" 
                    : "text-zinc-400 hover:text-white"
                }`}
                data-testid="view-month"
              >
                Month
              </button>
              <button
                onClick={() => setView("week")}
                className={`px-3 py-1 text-sm rounded ${
                  view === "week" 
                    ? "bg-[#D4AF37] text-black font-medium" 
                    : "text-zinc-400 hover:text-white"
                }`}
                data-testid="view-week"
              >
                Week
              </button>
            </div>

            {/* Add Event Button */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-medium"
                  data-testid="button-add-event"
                  onClick={() => {
                    resetForm();
                    setShowAddDialog(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
                <DialogHeader>
                  <DialogTitle className="text-[#D4AF37]">Add New Event</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={eventForm.title}
                      onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-zinc-800 border-zinc-600"
                      data-testid="input-event-title"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-zinc-800 border-zinc-600"
                      data-testid="input-event-description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={eventForm.startDate}
                        onChange={(e) => setEventForm(prev => ({ ...prev, startDate: e.target.value }))}
                        className="bg-zinc-800 border-zinc-600"
                        data-testid="input-event-start-date"
                      />
                    </div>
                    <div>
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={eventForm.startTime}
                        onChange={(e) => setEventForm(prev => ({ ...prev, startTime: e.target.value }))}
                        className="bg-zinc-800 border-zinc-600"
                        disabled={eventForm.isAllDay}
                        data-testid="input-event-start-time"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Event Type</Label>
                    <Select value={eventForm.eventType} onValueChange={(value: any) => setEventForm(prev => ({ ...prev, eventType: value }))}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-600" data-testid="select-event-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-600">
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Location</Label>
                    <Input
                      value={eventForm.location}
                      onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-zinc-800 border-zinc-600"
                      data-testid="input-event-location"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allDay"
                      checked={eventForm.isAllDay}
                      onChange={(e) => setEventForm(prev => ({ ...prev, isAllDay: e.target.checked }))}
                      className="rounded"
                      data-testid="checkbox-all-day"
                    />
                    <Label htmlFor="allDay">All Day Event</Label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleAddEvent} 
                      disabled={addEventMutation.isPending}
                      className="bg-[#D4AF37] hover:bg-[#B8941F] text-black"
                      data-testid="button-save-event"
                    >
                      {addEventMutation.isPending ? "Saving..." : "Save Event"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddDialog(false)}
                      className="border-zinc-600 text-white hover:bg-zinc-800"
                      data-testid="button-cancel-event"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800/50 transition-colors"
            data-testid="button-prev-month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h4 className="text-lg font-semibold text-white">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h4>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800/50 transition-colors"
            data-testid="button-next-month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px] text-zinc-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
          </div>
        ) : (
          <div className="min-h-[400px]">
            {view === "month" && renderCalendarGrid()}
            {view === "week" && (
              <div className="text-center text-zinc-400 py-20">
                Week view coming soon
              </div>
            )}
          </div>
        )}

        {/* Upcoming Events (next 3) */}
        {events.length > 0 && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <h5 className="text-sm font-medium text-white/80 mb-3">Upcoming</h5>
            <ul className="space-y-1">
              {events
                .filter((event: CalendarEvent) => new Date(event.startDate) >= new Date())
                .sort((a: CalendarEvent, b: CalendarEvent) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                .slice(0, 3)
                .map((event: CalendarEvent) => (
                  <li key={event.id} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#c5a000]" />
                    <span className="opacity-80 text-white/70">
                      {new Date(event.startDate).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="truncate text-white">{event.title}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
