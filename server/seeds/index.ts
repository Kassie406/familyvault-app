import { addSupabaseService } from "./addSupabaseService";

// Run all seed functions
async function runSeeds() {
  console.log("Starting database seeding...");
  
  try {
    // Add Supabase service
    await addSupabaseService();
    
    console.log("All seeds completed successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
    throw error;
  }
}

// Export for use in other files
export { runSeeds };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeeds()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}