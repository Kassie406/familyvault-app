import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Additional API routes can be added here
  // Authentication routes are already set up in server/index.ts

  const httpServer = createServer(app);

  return httpServer;
}
