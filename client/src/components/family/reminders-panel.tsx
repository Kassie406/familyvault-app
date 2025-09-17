import React, { useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Plus,
  X,
} from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  context?: string;
  dateISO: string;
  cadence?: "one-time" | "monthly" | "yearly" | "quarterly";
}

export default function RemindersPanel() {
  const [location, setLocation] = useLocation();
  const isOpen = location === "/family/reminders";

  const onClose = useCallback(() => {
    setLocation("/family");
  }, [setLocation]);

  // Sample reminders data
  const reminders: Reminder[] = [
    {
      id: "1",
      title: "Renew Driver's License",
      context: "Family IDs • Sarah's License",
      dateISO: "2024-12-15",
      cadence: "yearly"
    },
    {
      id: "2", 
      title: "Health Insurance Review",
      context: "Insurance • Family Plan",
      dateISO: "2025-01-30",
      cadence: "yearly"
    },
    {
      id: "3",
      title: "Passport Renewal",
      context: "Family IDs • Dad's Passport", 
      dateISO: "2025-03-15",
      cadence: "one-time"
    },
    {
      id: "4",
      title: "Property Tax Payment",
      context: "Taxes • Main Residence",
      dateISO: "2025-04-01",
      cadence: "yearly"
    },
    {
      id: "5",
      title: "Update Emergency Contacts",
      context: "Family Resources • Emergency Info",
      dateISO: "2024-11-20",
      cadence: "quarterly"
    },
    {
      id: "6",
      title: "Sarah's Birthday",
      context: "Family Birthdays • Age 16",
      dateISO: "2025-02-14",
      cadence: "yearly"
    },
    {
      id: "7",
      title: "Mom's Birthday",
      context: "Family Birthdays • Birthday Celebration",
      dateISO: "2025-03-22",
      cadence: "yearly"
    },
    {
      id: "8",
      title: "Dad's Birthday", 
      context: "Family Birthdays • Birthday Celebration",
      dateISO: "2025-05-18",
      cadence: "yearly"
    },
    {
      id: "9",
      title: "Grandma's Birthday",
      context: "Family Birthdays • 85th Birthday",
      dateISO: "2025-06-08",
      cadence: "yearly"
    }
  ];

  const { overdue, upcoming } = useMemo(() => {
    const now = new Date();
    const overdueItems: Reminder[] = [];
    const upcomingItems: Reminder[] = [];

    reminders.forEach(reminder => {
      const reminderDate = new Date(reminder.dateISO);
      if (reminderDate < now) {
        overdueItems.push(reminder);
      } else {
        upcomingItems.push(reminder);
      }
    });

    return {
      overdue: overdueItems.sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()),
      upcoming: upcomingItems.sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime())
    };
  }, [reminders]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-lg bg-[#0A0A1A] border-l border-[#2A2A33] text-white overflow-auto"
        data-testid="reminders-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E1E24] pb-4 mb-0">
          <SheetHeader className="space-y-1 flex-1">
            <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#D4AF37]" />
              Reminders
            </SheetTitle>
            <p className="text-sm text-neutral-400">
              Keep track of important dates and renewals for your family.
            </p>
          </SheetHeader>
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-[#D4AF37] text-black hover:bg-[#c6a02e]" data-testid="new-reminder-button">
              <Plus className="h-4 w-4 mr-1"/> New
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="text-neutral-300 hover:text-white"
              data-testid="close-reminders-button"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="px-1 py-5 space-y-6">
          {overdue.length > 0 && (
            <div>
              <SectionHeader title={`Overdue`} count={overdue.length} tone="danger" />
              <div className="mt-2 space-y-2">
                {overdue.map(r => <ReminderRow key={r.id} r={r} />)}
              </div>
            </div>
          )}

          <div>
            <SectionHeader title={`Upcoming`} count={upcoming.length} />
            <div className="mt-2 space-y-2">
              {upcoming.map(r => <ReminderRow key={r.id} r={r} />)}
            </div>
          </div>

          <Separator className="bg-[#1E1E24]"/>

          <div className="text-xs text-neutral-400">
            Tip: attach reminders to specific vault items (IDs, insurance, passports) so renewals auto‑appear here.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SectionHeader({ title, count, tone }: { title: string; count: number; tone?: "danger" | "default" }) {
  return (
    <div className="flex items-center gap-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <Badge 
        className={`h-5 rounded-full text-[10px] ${
          tone === "danger" 
            ? "bg-red-600/20 border-red-700 text-red-300" 
            : "bg-[#111111] border-[#2A2A33] text-[#D4AF37]"
        }`}
      >
        {count}
      </Badge>
    </div>
  );
}

function ReminderRow({ r }: { r: Reminder }) {
  const date = new Date(r.dateISO);
  const pretty = date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  
  return (
    <div 
      className="rounded-xl border border-[#2A2A33] bg-[#0F0F13] p-3 hover:border-[#D4AF37]/30 transition-colors"
      data-testid={`reminder-item-${r.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium truncate hover:underline cursor-default">{r.title}</div>
          <div className="text-xs text-neutral-400 truncate">
            {r.context ? <span className="text-neutral-300">{r.context}</span> : null}
            {r.context ? " • " : ""}
            <span>{pretty}</span>
            {r.cadence && r.cadence !== "one-time" ? <span>{`, ${capitalize(r.cadence)}`}</span> : null}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs text-neutral-300 hover:text-white"
            data-testid={`view-reminder-${r.id}`}
          >
            View
          </Button>
          <Button 
            size="sm" 
            className="h-7 px-3 bg-[#D4AF37] text-black hover:bg-[#c6a02e]"
            data-testid={`done-reminder-${r.id}`}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

function capitalize(s?: string) { 
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; 
}