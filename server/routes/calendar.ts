import { Router } from "express";
import { db } from "../db";
import { calendars, calendarEvents, calendarEventSnoozes } from "@shared/schema";
import { and, eq, gte, lte, desc } from "drizzle-orm";
import { z } from "zod";
import { expandRecurringEvents } from "../lib/recurrence";
import { getRealtimeManager } from "../lib/realtime";
import { generateICSContent, generateICSFilename, setICSHeaders } from "../lib/ics-export";

export const calendarRouter = Router();

// Auth middleware - assumes req.user exists with familyId
const requireFamilyAuth = (req: any, res: any, next: any) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Authentication required" });
  }
  // For now, use a default family ID. In production, get from user's family membership
  req.user.familyId = "family-1";
  next();
};

// GET /api/calendars - List all calendars for the family
calendarRouter.get("/api/calendars", requireFamilyAuth, async (req: any, res) => {
  try {
    const familyCalendars = await db
      .select()
      .from(calendars)
      .where(eq(calendars.familyId, req.user.familyId))
      .orderBy(calendars.name);
    
    res.json(familyCalendars);
  } catch (error) {
    console.error("Error fetching calendars:", error);
    res.status(500).json({ error: "Failed to fetch calendars" });
  }
});

// POST /api/calendars - Create a new calendar
calendarRouter.post("/api/calendars", requireFamilyAuth, async (req: any, res) => {
  try {
    const schema = z.object({
      name: z.string().min(1, "Calendar name is required"),
      color: z.string().optional(),
      isSystem: z.boolean().optional().default(false)
    });
    
    const data = schema.parse(req.body);
    
    const [newCalendar] = await db
      .insert(calendars)
      .values({
        familyId: req.user.familyId,
        name: data.name,
        color: data.color || "#D4AF37",
        isSystem: data.isSystem
      })
      .returning();
    
    res.status(201).json(newCalendar);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating calendar:", error);
    res.status(500).json({ error: "Failed to create calendar" });
  }
});

