import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Plus, ShieldAlert, Edit3, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Reminder {
  id: string;
  title: string;
  context?: string;
  dateISO: string;
  cadence?: "one-time" | "monthly" | "yearly" | "quarterly";
}

interface EnhancedRemindersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mainMenuWidth?: number;
}

export default function EnhancedRemindersSidebar({ 
  isOpen, 
  onClose, 
  mainMenuWidth = 256
}: EnhancedRemindersSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNewReminder = () => {
    console.log('New reminder clicked');
  };

  const handleViewReminder = (reminderId: string) => {
    console.log('View reminder:', reminderId);
  };

  const handleDoneReminder = (reminderId: string) => {
    console.log('Done reminder:', reminderId);
  };

  function capitalize(s?: string) { 
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; 
  }

  function SectionHeader({ title, count, tone }: { title: string; count: number; tone?: "danger" | "default" }) {
    return (
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-medium text-white">{title}</h3>
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
    const isOverdue = date < new Date();
    
    return (
      <div 
        className="rounded-xl border border-[#2A2A33] bg-[#0F0F13] p-3 hover:border-[#D4AF37]/30 transition-colors mb-3"
        data-testid={`reminder-item-${r.id}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white truncate hover:underline cursor-default">{r.title}</div>
            <div className="text-xs text-neutral-400 truncate">
              {r.context ? <span className="text-neutral-300">{r.context}</span> : null}
              {r.context ? " • " : ""}
              <span className={isOverdue ? "text-red-400" : ""}>{pretty}</span>
              {r.cadence && r.cadence !== "one-time" ? <span>{`, ${capitalize(r.cadence)}`}</span> : null}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleViewReminder(r.id)}
              className="h-7 px-2 text-xs text-neutral-300 hover:text-white"
              data-testid={`view-reminder-${r.id}`}
            >
              View
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleDoneReminder(r.id)}
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop positioned to not cover main sidebar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            style={{ left: `${mainMenuWidth}px` }}
            onClick={onClose}
          />

          {/* Sidebar positioned next to main menu */}
          <motion.aside
            ref={sidebarRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="inbox-sidebar fixed top-0 h-full w-96 bg-[#0A0A0A] border-r border-[#2A2A33] z-50 shadow-2xl"
            style={{ left: `${mainMenuWidth}px` }}
          >
            {/* Header */}
            <header className="flex items-center justify-between p-6 border-b border-[#2A2A33]">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[#D4AF37]" />
                  Reminders
                </h2>
                <p className="text-sm text-gray-400">Keep track of important dates and renewals for your family</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  onClick={handleNewReminder}
                  className="bg-[#D4AF37] text-black hover:bg-[#c6a02e]"
                  data-testid="new-reminder-button"
                >
                  <Plus className="h-4 w-4 mr-1"/> New
                </Button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors text-gray-400 hover:text-white"
                  data-testid="close-enhanced-reminders-sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            {/* Content */}
            <div className="documents-list flex-1 overflow-y-auto p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#2A2A33]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-600/20 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{overdue.length}</div>
                      <div className="text-sm text-gray-400">Overdue</div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#2A2A33]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
                      <Calendar className="h-5 w-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{upcoming.length}</div>
                      <div className="text-sm text-gray-400">Upcoming</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overdue Section */}
              {overdue.length > 0 && (
                <div>
                  <SectionHeader title="Overdue" count={overdue.length} tone="danger" />
                  <div className="space-y-2">
                    {overdue.map(r => <ReminderRow key={r.id} r={r} />)}
                  </div>
                </div>
              )}

              {/* Upcoming Section */}
              <div>
                <SectionHeader title="Upcoming" count={upcoming.length} />
                <div className="space-y-2">
                  {upcoming.map(r => <ReminderRow key={r.id} r={r} />)}
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#2A2A33]">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                  Pro Tips
                </h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>• Attach reminders to specific vault items (IDs, insurance, passports) so renewals auto‑appear here</p>
                  <p>• Set up recurring reminders for annual renewals and important dates</p>
                  <p>• Use the mobile app to get push notifications for upcoming deadlines</p>
                </div>
              </div>
            </div>

            {/* ICE Bar */}
            <div className="ice-bar relative p-4 border-t border-[#2A2A33] bg-[#0A0A0A]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-medium text-white">In Case of Emergency (ICE)</span>
                </div>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-[#D4AF37] text-black text-sm font-medium rounded-lg hover:bg-[#B8860B] transition-colors">
                  <Edit3 className="h-3 w-3" />
                  Edit
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
