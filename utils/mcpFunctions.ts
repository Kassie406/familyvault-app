// Phase 2: GPT-Based Function Calling (Intent Parser)
// OpenAI function schemas for intelligent MCP function calling

export const mcpFunctionSchema = [
  {
    name: "add_family_member",
    description: "Adds a family member to the system",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Full name of the family member" },
        role: {
          type: "string",
          enum: ["admin", "guardian", "viewer", "member"],
          description: "Role assigned to the member",
        },
      },
      required: ["name", "role"],
    },
  },
  {
    name: "manage_design_tasks",
    description: "Creates or assigns a design task",
    parameters: {
      type: "object",
      properties: {
        project: { type: "string" },
        task: { type: "string" },
        priority: { type: "string", enum: ["Low", "Medium", "High"] },
        assigned_to: { type: "string" },
      },
      required: ["task"],
    },
  },
  {
    name: "audit_design_system",
    description: "Runs a UI design system audit",
    parameters: {
      type: "object",
      properties: {
        scope: { type: "string", default: "full" },
        note: { type: "string" },
      },
    },
  },
  {
    name: "track_project_progress",
    description: "Tracks and monitors project progress and status",
    parameters: {
      type: "object",
      properties: {
        project: { type: "string", description: "Project name to track" },
        context: { type: "string", description: "Additional context about the progress request" },
      },
    },
  },
  {
    name: "get_family_members",
    description: "Retrieves list of family members and their information",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "analyze_ui_component",
    description: "Analyzes UI components for design consistency and accessibility",
    parameters: {
      type: "object",
      properties: {
        component: { type: "string", description: "Component name or path to analyze" },
        focus: { type: "string", description: "Specific aspect to focus on (design, accessibility, UX)" },
      },
    },
  },
];

// Helper function to get function schema by name
export function getFunctionSchema(name: string) {
  return mcpFunctionSchema.find(func => func.name === name);
}

// Helper function to validate function parameters
export function validateFunctionCall(name: string, parameters: any): { valid: boolean; errors?: string[] } {
  const schema = getFunctionSchema(name);
  if (!schema) {
    return { valid: false, errors: [`Function ${name} not found in schema`] };
  }

  const errors: string[] = [];
  const { required = [], properties = {} } = schema.parameters;

  // Check required parameters
  for (const requiredParam of required) {
    if (!parameters.hasOwnProperty(requiredParam)) {
      errors.push(`Missing required parameter: ${requiredParam}`);
    }
  }

  // Check enum values
  for (const [key, value] of Object.entries(parameters)) {
    const propSchema = (properties as any)[key];
    if (propSchema?.enum && !propSchema.enum.includes(value)) {
      errors.push(`Invalid value for ${key}: ${value}. Must be one of: ${propSchema.enum.join(', ')}`);
    }
  }

  return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
}