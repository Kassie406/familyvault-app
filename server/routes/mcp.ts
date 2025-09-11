import { Router } from "express";
import { storage } from "../storage";
import { db } from "../db";
import { eq, desc, and, like } from "drizzle-orm";
import { inboxItems, extractedFields, familyMembers } from "@shared/schema";

const router = Router();

// Available tools definition
const AVAILABLE_TOOLS = [
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
];

// Tool implementation functions
async function executeTool(toolName: string, args: any = {}) {
  // Default family for demo purposes (no auth needed for this simple version)
  const familyId = "family-1";

  try {
    switch (toolName) {
      case "get_upload_center_status": {
        const limit = args.limit || 10;
        
        // Get recent inbox items with their analysis status
        const items = await db
          .select()
          .from(inboxItems)
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
          success: true,
          data: {
            totalItems: items.length,
            items: itemsWithAnalysis,
            summary: {
              pending: items.filter(i => i.status === 'pending').length,
              processing: items.filter(i => i.status === 'processing').length,
              completed: items.filter(i => i.status === 'completed').length,
              failed: items.filter(i => i.status === 'failed').length
            }
          }
        };
      }

      case "analyze_document": {
        const itemId = args.itemId;
        if (!itemId) {
          throw new Error("itemId is required");
        }

        // Get the inbox item
        const item = await db
          .select()
          .from(inboxItems)
          .where(eq(inboxItems.id, itemId))
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
          success: true,
          data: {
            itemId,
            fileName: item[0].fileName,
            analysis: result
          }
        };
      }

      case "get_extracted_data": {
        const itemId = args.itemId;
        if (!itemId) {
          throw new Error("itemId is required");
        }

        // Get extracted fields for the item
        const extractedData = await db
          .select()
          .from(extractedFields)
          .where(eq(extractedFields.inboxItemId, itemId));

        // Get the inbox item details
        const item = await db
          .select()
          .from(inboxItems)
          .where(eq(inboxItems.id, itemId))
          .limit(1);

        return {
          success: true,
          data: {
            itemId,
            fileName: item[0]?.fileName || "Unknown",
            extractedFields: extractedData.map(field => ({
              key: field.fieldKey,
              value: field.fieldValue,
              confidence: field.confidence,
              isPii: field.isPii
            })),
            totalFields: extractedData.length
          }
        };
      }

      case "search_family_documents": {
        const query = args.query;
        const category = args.category;

        if (!query) {
          throw new Error("query is required");
        }

        // Build search conditions
        const searchConditions = [like(inboxItems.fileName, `%${query}%`)];
        if (category) {
          searchConditions.push(eq(inboxItems.category, category));
        }

        // Search in inbox items
        const searchResults = await db
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

        // Also search in extracted field values
        const fieldResults = await db
          .select({
            itemId: extractedFields.inboxItemId,
            fieldKey: extractedFields.fieldKey,
            fieldValue: extractedFields.fieldValue
          })
          .from(extractedFields)
          .where(like(extractedFields.fieldValue, `%${query}%`))
          .limit(20);

        return {
          success: true,
          data: {
            query,
            category,
            documentMatches: searchResults,
            fieldMatches: fieldResults,
            totalResults: searchResults.length + fieldResults.length
          }
        };
      }

      case "get_family_members": {
        const members = await storage.getAllFamilyMembers();

        return {
          success: true,
          data: {
            familyMembers: members.map(member => ({
              id: member.id,
              name: member.name,
              email: member.email,
              role: member.role,
              createdAt: member.createdAt
            })),
            totalMembers: members.length
          }
        };
      }

      case "add_family_member": {
        const { name, email, role } = args;

        if (!name || !role) {
          throw new Error("name and role are required");
        }

        const memberData = {
          familyId,
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
          success: true,
          data: {
            member: {
              id: newMember.id,
              name: newMember.name,
              email: newMember.email,
              role: newMember.role
            }
          }
        };
      }

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      tool: toolName,
      args
    };
  }
}

// MCP-compatible JSON-RPC endpoints
router.post("/", async (req, res) => {
  try {
    const { method, params } = req.body;

    if (method === "tools/list") {
      res.json({
        tools: AVAILABLE_TOOLS
      });
      return;
    }

    if (method === "tools/call") {
      const { name, arguments: args } = params;
      const result = await executeTool(name, args);
      res.json(result);
      return;
    }

    res.status(400).json({ 
      error: "Unknown method", 
      method,
      supportedMethods: ["tools/list", "tools/call"]
    });
  } catch (error) {
    console.error("MCP endpoint error:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

// Simple GET endpoint for tools list
router.get("/tools", async (req, res) => {
  res.json({
    tools: AVAILABLE_TOOLS
  });
});

// Individual tool endpoints for easy testing
router.post("/tools/:toolName", async (req, res) => {
  try {
    const { toolName } = req.params;
    const args = req.body;
    
    const result = await executeTool(toolName, args);
    res.json(result);
  } catch (error) {
    console.error(`Tool ${req.params.toolName} error:`, error);
    res.status(500).json({ 
      error: "Tool execution failed", 
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
    tools: AVAILABLE_TOOLS.map(tool => tool.name),
    endpoints: {
      "POST /": "JSON-RPC endpoint (methods: tools/list, tools/call)",
      "GET /tools": "List all available tools",
      "POST /tools/:toolName": "Execute specific tool",
      "GET /health": "Health check"
    }
  });
});

export default router;