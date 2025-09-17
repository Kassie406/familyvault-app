import { Router } from "express";
import { db } from "../db";
import { apiServices, apiCredentials } from "../../shared/schema";
import { encryptSecret, decryptSecret, maskSecret } from "../lib/crypto";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// Middleware to check admin access (simplified for now)
function adminOnly(req: any, res: any, next: any) {
  // TODO: Implement proper admin role checking
  // For now, allow all requests (replace with your auth logic)
  next();
}

// Validation schemas
const createServiceSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional(),
  baseUrl: z.string().url().optional(),
  status: z.enum(["active", "inactive", "deprecated"]).default("active"),
  variables: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

const createCredentialSchema = z.object({
  serviceId: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["api_key", "secret", "token", "username", "password"]),
  secret: z.string().min(1),
});

// List all API services
router.get("/api/api-services", adminOnly, async (req, res) => {
  try {
    const services = await db.select().from(apiServices).orderBy(apiServices.name);
    
    const result = services.map(service => ({
      ...service,
      variables: service.variables ? JSON.parse(service.variables) : [],
    }));
    
    res.json({ items: result });
  } catch (error) {
    console.error("Error fetching API services:", error);
    res.status(500).json({ error: "Failed to fetch API services" });
  }
});

// Create new API service
router.post("/api/api-services", adminOnly, async (req, res) => {
  try {
    const data = createServiceSchema.parse(req.body);
    
    const [service] = await db
      .insert(apiServices)
      .values({
        ...data,
        variables: JSON.stringify(data.variables),
      })
      .returning();
    
    res.json({
      ...service,
      variables: JSON.parse(service.variables || "[]"),
    });
  } catch (error) {
    console.error("Error creating API service:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.errors });
    } else {
      res.status(500).json({ error: "Failed to create API service" });
    }
  }
});

// Update API service
router.put("/api/api-services/:id", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const data = createServiceSchema.parse(req.body);
    
    await db
      .update(apiServices)
      .set({
        ...data,
        variables: JSON.stringify(data.variables),
        updatedAt: new Date(),
      })
      .where(eq(apiServices.id, id));
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating API service:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.errors });
    } else {
      res.status(500).json({ error: "Failed to update API service" });
    }
  }
});

// Delete API service
router.delete("/api/api-services/:id", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    
    // First delete all credentials for this service
    await db.delete(apiCredentials).where(eq(apiCredentials.serviceId, id));
    
    // Then delete the service
    await db.delete(apiServices).where(eq(apiServices.id, id));
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting API service:", error);
    res.status(500).json({ error: "Failed to delete API service" });
  }
});

// List credentials for a service (masked)
router.get("/api/api-credentials", adminOnly, async (req, res) => {
  try {
    const { serviceId } = req.query as { serviceId: string };
    
    if (!serviceId) {
      return res.status(400).json({ error: "serviceId is required" });
    }
    
    const credentials = await db
      .select()
      .from(apiCredentials)
      .where(eq(apiCredentials.serviceId, serviceId))
      .orderBy(apiCredentials.label);
    
    const result = credentials.map(cred => ({
      id: cred.id,
      serviceId: cred.serviceId,
      label: cred.label,
      type: cred.type,
      masked: cred.masked,
      lastUsedAt: cred.lastUsedAt,
      createdAt: cred.createdAt,
      updatedAt: cred.updatedAt,
    }));
    
    res.json({ items: result });
  } catch (error) {
    console.error("Error fetching credentials:", error);
    res.status(500).json({ error: "Failed to fetch credentials" });
  }
});

// Create new credential
router.post("/api/api-credentials", adminOnly, async (req, res) => {
  try {
    const data = createCredentialSchema.parse(req.body);
    
    const encrypted = encryptSecret(data.secret);
    const masked = maskSecret(data.secret);
    
    const [credential] = await db
      .insert(apiCredentials)
      .values({
        serviceId: data.serviceId,
        label: data.label,
        type: data.type,
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        tag: encrypted.tag,
        masked,
      })
      .returning();
    
    res.json({ id: credential.id, success: true });
  } catch (error) {
    console.error("Error creating credential:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.errors });
    } else {
      res.status(500).json({ error: "Failed to create credential" });
    }
  }
});

// Update credential (rotate secret)
router.put("/api/api-credentials/:id", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { secret } = req.body;
    
    if (!secret || typeof secret !== "string") {
      return res.status(400).json({ error: "secret is required" });
    }
    
    const encrypted = encryptSecret(secret);
    const masked = maskSecret(secret);
    
    await db
      .update(apiCredentials)
      .set({
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        tag: encrypted.tag,
        masked,
        updatedAt: new Date(),
      })
      .where(eq(apiCredentials.id, id));
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating credential:", error);
    res.status(500).json({ error: "Failed to update credential" });
  }
});

// Reveal credential (for copying)
router.post("/api/api-credentials/:id/reveal", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [credential] = await db
      .select()
      .from(apiCredentials)
      .where(eq(apiCredentials.id, id));
    
    if (!credential) {
      return res.status(404).json({ error: "Credential not found" });
    }
    
    const plaintext = decryptSecret({
      ciphertext: credential.ciphertext,
      iv: credential.iv,
      tag: credential.tag,
    });
    
    // TODO: Log access for audit trail
    // TODO: Update lastUsedAt timestamp
    
    res.json({ plaintext });
  } catch (error) {
    console.error("Error revealing credential:", error);
    res.status(500).json({ error: "Failed to reveal credential" });
  }
});

// Delete credential
router.delete("/api/api-credentials/:id", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.delete(apiCredentials).where(eq(apiCredentials.id, id));
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting credential:", error);
    res.status(500).json({ error: "Failed to delete credential" });
  }
});

export default router;