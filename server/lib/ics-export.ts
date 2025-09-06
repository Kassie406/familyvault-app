// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createEvents } = require("ics");
import { toRRuleString } from "./recurrence";

// Type definitions for ics library
interface EventAttributes {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  start: [number, number, number, number, number] | [number, number, number];
  end?: [number, number, number, number, number] | [number, number, number];
  created?: [number, number, number, number, number];
  lastModified?: [number, number, number, number, number];
  sequence?: number;
  busyStatus?: string;
  categories?: string[];
  transp?: string;
  recurrenceRule?: string;
}

export interface CalendarEventForExport {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startAt: Date;
  endAt: Date;
  allDay: boolean;
  timezone: string;
  recurrence?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICSExportOptions {
  calendarName?: string;
  timeZone?: string;
  includeRecurrence?: boolean;
}

/**
 * Generates ICS calendar content from events
 */
export function generateICSContent(
  events: CalendarEventForExport[],
  options: ICSExportOptions = {}
): string {
  const {
    calendarName = "FamilyVault Calendar",
    timeZone = "UTC",
    includeRecurrence = true
  } = options;

  try {
    const icsEvents: EventAttributes[] = events.map(event => {
      const icsEvent: EventAttributes = {
        uid: event.id,
        title: event.title,
        description: event.description || "",
        location: event.location || "",
        start: convertDateToICSFormat(event.startAt, timeZone),
        end: convertDateToICSFormat(event.endAt, timeZone),
        created: convertDateToICSFormat(event.createdAt, timeZone),
        lastModified: convertDateToICSFormat(event.updatedAt, timeZone),
        sequence: 0,
        busyStatus: "BUSY",
        categories: ["FamilyVault"],
        transp: "OPAQUE"
      };

      // Handle all-day events
      if (event.allDay) {
        icsEvent.start = convertDateToICSDateFormat(event.startAt);
        icsEvent.end = convertDateToICSDateFormat(event.endAt);
      }

      // Add recurrence rule if present
      if (includeRecurrence && event.recurrence) {
        try {
          const rruleString = toRRuleString(event.recurrence, event.startAt);
          if (rruleString) {
            // Extract just the rule part (remove DTSTART)
            const rulePart = rruleString.split('\n').find(line => line.startsWith('RRULE:'));
            if (rulePart) {
              icsEvent.recurrenceRule = rulePart.replace('RRULE:', '');
            }
          }
        } catch (error) {
          console.warn(`Failed to convert recurrence rule for event ${event.id}:`, error);
        }
      }

      return icsEvent;
    });

    const { error, value } = createEvents(icsEvents);
    
    if (error) {
      console.error("Error creating ICS content:", error);
      throw new Error("Failed to generate ICS content");
    }

    // Add calendar properties to the generated ICS
    const calendarHeader = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//FamilyVault//FamilyVault Calendar//EN",
      `X-WR-CALNAME:${calendarName}`,
      `X-WR-TIMEZONE:${timeZone}`,
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      ""
    ].join("\r\n");

    const calendarFooter = "END:VCALENDAR\r\n";

    // Replace the basic header from ics library with our enhanced version
    const icsContent = value || "";
    const eventsPart = icsContent
      .split("\r\n")
      .slice(3, -1) // Remove default header and footer
      .join("\r\n");

    return calendarHeader + eventsPart + "\r\n" + calendarFooter;

  } catch (error) {
    console.error("Error generating ICS content:", error);
    throw new Error("Failed to generate calendar export");
  }
}

/**
 * Converts a Date to ICS datetime format with timezone
 */
function convertDateToICSFormat(date: Date, timeZone: string): [number, number, number, number, number] {
  // Convert to specified timezone (for now, just use UTC)
  const utcDate = new Date(date.getTime());
  
  return [
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth() + 1, // ICS months are 1-based
    utcDate.getUTCDate(),
    utcDate.getUTCHours(),
    utcDate.getUTCMinutes()
  ];
}

/**
 * Converts a Date to ICS date format (for all-day events)
 */
function convertDateToICSDateFormat(date: Date): [number, number, number] {
  return [
    date.getFullYear(),
    date.getMonth() + 1, // ICS months are 1-based
    date.getDate()
  ];
}

/**
 * Generates a filename for the ICS export
 */
export function generateICSFilename(calendarName?: string): string {
  const sanitizedName = (calendarName || "calendar")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  
  const timestamp = new Date().toISOString().split('T')[0];
  return `${sanitizedName}-${timestamp}.ics`;
}

/**
 * Sets appropriate headers for ICS file download
 */
export function setICSHeaders(res: any, filename: string): void {
  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
}