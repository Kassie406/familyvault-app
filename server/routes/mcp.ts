import { Router } from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema 
} from "@modelcontextprotocol/sdk/types.js";
import { storage } from "../storage";
import { db } from "../db";
import { eq, desc, and, like } from "drizzle-orm";
import { inboxItems, extractedFields, familyMembers } from "@shared/schema";
import { requireAuth, AuthenticatedRequest } from "../auth";

const router = Router();

// MCP Server instance
let mcpServer: Server | null = null;

// Initialize MCP Server with tools for FamilyVault
function initializeMCPServer() {
  if (mcpServer) return mcpServer;

  mcpServer = new Server(
    {
      name: "familyvault-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Tool: Get Upload Center Status
  mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "get_upload_center_status",
          description: "Get current status of uploaded files and AI analysis progress",
          inputSchema: {
            type: "object",
            properties: {
              limit: {
                type: "number",
                description: "Maximum number of items to return (default: 10)",
                default: 10
              }
            }
          }
        },
        {
          name: "analyze_document",
          description: "Trigger AI analysis for a specific document in the inbox",
          inputSchema: {
            type: "object",
            properties: {
              itemId: {
                type: "string",
                description: "ID of the inbox item to analyze"
              }
            },
            required: ["itemId"]
          }
        },
        {
          name: "get_extracted_data",
          description: "Get extracted data fields from analyzed documents",
          inputSchema: {
            type: "object",
            properties: {
              itemId: {
                type: "string",
                description: "ID of the inbox item to get extracted data for"
              }
            },
            required: ["itemId"]
          }
        },
        {
          name: "search_family_documents",
          description: "Search through family documents and extracted data",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query to find documents"
              },
              category: {
                type: "string",
                description: "Optional category filter (e.g., 'medical', 'legal', 'financial')"
              }
            },
            required: ["query"]
          }
        },
        {
          name: "get_family_members",
          description: "Get list of family members",
          inputSchema: {
            type: "object",
            properties: {}
          }
        },
        {
          name: "add_family_member",
          description: "Add a new family member",
          inputSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Family member's name"
              },
              email: {
                type: "string",
                description: "Family member's email"
              },
              role: {
                type: "string",
                description: "Family member's role (e.g., 'parent', 'child', 'spouse')"
              }
            },
            required: ["name", "role"]
          }
        }
      ]
    };
  });

  // Tool implementations with user context
  mcpServer.setRequestHandler(CallToolRequestSchema, async (request: any, context?: { user: any }) => {
    const { name, arguments: args } = request.params;
    const user = context?.user;

    try {
      switch (name) {
        case "get_upload_center_status": {
          if (!user?.orgId) {
            throw new Error("Authentication required");
          }
          
          const limit = args?.limit || 10;
          
          // Get recent inbox items with their analysis status (scoped to user's org)
          const items = await db
            .select()
            .from(inboxItems)
            .where(eq(inboxItems.familyId, user.orgId))
            .orderBy(desc(inboxItems.uploadedAt))
            .limit(limit);

          const itemsWithAnalysis = await Promise.all(
            items.map(async (item) => {
              const extractedData = await db
                .select()
                .from(extractedFields)
                .where(eq(extractedFields.inboxItemId, item.id));

              return {
                id: item.id,
                fileName: item.fileName,
                fileType: item.fileType,
                uploadedAt: item.uploadedAt,
                status: item.status,
                extractedFieldsCount: extractedData.length,
                hasAnalysis: extractedData.length > 0
              };
            })
          );

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  totalItems: items.length,
                  items: itemsWithAnalysis,
                  summary: {
                    pending: items.filter(i => i.status === 'pending').length,
                    processing: items.filter(i => i.status === 'processing').length,
                    completed: items.filter(i => i.status === 'completed').length,
                    failed: items.filter(i => i.status === 'failed').length
                  }
                }, null, 2)
              }
            ]
          };
        }

        case "analyze_document": {
          if (!user?.orgId) {
            throw new Error("Authentication required");
          }
          
          const itemId = args?.itemId;
          if (!itemId) {
            throw new Error("itemId is required");
          }

          // Get the inbox item (scoped to user's org)
          const item = await db
            .select()
            .from(inboxItems)
            .where(and(
              eq(inboxItems.id, itemId),
              eq(inboxItems.familyId, user.orgId)
            ))
            .limit(1);

          if (item.length === 0) {
            throw new Error("Document not found");
          }

          // Trigger AI analysis (this would call your existing analyze endpoint)
          const response = await fetch(`http://localhost:5000/api/ai-inbox/analyze`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId })
          });

          if (!response.ok) {
            throw new Error(`Analysis failed: ${response.statusText}`);
          }

          const result = await response.json();

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  itemId,
                  fileName: item[0].fileName,
                  analysis: result
                }, null, 2)
              }
            ]
          };
        }

        case "get_extracted_data": {
          if (!user?.orgId) {
            throw new Error("Authentication required");
          }
          
          const itemId = args?.itemId;
          if (!itemId) {
            throw new Error("itemId is required");
          }

          // Get the inbox item details first (scoped to user's org)
          const item = await db
            .select()
            .from(inboxItems)
            .where(and(
              eq(inboxItems.id, itemId),
              eq(inboxItems.familyId, user.orgId)
            ))
            .limit(1);
            
          if (item.length === 0) {
            throw new Error("Document not found or access denied");
          }

          // Get extracted fields for the item
          const extractedData = await db
            .select()
            .from(extractedFields)
            .where(eq(extractedFields.inboxItemId, itemId));

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  itemId,
                  fileName: item[0]?.fileName || "Unknown",
                  extractedFields: extractedData.map(field => ({
                    key: field.fieldKey,
                    value: field.fieldValue,
                    confidence: field.confidence,
                    isPii: field.isPii
                  })),
                  totalFields: extractedData.length
                }, null, 2)
              }
            ]
          };
        }

        case "search_family_documents": {
          if (!user?.orgId) {
            throw new Error("Authentication required");
          }
          
          const query = args?.query;
          const category = args?.category;

          if (!query) {
            throw new Error("query is required");
          }

          // Build search conditions properly to avoid undefined in and()
          const searchConditions = [
            eq(inboxItems.familyId, user.orgId),
            like(inboxItems.fileName, `%${query}%`)
          ];
          
          if (category) {
            searchConditions.push(eq(inboxItems.category, category));
          }

          // Search in inbox items
          let searchResults = await db
            .select({
              id: inboxItems.id,
              fileName: inboxItems.fileName,
              fileType: inboxItems.fileType,
              uploadedAt: inboxItems.uploadedAt,
              status: inboxItems.status,
              category: inboxItems.category
            })
            .from(inboxItems)
            .where(and(...searchConditions))
            .limit(20);

          // Also search in extracted field values (with org scoping via join)
          const fieldResults = await db
            .select({
              itemId: extractedFields.inboxItemId,
              fieldKey: extractedFields.fieldKey,
              fieldValue: extractedFields.fieldValue
            })
            .from(extractedFields)
            .innerJoin(inboxItems, eq(extractedFields.inboxItemId, inboxItems.id))
            .where(and(
              eq(inboxItems.familyId, user.orgId),
              like(extractedFields.fieldValue, `%${query}%`)
            ))
            .limit(20);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  query,
                  category,
                  documentMatches: searchResults,
                  fieldMatches: fieldResults,
                  totalResults: searchResults.length + fieldResults.length
                }, null, 2)
              }
            ]
          };
        }

        case "get_family_members": {
          if (!user?.orgId) {
            throw new Error("Authentication required");
          }
          
          const members = await db
            .select()
            .from(familyMembers)
            .where(eq(familyMembers.familyId, user.orgId));

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  familyMembers: members.map(member => ({
                    id: member.id,
                    name: member.name,
                    email: member.email,
                    role: member.role,
                    createdAt: member.createdAt
                  })),
                  totalMembers: members.length
                }, null, 2)
              }
            ]
          };
        }

        case "add_family_member": {
          if (!user?.orgId) {
            throw new Error("Authentication required");
          }
          
          const { name, email, role } = args || {};

          if (!name || !role) {
            throw new Error("name and role are required");
          }

          const memberData = {
            familyId: user.orgId, // Use authenticated user's org
            name,
            email: email || null,
            role,
            userId: null,
            relationshipToFamily: role,
            phoneNumber: null,
            dateOfBirth: null,
            emergencyContact: false
          };

          const newMember = await storage.createFamilyMember(memberData);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  member: {
                    id: newMember.id,
                    name: newMember.name,
                    email: newMember.email,
                    role: newMember.role
                  }
                }, null, 2)
              }
            ]
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : "Unknown error",
              tool: name,
              args
            }, null, 2)
          } as TextContent
        ],
        isError: true
      };
    }
  });

  return mcpServer;
}

