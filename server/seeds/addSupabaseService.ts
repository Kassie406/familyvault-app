import { db } from "../db";
import { apiServices } from "../../shared/schema";
import { eq } from "drizzle-orm";

// Add Supabase as a pre-configured API service
export async function addSupabaseService() {
  try {
    // Check if Supabase service already exists
    const existing = await db
      .select()
      .from(apiServices)
      .where(eq(apiServices.name, "Supabase"))
      .limit(1);

    if (existing.length > 0) {
      console.log("Supabase service already exists");
      return existing[0];
    }

    // Add Supabase service
    const [service] = await db
      .insert(apiServices)
      .values({
        name: "Supabase",
        category: "database",
        description: "Backend-as-a-Service platform with PostgreSQL database, authentication, real-time subscriptions, and storage",
        baseUrl: "https://supabase.com",
        status: "active",
        variables: JSON.stringify([
          "SUPABASE_URL",
          "SUPABASE_ANON_KEY",
          "SUPABASE_SERVICE_ROLE_KEY"
        ]),
        notes: "Used for database, authentication, and real-time features in the family portal application"
      })
      .returning();

    console.log("Supabase service added successfully:", service.id);
    return service;
  } catch (error) {
    console.error("Error adding Supabase service:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addSupabaseService()
    .then(() => {
      console.log("Seed completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}