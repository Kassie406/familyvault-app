import { db } from "../db";
import { messageThreads } from "../../shared/schema";
import { eq } from "drizzle-orm";

const FAMILY_KEY = "family-global";

export async function getOrCreateFamilyChatId() {
  // First, try to find existing family chat by key
  const [found] = await db.select().from(messageThreads).where(eq(messageThreads.key, FAMILY_KEY));
  if (found) return found.id;

  // If not found, create a new family chat thread
  const [created] = await db.insert(messageThreads).values({
    id: crypto.randomUUID(),
    key: FAMILY_KEY,
    kind: "family",
    title: "Family Chat",
    familyId: "family-1", // TODO: Get from authenticated user's family
    createdBy: "system"
  }).returning();
  
  return created.id;
}