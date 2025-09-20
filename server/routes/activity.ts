import { Request, Response } from 'express';
import { z } from 'zod';

// Mock data store - replace with actual database
let activityStore: any[] = [
  {
    id: '1',
    type: 'message:new',
    source: 'Inbox',
    title: 'New message from Sarah',
    summary: 'Hey everyone! Just wanted to share some photos from our trip...',
    actor: { id: 'user-2', name: 'Sarah Johnson' },
    severity: 'info',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    link: '/inbox/thread/123',
    read: false,
    meta: { threadId: '123' }
  },
  {
    id: '2',
    type: 'upload:photo',
    source: 'Upload Center',
    title: 'Family vacation photos uploaded',
    summary: '12 new photos added to the family album',
    actor: { id: 'user-1', name: 'Dad' },
    severity: 'info',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    link: '/photos/album/vacation-2025',
    read: true,
    meta: { photoCount: 12 }
  },
  {
    id: '3',
    type: 'reminder:created',
    source: 'Reminders',
    title: 'Dentist appointment reminder set',
    summary: 'Reminder for Tommy\'s dentist appointment on Friday',
    actor: { id: 'user-3', name: 'Mom' },
    severity: 'warning',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    link: '/reminders/456',
    read: false,
    meta: { reminderDate: '2025-09-22' }
  },
  {
    id: '4',
    type: 'calendar:event_created',
    source: 'Calendar',
    title: 'Family dinner scheduled',
    summary: 'Sunday family dinner at Grandma\'s house',
    actor: { id: 'user-3', name: 'Mom' },
    severity: 'info',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    link: '/calendar/event/789',
    read: true,
    meta: { eventDate: '2025-09-21' }
  },
  {
    id: '5',
    type: 'ice:updated',
    source: 'Emergency Contacts',
    title: 'Emergency contact updated',
    summary: 'Updated Dr. Smith\'s phone number',
    actor: { id: 'user-1', name: 'Dad' },
    severity: 'critical',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    link: '/family/emergency',
    read: false,
    meta: { contactType: 'doctor' }
  }
];

const activityQuerySchema = z.object({
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 20),
  cursor: z.string().optional(),
  types: z.string().optional(),
  severity: z.string().optional(),
  unreadOnly: z.string().optional().transform(val => val === 'true'),
  since: z.string().optional(),
  timeRange: z.enum(['7d', '30d', '90d']).optional().default('30d')
});

export async function getActivity(req: Request, res: Response) {
  try {
    const query = activityQuerySchema.parse(req.query);
    
    let filteredItems = [...activityStore];
    
    // Filter by time range
    const now = new Date();
    const timeRangeMs = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000
    };
    const cutoffDate = new Date(now.getTime() - timeRangeMs[query.timeRange]);
    filteredItems = filteredItems.filter(item => new Date(item.createdAt) >= cutoffDate);
    
    // Filter by types
    if (query.types) {
      const typeList = query.types.split(',');
      filteredItems = filteredItems.filter(item => typeList.includes(item.type));
    }
    
    // Filter by severity
    if (query.severity) {
      filteredItems = filteredItems.filter(item => item.severity === query.severity);
    }
    
    // Filter by unread only
    if (query.unreadOnly) {
      filteredItems = filteredItems.filter(item => !item.read);
    }
    
    // Filter by since timestamp
    if (query.since) {
      const sinceDate = new Date(query.since);
      filteredItems = filteredItems.filter(item => new Date(item.createdAt) > sinceDate);
    }
    
    // Sort by creation date (newest first)
    filteredItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Apply pagination
    const startIndex = query.cursor ? filteredItems.findIndex(item => item.id === query.cursor) + 1 : 0;
    const endIndex = startIndex + query.limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);
    
    const hasMore = endIndex < filteredItems.length;
    const nextCursor = hasMore ? paginatedItems[paginatedItems.length - 1]?.id : undefined;
    
    res.json({
      items: paginatedItems,
      nextCursor,
      hasMore
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
}

export async function markActivityRead(req: Request, res: Response) {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'ids must be an array' });
    }
    
    // Mark items as read
    activityStore = activityStore.map(item => 
      ids.includes(item.id) ? { ...item, read: true } : item
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking activity as read:', error);
    res.status(500).json({ error: 'Failed to mark activity as read' });
  }
}

export async function markAllActivityRead(req: Request, res: Response) {
  try {
    // Mark all items as read
    activityStore = activityStore.map(item => ({ ...item, read: true }));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking all activity as read:', error);
    res.status(500).json({ error: 'Failed to mark all activity as read' });
  }
}

export async function emitActivity(req: Request, res: Response) {
  try {
    const activityItem = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...req.body,
      createdAt: req.body.createdAt || new Date().toISOString(),
      read: false
    };
    
    // Add to store (in real app, save to database)
    activityStore.unshift(activityItem);
    
    // Keep only last 1000 items to prevent memory issues
    if (activityStore.length > 1000) {
      activityStore = activityStore.slice(0, 1000);
    }
    
    res.json({ success: true, id: activityItem.id });
  } catch (error) {
    console.error('Error emitting activity:', error);
    res.status(500).json({ error: 'Failed to emit activity' });
  }
}
