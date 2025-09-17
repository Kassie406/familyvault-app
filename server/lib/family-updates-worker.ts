import { db } from "../db";
import { familyUpdates, familyMembers, familyResources } from "@shared/schema";
import { eq, and, isNull, gte, lte, sql } from "drizzle-orm";
import { emitFamilyActivity } from "../realtime";

/**
 * Auto-generate Family Updates (Reminders & Notices) based on various conditions
 * Called daily by a background worker
 */
export async function generateFamilyUpdates(familyId: string) {
  console.log(`[family-updates] Generating updates for family ${familyId}`);
  
  try {
    const now = new Date();
    
    // Helper function to add days to a date
    const addDays = (date: Date, days: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    // 1) Insurance Renewal Due - Check documents with renewal dates
    const insuranceDocs = await db
      .select()
      .from(familyResources)
      .where(
        and(
          eq(familyResources.familyId, familyId),
          eq(familyResources.category, "insurance"),
          isNull(familyResources.metadata)
        )
      );

    for (const doc of insuranceDocs) {
      const metadata = doc.content ? JSON.parse(doc.content) : {};
      if (metadata.renewalDate) {
        const renewalDate = new Date(metadata.renewalDate);
        const daysDiff = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        
        if (daysDiff <= 15 && daysDiff > 0) {
          // Create renewal reminder
          await db.insert(familyUpdates).values({
            familyId,
            type: "insurance_renewal",
            title: "Insurance Renewal Due",
            body: `Your family ${doc.subcategory || 'insurance'} policy expires in ${daysDiff} days. Click to review and renew.`,
            severity: daysDiff <= 5 ? "urgent" : "warning",
            dueAt: renewalDate,
            actionUrl: `/family/documents?category=insurance`,
            metadata: { documentId: doc.id, daysRemaining: daysDiff }
          });
        }
      }
    }

    // 2) Password Security Review - Check for accounts without 2FA
    const passwordDocs = await db
      .select()
      .from(familyResources)
      .where(
        and(
          eq(familyResources.familyId, familyId),
          eq(familyResources.category, "passwords")
        )
      );

    let accountsWithoutMFA = 0;
    for (const doc of passwordDocs) {
      const content = doc.content ? JSON.parse(doc.content) : {};
      if (!content.hasTwoFactor) {
        accountsWithoutMFA++;
      }
    }

    if (accountsWithoutMFA > 0) {
      await db.insert(familyUpdates).values({
        familyId,
        type: "security_reminder",
        title: "Password Security Review",
        body: `${accountsWithoutMFA} family accounts need password updates for better security.`,
        severity: "warning",
        actionUrl: `/family/passwords`,
        metadata: { accountsCount: accountsWithoutMFA }
      });
    }

    // 3) Birthdays in next 7 days
    const familyMembersData = await db
      .select()
      .from(familyMembers)
      .where(eq(familyMembers.familyId, familyId));

    for (const member of familyMembersData) {
      if (!member.dateOfBirth) continue;
      
      const birthDate = new Date(member.dateOfBirth);
      const thisYearBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      const in7Days = addDays(now, 7);
      
      if (thisYearBirthday >= now && thisYearBirthday <= in7Days) {
        await db.insert(familyUpdates).values({
          familyId,
          type: "birthday",
          title: `${member.name}'s birthday is coming up!`,
          body: `Celebrate on ${thisYearBirthday.toLocaleDateString()}.`,
          severity: "info",
          dueAt: thisYearBirthday,
          metadata: { memberId: member.id, memberName: member.name }
        });
      }
    }

    // 4) Family Meeting Reminders (mock for now - could be from calendar integration)
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + (7 - now.getDay()));
    nextSunday.setHours(18, 0, 0, 0); // 6 PM

    if (Math.ceil((nextSunday.getTime() - now.getTime()) / (1000 * 3600 * 24)) <= 3) {
      await db.insert(familyUpdates).values({
        familyId,
        type: "family_meeting",
        title: "Family Meeting Scheduled",
        body: `Monthly family check-in this Sunday at 6 PM. We'll discuss vacation plans and budget updates.`,
        severity: "info",
        dueAt: nextSunday,
        actionUrl: `/family/calendar`,
        metadata: { meetingType: "monthly_checkin" }
      });
    }

    console.log(`[family-updates] Successfully generated updates for family ${familyId}`);
    
  } catch (error) {
    console.error(`[family-updates] Error generating updates for family ${familyId}:`, error);
  }
}

/**
 * Clean up old dismissed updates (older than 30 days)
 */
export async function cleanupOldUpdates() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  try {
    const result = await db
      .delete(familyUpdates)
      .where(
        and(
          eq(familyUpdates.isDismissed, true),
          lte(familyUpdates.dismissedAt, thirtyDaysAgo)
        )
      );
    
    console.log(`[family-updates] Cleaned up old dismissed updates`);
  } catch (error) {
    console.error(`[family-updates] Error cleaning up old updates:`, error);
  }
}