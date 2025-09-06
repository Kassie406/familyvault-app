import { RRule, RRuleSet, rrulestr } from "rrule";

export interface RecurrenceRule {
  freq: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  interval?: number;
  count?: number;
  until?: Date;
  byweekday?: number[];
  bymonth?: number[];
  bymonthday?: number[];
  byhour?: number[];
  byminute?: number[];
  wkst?: number;
  exceptions?: Date[]; // Dates to exclude
  additions?: Date[]; // Extra dates to include
}

export interface CalendarEvent {
  id: string;
  title: string;
  startAt: Date;
  endAt: Date;
  allDay: boolean;
  recurrence?: RecurrenceRule;
  timezone: string;
}

export interface ExpandedEvent extends CalendarEvent {
  originalEventId: string;
  isRecurring: boolean;
  occurrenceId: string; // For tracking specific instances
}

/**
 * Expands recurring events within a date range
 */
export function expandRecurringEvents(
  events: CalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date
): ExpandedEvent[] {
  const expandedEvents: ExpandedEvent[] = [];

  for (const event of events) {
    if (!event.recurrence) {
      // Non-recurring event - include if it intersects with range
      if (eventIntersectsRange(event, rangeStart, rangeEnd)) {
        expandedEvents.push({
          ...event,
          originalEventId: event.id,
          isRecurring: false,
          occurrenceId: event.id
        });
      }
    } else {
      // Recurring event - expand occurrences
      const occurrences = expandRecurrence(event, rangeStart, rangeEnd);
      expandedEvents.push(...occurrences);
    }
  }

  return expandedEvents.sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
}

/**
 * Expands a single recurring event within a date range
 */
function expandRecurrence(
  event: CalendarEvent,
  rangeStart: Date,
  rangeEnd: Date
): ExpandedEvent[] {
  if (!event.recurrence) return [];

  try {
    const rule = createRRule(event.recurrence, event.startAt);
    const occurrences = rule.between(rangeStart, rangeEnd, true);
    
    const eventDuration = event.endAt.getTime() - event.startAt.getTime();
    const expandedEvents: ExpandedEvent[] = [];

    for (const occurrence of occurrences) {
      // Skip if this occurrence is in the exceptions list
      if (event.recurrence.exceptions?.some(exc => 
        exc.getTime() === occurrence.getTime()
      )) {
        continue;
      }

      const endAt = new Date(occurrence.getTime() + eventDuration);
      
      expandedEvents.push({
        ...event,
        id: `${event.id}_${occurrence.getTime()}`, // Unique ID for this occurrence
        startAt: occurrence,
        endAt: endAt,
        originalEventId: event.id,
        isRecurring: true,
        occurrenceId: occurrence.toISOString(),
        recurrence: undefined // Remove recurrence from individual occurrences
      });
    }

    // Add any additional dates specified in the recurrence rule
    if (event.recurrence.additions) {
      for (const addition of event.recurrence.additions) {
        if (addition >= rangeStart && addition <= rangeEnd) {
          const endAt = new Date(addition.getTime() + eventDuration);
          
          expandedEvents.push({
            ...event,
            id: `${event.id}_${addition.getTime()}`,
            startAt: addition,
            endAt: endAt,
            originalEventId: event.id,
            isRecurring: true,
            occurrenceId: addition.toISOString(),
            recurrence: undefined
          });
        }
      }
    }

    return expandedEvents;
  } catch (error) {
    console.error("Error expanding recurrence for event", event.id, error);
    // Return the original event if recurrence expansion fails
    return [{
      ...event,
      originalEventId: event.id,
      isRecurring: false,
      occurrenceId: event.id,
      recurrence: undefined
    }];
  }
}

/**
 * Creates an RRule object from our recurrence configuration
 */
function createRRule(recurrence: RecurrenceRule, dtstart: Date): RRule {
  const options: any = {
    dtstart: dtstart,
    freq: RRule[recurrence.freq as keyof typeof RRule],
  };

  if (recurrence.interval) options.interval = recurrence.interval;
  if (recurrence.count) options.count = recurrence.count;
  if (recurrence.until) options.until = recurrence.until;
  if (recurrence.byweekday) options.byweekday = recurrence.byweekday;
  if (recurrence.bymonth) options.bymonth = recurrence.bymonth;
  if (recurrence.bymonthday) options.bymonthday = recurrence.bymonthday;
  if (recurrence.byhour) options.byhour = recurrence.byhour;
  if (recurrence.byminute) options.byminute = recurrence.byminute;
  if (recurrence.wkst !== undefined) options.wkst = recurrence.wkst;

  return new RRule(options);
}

/**
 * Checks if an event intersects with a date range
 */
function eventIntersectsRange(
  event: CalendarEvent,
  rangeStart: Date,
  rangeEnd: Date
): boolean {
  return event.endAt >= rangeStart && event.startAt <= rangeEnd;
}

/**
 * Generates a human-readable description of a recurrence rule
 */
export function describeRecurrence(recurrence: RecurrenceRule): string {
  try {
    const rule = createRRule(recurrence, new Date());
    return rule.toText();
  } catch (error) {
    console.error("Error describing recurrence:", error);
    return "Custom recurrence rule";
  }
}

/**
 * Parses an RRULE string into our RecurrenceRule format
 */
export function parseRRuleString(rruleString: string): RecurrenceRule | null {
  try {
    const rule = rrulestr(rruleString);
    const options = rule.options;
    
    const freqMap: { [key: number]: RecurrenceRule["freq"] } = {
      [RRule.DAILY]: "DAILY",
      [RRule.WEEKLY]: "WEEKLY", 
      [RRule.MONTHLY]: "MONTHLY",
      [RRule.YEARLY]: "YEARLY"
    };

    return {
      freq: freqMap[options.freq] || "DAILY",
      interval: options.interval || 1,
      count: options.count || undefined,
      until: options.until || undefined,
      byweekday: options.byweekday || undefined,
      bymonth: options.bymonth || undefined,
      bymonthday: options.bymonthday || undefined,
      byhour: options.byhour || undefined,
      byminute: options.byminute || undefined,
      wkst: options.wkst || undefined
    };
  } catch (error) {
    console.error("Error parsing RRULE string:", error);
    return null;
  }
}

/**
 * Converts our RecurrenceRule format to an RRULE string
 */
export function toRRuleString(recurrence: RecurrenceRule, dtstart: Date): string {
  try {
    const rule = createRRule(recurrence, dtstart);
    return rule.toString();
  } catch (error) {
    console.error("Error creating RRULE string:", error);
    return "";
  }
}