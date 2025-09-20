import { ActivityItem } from './types';

export async function emitActivity(item: Omit<ActivityItem, 'id' | 'createdAt'>): Promise<void> {
  try {
    const response = await fetch('/api/activity/emit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        ...item,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.warn('Failed to emit activity:', response.status);
    }
  } catch (error) {
    console.warn('Error emitting activity:', error);
  }
}

// Helper to get current user for actor field
export function getCurrentActor(): { id: string; name: string } {
  // TODO: Replace with actual user context
  return {
    id: 'current-user',
    name: 'Current User'
  };
}

// Icon mapping for activity types
export function getActivityIcon(type: ActivityItem['type']): string {
  switch (type) {
    case 'message:new':
      return '💬';
    case 'reminder:created':
    case 'reminder:completed':
      return '⏰';
    case 'calendar:event_created':
      return '📅';
    case 'upload:document':
    case 'upload:photo':
      return '⬆️';
    case 'ice:updated':
      return '🛟';
    case 'budget:updated':
      return '💵';
    default:
      return '📝';
  }
}

// Severity color mapping
export function getSeverityColor(severity?: ActivityItem['severity']): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-500';
    case 'warning':
      return 'bg-[#c5a000]';
    case 'info':
    default:
      return 'bg-gray-500';
  }
}
