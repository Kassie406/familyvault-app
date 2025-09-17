// server/lib/reminders-worker.ts

import { prisma } from "../storage";

export async function processReminders() {
  try {
    const reminders = await prisma.reminder.findMany({
      where: { completed: false },
    });

    for (const reminder of reminders) {
      console.log(`⏰ Reminder: ${reminder.title} scheduled at ${reminder.date}`);
      // Add logic to send notifications here
    }
  } catch (err) {
    console.error("❌ Failed to process reminders:", err);
  }
}

// Run the worker on startup
// processReminders();
