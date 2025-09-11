import { db } from "../db";
import { threads } from "../../shared/schema";
import { eq, and } from "drizzle-orm";

const FAMILY_TITLE = "Family Chat";

export async function getOrCreateFamilyChatId() {
  // First, try to find existing family chat by familyId, isDefault, and name
  const [found] = await db.select().from(threads).where(
    and(
      eq(threads.familyId, "family-1"),
      eq(threads.isDefault, true),
      eq(threads.name, FAMILY_TITLE)
    )
  );
  if (found) return found.id;

  // If not found, create a new family chat thread
  const [created] = await db.insert(threads).values({
    id: crypto.randomUUID(),
    familyId: "family-1", // TODO: Get from authenticated user's family
    name: FAMILY_TITLE,
    description: "Default family chat",
    isDefault: true,
    createdBy: "system"
  }).returning();
  
  return created.id;
}