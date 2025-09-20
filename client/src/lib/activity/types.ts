export type ActivityItem = {
  id: string;
  type:
    | "message:new"
    | "reminder:created"
    | "reminder:completed"
    | "calendar:event_created"
    | "upload:document"
    | "upload:photo"
    | "ice:updated"
    | "budget:updated";
  source: string;             // "Inbox", "Reminders", "Calendar", etc.
  title: string;              // short headline
  summary?: string;           // optional details
  actor?: { id: string; name: string };
  severity?: "info" | "warning" | "critical";
  createdAt: string;          // ISO
  link: string;               // deep-link to the item
  read?: boolean;
  meta?: Record<string, any>;
};

export type ActivityFilter = "all" | "me" | "alerts";
export type ActivityTimeRange = "7d" | "30d" | "90d";

export type ActivityResponse = {
  items: ActivityItem[];
  nextCursor?: string;
  hasMore?: boolean;
};