// GET /api/events - List events for a date range and calendar(s)
calendarRouter.get("/api/events", requireFamilyAuth, async (req: any, res) => {
  try {
    const { from, to, calendarId } = req.query;
    
    if (!from || !to) {
      return res.status(400).json({ error: "from and to dates are required" });
    }
    
    const conditions = [
      gte(calendarEvents.endAt, new Date(from as string)),
      lte(calendarEvents.startAt, new Date(to as string))
    ];
    
    if (calendarId) {
      conditions.push(eq(calendarEvents.calendarId, calendarId as string));
    }
    
    const events = await db
      .select()
      .from(calendarEvents)
      .where(and(...conditions))
      .orderBy(calendarEvents.startAt);
    
    // Expand recurrence rules for the requested date range
    const expandedEvents = expandRecurringEvents(
      events.map(event => ({
        ...event,
        recurrence: event.recurrence as any // Cast to our recurrence type
      })),
      new Date(from as string),
      new Date(to as string)
    );
    
    res.json(expandedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// POST /api/events - Create a new event
calendarRouter.post("/api/events", requireFamilyAuth, async (req: any, res) => {
  try {
    const schema = z.object({
      calendarId: z.string().uuid("Invalid calendar ID"),
      title: z.string().min(1, "Event title is required"),
      description: z.string().optional(),
      location: z.string().optional(),
      startAt: z.string(),
      endAt: z.string(),
      allDay: z.boolean().optional().default(false),
      timezone: z.string().optional().default("UTC"),
      recurrence: z.any().optional(),
      visibility: z.enum(["private", "family", "public"]).optional().default("family"),
      attendees: z.array(z.object({
        userId: z.string().uuid(),
        role: z.string().optional().default("viewer")
      })).optional()
    });
    
    const data = schema.parse(req.body);
    
    // Verify calendar belongs to user's family
    const calendar = await db
      .select()
      .from(calendars)
      .where(and(
        eq(calendars.id, data.calendarId),
        eq(calendars.familyId, req.user.familyId)
      ))
      .limit(1);
    
    if (!calendar.length) {
      return res.status(403).json({ error: "Calendar not found or access denied" });
    }
    
    const [newEvent] = await db
      .insert(calendarEvents)
      .values({
        calendarId: data.calendarId,
        creatorUserId: req.user.id,
        title: data.title,
        description: data.description,
        location: data.location,
        startAt: new Date(data.startAt),
        endAt: new Date(data.endAt),
        allDay: data.allDay,
        timezone: data.timezone,
        recurrence: data.recurrence,
        visibility: data.visibility
      })
      .returning();
    
    // TODO: Insert attendees if provided
    
    // Broadcast calendar event creation
    const realtimeManager = getRealtimeManager();
    if (realtimeManager) {
      realtimeManager.broadcastToFamily(req.user.familyId, "calendar:event:created", {
        event: newEvent,
        calendarId: data.calendarId
      });
    }
    
    res.status(201).json(newEvent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// PATCH /api/events/:id - Update an event
calendarRouter.patch("/api/events/:id", requireFamilyAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    // Verify event exists and user has access
    const existingEvent = await db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.id, id))
      .limit(1);
    
    if (!existingEvent.length) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    // TODO: Check if user has edit permission
    
    const updateData: any = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.location !== undefined) updateData.location = req.body.location;
    if (req.body.startAt) updateData.startAt = new Date(req.body.startAt);
    if (req.body.endAt) updateData.endAt = new Date(req.body.endAt);
    if (req.body.allDay !== undefined) updateData.allDay = req.body.allDay;
    if (req.body.timezone) updateData.timezone = req.body.timezone;
    if (req.body.recurrence !== undefined) updateData.recurrence = req.body.recurrence;
    if (req.body.visibility) updateData.visibility = req.body.visibility;
    
    updateData.updatedAt = new Date();
    
    const [updatedEvent] = await db
      .update(calendarEvents)
      .set(updateData)
      .where(eq(calendarEvents.id, id))
      .returning();
    
    // Broadcast calendar event update
    const realtimeManager = getRealtimeManager();
    if (realtimeManager) {
      realtimeManager.broadcastToFamily(req.user.familyId, "calendar:event:updated", {
        event: updatedEvent
      });
    }
    
    res.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// DELETE /api/events/:id - Delete an event
calendarRouter.delete("/api/events/:id", requireFamilyAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    // Verify event exists and user has access
    const existingEvent = await db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.id, id))
      .limit(1);
    
    if (!existingEvent.length) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    // TODO: Check if user has delete permission
    
    await db
      .delete(calendarEvents)
      .where(eq(calendarEvents.id, id));
    
    // Broadcast calendar event deletion
    const realtimeManager = getRealtimeManager();
    if (realtimeManager) {
      realtimeManager.broadcastToFamily(req.user.familyId, "calendar:event:deleted", {
        eventId: id
      });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// POST /api/events/:id/snooze - Snooze an event for the current user
calendarRouter.post("/api/events/:id/snooze", requireFamilyAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { until } = z.object({ 
      until: z.string() 
    }).parse(req.body);
    
    await db
      .insert(calendarEventSnoozes)
      .values({
        eventId: id,
        userId: req.user.id,
        snoozeUntil: new Date(until)
      })
      .onConflictDoUpdate({
        target: [calendarEventSnoozes.eventId, calendarEventSnoozes.userId],
        set: { snoozeUntil: new Date(until) }
      });
    
    res.status(204).end();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error snoozing event:", error);
    res.status(500).json({ error: "Failed to snooze event" });
  }
});

// DELETE /api/events/:id/snooze - Remove snooze for an event
calendarRouter.delete("/api/events/:id/snooze", requireFamilyAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    await db
      .delete(calendarEventSnoozes)
      .where(and(
        eq(calendarEventSnoozes.eventId, id),
        eq(calendarEventSnoozes.userId, req.user.id)
      ));
    
    res.status(204).end();
  } catch (error) {
    console.error("Error removing snooze:", error);
    res.status(500).json({ error: "Failed to remove snooze" });
  }
});

// GET /api/calendars/:id/export - Export calendar as ICS
calendarRouter.get("/api/calendars/:id/export", requireFamilyAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { from, to } = req.query;
    
    // Verify calendar belongs to user's family
    const calendar = await db
      .select()
      .from(calendars)
      .where(and(
        eq(calendars.id, id),
        eq(calendars.familyId, req.user.familyId)
      ))
      .limit(1);
    
    if (!calendar.length) {
      return res.status(403).json({ error: "Calendar not found or access denied" });
    }
    
    // Get events for the calendar
    const conditions = [eq(calendarEvents.calendarId, id)];
    
    if (from && to) {
      conditions.push(
        gte(calendarEvents.endAt, new Date(from as string)),
        lte(calendarEvents.startAt, new Date(to as string))
      );
    }
    
    const events = await db
      .select()
      .from(calendarEvents)
      .where(and(...conditions))
      .orderBy(calendarEvents.startAt);
    
    // Generate ICS content
    const icsContent = generateICSContent(events, {
      calendarName: calendar[0].name,
      timeZone: "UTC",
      includeRecurrence: true
    });
    
    // Set headers and send file
    const filename = generateICSFilename(calendar[0].name);
    setICSHeaders(res, filename);
    
    res.send(icsContent);
  } catch (error) {
    console.error("Error exporting calendar:", error);
    res.status(500).json({ error: "Failed to export calendar" });
  }
});

// GET /api/export/all-calendars - Export all family calendars as ICS
calendarRouter.get("/api/export/all-calendars", requireFamilyAuth, async (req: any, res) => {
  try {
    const { from, to } = req.query;
    
    // Get all events for the family's calendars
    const conditions = [];
    
    if (from && to) {
      conditions.push(
        gte(calendarEvents.endAt, new Date(from as string)),
        lte(calendarEvents.startAt, new Date(to as string))
      );
    }
    
    const events = await db
      .select({
        id: calendarEvents.id,
        title: calendarEvents.title,
        description: calendarEvents.description,
        location: calendarEvents.location,
        startAt: calendarEvents.startAt,
        endAt: calendarEvents.endAt,
        allDay: calendarEvents.allDay,
        timezone: calendarEvents.timezone,
        recurrence: calendarEvents.recurrence,
        createdAt: calendarEvents.createdAt,
        updatedAt: calendarEvents.updatedAt,
        calendarName: calendars.name
      })
      .from(calendarEvents)
      .innerJoin(calendars, eq(calendarEvents.calendarId, calendars.id))
      .where(and(
        eq(calendars.familyId, req.user.familyId),
        ...conditions
      ))
      .orderBy(calendarEvents.startAt);
    
    // Generate ICS content
    const icsContent = generateICSContent(events, {
      calendarName: "FamilyVault - All Calendars",
      timeZone: "UTC",
      includeRecurrence: true
    });
    
    // Set headers and send file
    const filename = generateICSFilename("familyvault-all-calendars");
    setICSHeaders(res, filename);
    
    res.send(icsContent);
  } catch (error) {
    console.error("Error exporting all calendars:", error);
    res.status(500).json({ error: "Failed to export calendars" });
  }
});