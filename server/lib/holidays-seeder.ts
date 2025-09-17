import { db } from "../db";
import { calendarEvents, calendars } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface USHoliday {
  name: string;
  date: Date;
  observedDate?: Date;
  isObserved?: boolean;
  description?: string;
  type: "federal" | "popular" | "religious";
}

/**
 * Get US Federal Holidays for a given year with observed date rules
 */
export function getUSHolidays(year: number): USHoliday[] {
  const holidays: USHoliday[] = [];

  // New Year's Day - January 1
  const newYears = new Date(year, 0, 1);
  holidays.push({
    name: "New Year's Day",
    date: newYears,
    observedDate: getObservedDate(newYears),
    isObserved: true,
    description: "Federal holiday celebrating the beginning of the new year",
    type: "federal"
  });

  // Martin Luther King Jr. Day - Third Monday in January
  const mlkDay = getNthWeekdayOfMonth(year, 0, 1, 3); // Third Monday in January
  holidays.push({
    name: "Martin Luther King Jr. Day",
    date: mlkDay,
    description: "Federal holiday honoring civil rights leader Martin Luther King Jr.",
    type: "federal"
  });

  // Presidents' Day - Third Monday in February
  const presidentsDay = getNthWeekdayOfMonth(year, 1, 1, 3); // Third Monday in February
  holidays.push({
    name: "Presidents' Day",
    date: presidentsDay,
    description: "Federal holiday honoring all US presidents",
    type: "federal"
  });

  // Memorial Day - Last Monday in May
  const memorialDay = getLastWeekdayOfMonth(year, 4, 1); // Last Monday in May
  holidays.push({
    name: "Memorial Day",
    date: memorialDay,
    description: "Federal holiday honoring military personnel who died in service",
    type: "federal"
  });

  // Independence Day - July 4
  const independenceDay = new Date(year, 6, 4);
  holidays.push({
    name: "Independence Day",
    date: independenceDay,
    observedDate: getObservedDate(independenceDay),
    isObserved: true,
    description: "Federal holiday celebrating American independence",
    type: "federal"
  });

  // Labor Day - First Monday in September
  const laborDay = getNthWeekdayOfMonth(year, 8, 1, 1); // First Monday in September
  holidays.push({
    name: "Labor Day",
    date: laborDay,
    description: "Federal holiday honoring the American labor movement",
    type: "federal"
  });

  // Columbus Day - Second Monday in October
  const columbusDay = getNthWeekdayOfMonth(year, 9, 1, 2); // Second Monday in October
  holidays.push({
    name: "Columbus Day",
    date: columbusDay,
    description: "Federal holiday commemorating Christopher Columbus's arrival in the Americas",
    type: "federal"
  });

  // Veterans Day - November 11
  const veteransDay = new Date(year, 10, 11);
  holidays.push({
    name: "Veterans Day",
    date: veteransDay,
    observedDate: getObservedDate(veteransDay),
    isObserved: true,
    description: "Federal holiday honoring military veterans",
    type: "federal"
  });

  // Thanksgiving Day - Fourth Thursday in November
  const thanksgiving = getNthWeekdayOfMonth(year, 10, 4, 4); // Fourth Thursday in November
  holidays.push({
    name: "Thanksgiving Day",
    date: thanksgiving,
    description: "Federal holiday for giving thanks and celebrating the harvest",
    type: "federal"
  });

  // Christmas Day - December 25
  const christmas = new Date(year, 11, 25);
  holidays.push({
    name: "Christmas Day",
    date: christmas,
    observedDate: getObservedDate(christmas),
    isObserved: true,
    description: "Federal holiday celebrating the birth of Jesus Christ",
    type: "federal"
  });

  // Popular non-federal holidays
  
  // Valentine's Day - February 14
  holidays.push({
    name: "Valentine's Day",
    date: new Date(year, 1, 14),
    description: "Popular holiday celebrating love and relationships",
    type: "popular"
  });

  // Easter - Calculated based on lunar calendar
  const easter = calculateEaster(year);
  holidays.push({
    name: "Easter Sunday",
    date: easter,
    description: "Christian holiday celebrating the resurrection of Jesus Christ",
    type: "religious"
  });

  // Mother's Day - Second Sunday in May
  const mothersDay = getNthWeekdayOfMonth(year, 4, 0, 2); // Second Sunday in May
  holidays.push({
    name: "Mother's Day",
    date: mothersDay,
    description: "Popular holiday honoring mothers and motherhood",
    type: "popular"
  });

  // Father's Day - Third Sunday in June
  const fathersDay = getNthWeekdayOfMonth(year, 5, 0, 3); // Third Sunday in June
  holidays.push({
    name: "Father's Day",
    date: fathersDay,
    description: "Popular holiday honoring fathers and fatherhood",
    type: "popular"
  });

  // Halloween - October 31
  holidays.push({
    name: "Halloween",
    date: new Date(year, 9, 31),
    description: "Popular holiday for costumes, candy, and spooky celebrations",
    type: "popular"
  });

  return holidays;
}

