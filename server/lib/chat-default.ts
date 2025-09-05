import { db } from "../db";
import { messageThreads } from "../../shared/schema";
import { eq, and } from "drizzle-orm";

const FAMILY_TITLE = "Family Chat";

export async function getOrCreateFamilyChatId() {
  // First, try to find existing family chat by title and kind
  const [found] = await db.select().from(messageThreads).where(
    and(
      eq(messageThreads.title, FAMILY_TITLE),
      eq(messageThreads.kind, "family")
    )
  );
  if (found) return found.id;

  // If not found, create a new family chat thread
  const [created] = await db.insert(messageThreads).values({
    id: crypto.randomUUID(),
    kind: "family",
    title: FAMILY_TITLE,
    familyId: "family-1", // TODO: Get from authenticated user's family
    createdBy: "system"
  }).returning();
  
  return created.id;
}