// HTTP endpoint for MCP (Server-Sent Events transport) - SECURED
router.all("/", requireAuth(), async (req: AuthenticatedRequest, res) => {
  try {
    const server = initializeMCPServer();
    
    if (req.method === "GET") {
      // Handle SSE connection
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      });

      res.write("data: {\"type\":\"connection\",\"status\":\"connected\"}\n\n");

      // Keep connection alive
      const heartbeat = setInterval(() => {
        res.write("data: {\"type\":\"heartbeat\"}\n\n");
      }, 30000);

      req.on("close", () => {
        clearInterval(heartbeat);
      });

      return;
    }

    if (req.method === "POST") {
      // Handle MCP messages
      const message = req.body;
      
      // Process the MCP request through the server with user context
      const response = await server.request(message, { user: req.user });
      
      res.json(response);
      return;
    }

    // Handle OPTIONS for CORS
    if (req.method === "OPTIONS") {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      });
      res.end();
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("MCP endpoint error:", error);
    res.status(500).json({ 
      error: "MCP server error", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

// Health check for MCP server
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    server: "familyvault-mcp",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    tools: [
      "get_upload_center_status",
      "analyze_document", 
      "get_extracted_data",
      "search_family_documents",
      "get_family_members",
      "add_family_member"
    ]
  });
});

export default router;