/**
 * Get the observed date for holidays that fall on weekends
 * If holiday falls on Saturday, observed on Friday
 * If holiday falls on Sunday, observed on Monday
 */
function getObservedDate(date: Date): Date {
  const dayOfWeek = date.getDay();
  
  if (dayOfWeek === 0) { // Sunday
    return new Date(date.getTime() + 24 * 60 * 60 * 1000); // Next day (Monday)
  } else if (dayOfWeek === 6) { // Saturday
    return new Date(date.getTime() - 24 * 60 * 60 * 1000); // Previous day (Friday)
  }
  
  return date; // Weekday, no change needed
}

/**
 * Get the Nth occurrence of a weekday in a month
 * @param year Year
 * @param month Month (0-based)
 * @param weekday Weekday (0=Sunday, 1=Monday, ...)
 * @param n Which occurrence (1=first, 2=second, ...)
 */
function getNthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  
  // Calculate days to add to get to the first occurrence of the weekday
  let daysToAdd = (weekday - firstWeekday + 7) % 7;
  
  // Add additional weeks for the nth occurrence
  daysToAdd += (n - 1) * 7;
  
  return new Date(year, month, 1 + daysToAdd);
}

/**
 * Get the last occurrence of a weekday in a month
 * @param year Year
 * @param month Month (0-based)
 * @param weekday Weekday (0=Sunday, 1=Monday, ...)
 */
function getLastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  // Start from the last day of the month and work backwards
  const lastDay = new Date(year, month + 1, 0); // Last day of the month
  const lastWeekday = lastDay.getDay();
  
  // Calculate days to subtract to get to the last occurrence of the weekday
  let daysToSubtract = (lastWeekday - weekday + 7) % 7;
  
  return new Date(year, month, lastDay.getDate() - daysToSubtract);
}

/**
 * Calculate Easter Sunday for a given year using the algorithm
 */
function calculateEaster(year: number): Date {
  // Using the anonymous Gregorian algorithm
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day); // month is 1-based in the algorithm
}

/**
 * Seed US holidays for a specific year into the database
 */
export async function seedUSHolidays(year: number, calendarId?: string): Promise<void> {
  try {
    console.log(`[holidays] Seeding US holidays for ${year}...`);
    
    // Find the "Holidays in United States" calendar or use provided calendarId
    let targetCalendarId = calendarId;
    
    if (!targetCalendarId) {
      const holidayCalendars = await db
        .select()
        .from(calendars)
        .where(eq(calendars.name, "Holidays in United States"))
        .limit(1);
      
      if (!holidayCalendars.length) {
        console.error("[holidays] No 'Holidays in United States' calendar found");
        return;
      }
      
      targetCalendarId = holidayCalendars[0].id;
    }
    
    const holidays = getUSHolidays(year);
    
    for (const holiday of holidays) {
      const eventDate = holiday.observedDate || holiday.date;
      
      // Create all-day events for holidays
      await db
        .insert(calendarEvents)
        .values({
          calendarId: targetCalendarId,
          creatorUserId: "system", // System-generated event
          title: holiday.name,
          description: holiday.description || "",
          location: "",
          startAt: new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()),
          endAt: new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate() + 1),
          allDay: true,
          timezone: "UTC",
          visibility: "family"
        })
        .onConflictDoNothing(); // Don't duplicate if already exists
    }
    
    console.log(`[holidays] Successfully seeded ${holidays.length} holidays for ${year}`);
  } catch (error) {
    console.error(`[holidays] Error seeding holidays for ${year}:`, error);
    throw error;
  }
}

/**
 * Seed holidays for multiple years
 */
export async function seedHolidaysForYears(startYear: number, endYear: number, calendarId?: string): Promise<void> {
  for (let year = startYear; year <= endYear; year++) {
    await seedUSHolidays(year, calendarId);
  }
}

/**
 * Seed holidays for the current year and next year
 */
export async function seedCurrentAndNextYearHolidays(calendarId?: string): Promise<void> {
  const currentYear = new Date().getFullYear();
  await seedHolidaysForYears(currentYear, currentYear + 1, calendarId);
}