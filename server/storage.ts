// server/storage.ts

import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

// Create a single Prisma client instance
export const prisma = new PrismaClient();

// Export storage as an alias to prisma for backward compatibility
export const storage = prisma;

// Basic MemStorage class for backward compatibility
export class MemStorage {
  private data = new Map<string, any>();

  set(key: string, value: any): void {
    this.data.set(key, value);
  }

  get(key: string): any {
    return this.data.get(key);
  }

  has(key: string): boolean {
    return this.data.has(key);
  }

  delete(key: string): boolean {
    return this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }

  keys(): IterableIterator<string> {
    return this.data.keys();
  }

  values(): IterableIterator<any> {
    return this.data.values();
  }

  entries(): IterableIterator<[string, any]> {
    return this.data.entries();
  }
}

// Test the connection immediately (optional, for debugging)
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully.");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();
