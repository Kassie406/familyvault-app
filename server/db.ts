import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// In development mode without DATABASE_URL, use mock/in-memory storage
let pool: Pool | null = null;
let db: any = null;

if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEV] No DATABASE_URL found, running in mock mode');
    // Create a mock db object for development
    pool = null;
    db = null;
  } else {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { pool, db };

// Re-export schema tables to ensure consistent object references
export { inboxItems, extractedFields, familyMembers } from "@shared/schema";
