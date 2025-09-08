import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Calendar,
  Clock,
  Plus,
  AlertTriangle,
  Eye,
  EyeOff,
  MapPin,
  Users,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoupleEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  type: 'date' | 'open_block' | 'milestone';
  visibility: 'couple' | 'busy';
  ideaId?: string;
}

interface FamilyEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'family' | 'child_activity' | 'work';
}

interface CoupleCalendarProps {
  className?: string;
}

export function CoupleCalendar({ className }: CoupleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showFamilyEvents, setShowFamilyEvents] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Mock data for demonstration
  const [coupleEvents] = useState<CoupleEvent[]>([
    {
      id: '1',
      title: 'Dinner at Luigi\'s',
      startTime: '2025-01-30T19:30:00',
      endTime: '2025-01-30T21:30:00',
      location: 'Luigi\'s Italian Restaurant',
      type: 'date',
      visibility: 'couple'
    },
    {
      id: '2',
      title: 'Open Date Night',
      startTime: '2025-02-02T19:00:00',
      endTime: '2025-02-02T21:00:00',
      type: 'open_block',
      visibility: 'busy'
    },
    {
      id: '3',
      title: '5th Anniversary',
      startTime: '2025-02-14T18:00:00',
      endTime: '2025-02-14T23:00:00',
      location: 'Mountain Resort',
      type: 'milestone',
      visibility: 'couple'
    }
  ]);

  const [familyEvents] = useState<FamilyEvent[]>([
    {
      id: '1',
      title: 'Soccer Practice',
      startTime: '2025-01-30T18:00:00',
      endTime: '2025-01-30T19:30:00',
      type: 'child_activity'
    },
    {
      id: '2',
      title: 'Parent-Teacher Conference',
      startTime: '2025-02-02T16:00:00',
      endTime: '2025-02-02T17:00:00',
      type: 'family'
    },
    {
      id: '3',
      title: 'Team Meeting',
      startTime: '2025-02-14T20:00:00',
      endTime: '2025-02-14T21:00:00',
      type: 'work'
    }
  ]);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    const coupleEventsForDate = coupleEvents.filter(event => 
      event.startTime.startsWith(dateStr)
    );
    
    const familyEventsForDate = showFamilyEvents ? familyEvents.filter(event => 
      event.startTime.startsWith(dateStr)
    ) : [];

    return { coupleEvents: coupleEventsForDate, familyEvents: familyEventsForDate };
  };

  // Check for conflicts between couple and family events
  const getConflicts = (coupleEvent: CoupleEvent) => {
    const coupleStart = new Date(coupleEvent.startTime);
    const coupleEnd = new Date(coupleEvent.endTime);
    
    return familyEvents.filter(familyEvent => {
      const familyStart = new Date(familyEvent.startTime);
      const familyEnd = new Date(familyEvent.endTime);
      
      // Check if times overlap
      return (coupleStart < familyEnd && coupleEnd > familyStart);
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'date': return 'bg-[#D4AF37] text-black';
      case 'open_block': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'milestone': return 'bg-pink-500/20 text-pink-400 border border-pink-500/30';
      case 'family': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'child_activity': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'work': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'bg-neutral-500/20 text-neutral-400 border border-neutral-500/30';
    }
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">Couple Calendar</h2>
          <div className="flex items-center gap-2">
            <Switch
              checked={showFamilyEvents}
              onCheckedChange={setShowFamilyEvents}
              className="data-[state=checked]:bg-[#D4AF37]"
            />
            <span className="text-sm text-neutral-400">
              {showFamilyEvents ? 'Couple + Family' : 'Couple Only'}
            </span>
          </div>
        </div>
        <Button 
          className="bg-[#D4AF37] hover:bg-[#B8941F] text-black"
          data-testid="button-add-date"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Date
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card className="bg-neutral-800 border-neutral-700 p-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="text-white hover:text-[#D4AF37]"
              >
                ←
              </Button>
              <h3 className="text-lg font-semibold text-white">
                {currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' })}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="text-white hover:text-[#D4AF37]"
              >
                →
              </Button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-neutral-400 p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {generateCalendarDays().map((day, index) => {
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
                const { coupleEvents: dayEvents, familyEvents: dayFamilyEvents } = getEventsForDate(day);
                const hasEvents = dayEvents.length > 0 || dayFamilyEvents.length > 0;

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "aspect-square p-1 text-sm rounded-lg border transition-all relative",
                      isCurrentMonth 
                        ? "text-white border-neutral-600 hover:border-[#D4AF37]/30" 
                        : "text-neutral-600 border-transparent",
                      isSelected && "border-[#D4AF37] bg-[#D4AF37]/10",
                      hasEvents && "bg-neutral-700/50"
                    )}
                    data-testid={`calendar-day-${day.getDate()}`}
                  >
                    <div className="flex flex-col h-full">
                      <span className="text-xs">{day.getDate()}</span>
                      {hasEvents && (
                        <div className="flex-1 flex flex-col gap-0.5 mt-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div key={event.id} className="h-1 bg-[#D4AF37] rounded-full" />
                          ))}
                          {dayFamilyEvents.slice(0, 1).map(event => (
                            <div key={event.id} className="h-1 bg-green-500 rounded-full" />
                          ))}
                          {(dayEvents.length + dayFamilyEvents.length > 3) && (
                            <div className="text-xs text-neutral-500">+{dayEvents.length + dayFamilyEvents.length - 3}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-4">
          {selectedDate ? (
            <>
              <Card className="bg-neutral-800 border-neutral-700 p-4">
                <h4 className="font-semibold text-white mb-3">
                  {formatDate(selectedDate)}
                </h4>
                
                {(() => {
                  const { coupleEvents: dayEvents, familyEvents: dayFamilyEvents } = getEventsForDate(selectedDate);
                  
                  if (dayEvents.length === 0 && dayFamilyEvents.length === 0) {
                    return (
                      <div className="text-center py-4">
                        <Calendar className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
                        <p className="text-neutral-400 text-sm">No events scheduled</p>
                        <Button
                          size="sm"
                          className="mt-3 bg-[#D4AF37] hover:bg-[#B8941F] text-black"
                        >
                          Schedule Date
                        </Button>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {dayEvents.map(event => {
                        const conflicts = getConflicts(event);
                        return (
                          <div key={event.id} className="space-y-2">
                            <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-600">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-white text-sm">{event.title}</h5>
                                <Badge className={getEventTypeColor(event.type)}>
                                  {event.type === 'open_block' ? 'Open' : event.type}
                                </Badge>
                              </div>
                              
                              <div className="space-y-1 text-xs text-neutral-400">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                </div>
                                {event.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {event.location}
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  {event.visibility === 'couple' ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                  {event.visibility === 'couple' ? 'Visible to couple' : 'Shows as busy'}
                                </div>
                              </div>
                            </div>

                            {conflicts.length > 0 && (
                              <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <AlertTriangle className="h-4 w-4 text-red-400" />
                                  <span className="text-sm font-medium text-red-300">
                                    Conflicts ({conflicts.length})
                                  </span>
                                </div>
                                {conflicts.map(conflict => (
                                  <div key={conflict.id} className="text-xs text-red-300 ml-6">
                                    {conflict.title}: {formatTime(conflict.startTime)}-{formatTime(conflict.endTime)}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {dayFamilyEvents.map(event => (
                        <div key={event.id} className="p-3 bg-neutral-900 rounded-lg border border-neutral-600">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-white text-sm">{event.title}</h5>
                            <Badge className={getEventTypeColor(event.type)}>
                              <Users className="h-3 w-3 mr-1" />
                              Family
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-neutral-400">
                            <Clock className="h-3 w-3" />
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </Card>
            </>
          ) : (
            <Card className="bg-neutral-800 border-neutral-700 p-4">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
                <h4 className="font-semibold text-white mb-2">Select a Date</h4>
                <p className="text-neutral-400 text-sm">
                  Click on a calendar date to view and manage your couple events
                </p>
              </div>
            </Card>
          )}

          {/* Privacy Notice */}
          <Card className="bg-neutral-900 border-neutral-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-sm font-medium text-white">Privacy Settings</span>
            </div>
            <div className="text-xs text-neutral-400 space-y-1">
              <p>• <strong>Couple events:</strong> Full details visible to both partners</p>
              <p>• <strong>Busy blocks:</strong> Show as "Busy" to family members</p>
              <p>• Toggle family view to see potential conflicts</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}