// Phase 2: GPT-Based Function Calling (Intent Parser)
// OpenAI function schemas for intelligent MCP function calling

export const mcpFunctionSchema = [
  // === FAMILY & PROJECT MANAGEMENT ===
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

  // === FILE OPERATIONS ===
  {
    name: "fs_read_file",
    description: "Reads the contents of a file",
    parameters: {
      type: "object",
      properties: {
        file_path: { type: "string", description: "Path to the file to read" },
        offset: { type: "number", description: "Line number to start reading from (1-indexed)" },
        limit: { type: "number", description: "Number of lines to read (default: all)" },
      },
      required: ["file_path"],
    },
  },
  {
    name: "fs_write_file",
    description: "Writes content to a file (overwrites existing content)",
    parameters: {
      type: "object",
      properties: {
        file_path: { type: "string", description: "Path to the file to write" },
        content: { type: "string", description: "Content to write to the file" },
      },
      required: ["file_path", "content"],
    },
  },
  {
    name: "fs_edit_file",
    description: "Edits a file by replacing specific text",
    parameters: {
      type: "object",
      properties: {
        file_path: { type: "string", description: "Path to the file to edit" },
        old_string: { type: "string", description: "Text to replace" },
        new_string: { type: "string", description: "New text to replace with" },
        replace_all: { type: "boolean", description: "Replace all occurrences (default: false)" },
      },
      required: ["file_path", "old_string", "new_string"],
    },
  },
  {
    name: "fs_ls",
    description: "Lists files and directories",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Directory path to list (default: current)" },
        recursive: { type: "boolean", description: "List recursively (default: true)" },
        max_files: { type: "number", description: "Maximum files to list (default: 1000)" },
      },
    },
  },
  {
    name: "fs_glob",
    description: "Finds files matching a pattern",
    parameters: {
      type: "object",
      properties: {
        pattern: { type: "string", description: "Glob pattern (e.g., '**/*.ts', 'src/**/*.tsx')" },
        path: { type: "string", description: "Base directory to search (default: current)" },
      },
      required: ["pattern"],
    },
  },
  {
    name: "fs_grep",
    description: "Searches for text patterns in files",
    parameters: {
      type: "object",
      properties: {
        pattern: { type: "string", description: "Regular expression pattern to search for" },
        path: { type: "string", description: "File or directory to search in" },
        glob: { type: "string", description: "Glob pattern to filter files (e.g., '*.js')" },
        output_mode: {
          type: "string",
          enum: ["content", "files_with_matches", "count"],
          description: "Output format (default: files_with_matches)",
        },
        case_insensitive: { type: "boolean", description: "Case insensitive search" },
      },
      required: ["pattern"],
    },
  },

  // === CODE ANALYSIS ===
  {
    name: "code_search",
    description: "Searches the codebase for specific patterns or functionality",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Natural language description of what to find" },
        search_paths: { 
          type: "array", 
          items: { type: "string" },
          description: "Specific paths to search in (optional)" 
        },
      },
      required: ["query"],
    },
  },
  {
    name: "code_analyze",
    description: "Analyzes code quality, architecture, and provides recommendations",
    parameters: {
      type: "object",
      properties: {
        task: { type: "string", description: "Analysis task description" },
        relevant_files: {
          type: "array",
          items: { type: "string" },
          description: "Files to analyze",
        },
        responsibility: {
          type: "string",
          enum: ["debug", "plan", "evaluate_task"],
          description: "Type of analysis to perform",
        },
      },
      required: ["task"],
    },
  },

  // === BASH & WORKFLOW OPERATIONS ===
  {
    name: "bash_exec",
    description: "Executes bash commands (with security restrictions)",
    parameters: {
      type: "object",
      properties: {
        command: { type: "string", description: "Bash command to execute" },
        description: { type: "string", description: "Brief description of what the command does" },
        timeout: { type: "number", description: "Timeout in milliseconds (max: 600000)" },
      },
      required: ["command", "description"],
    },
  },
  {
    name: "workflow_start",
    description: "Starts or restarts a workflow",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Name of the workflow to start" },
        workflow_timeout: { type: "number", description: "Timeout in seconds (default: 30)" },
      },
      required: ["name"],
    },
  },
  {
    name: "workflow_status",
    description: "Gets the status of running workflows",
    parameters: {
      type: "object",
      properties: {
        workflow_name: { type: "string", description: "Specific workflow to check (optional)" },
      },
    },
  },

  // === PACKAGE MANAGEMENT ===
  {
    name: "pkg_install",
    description: "Installs packages or dependencies",
    parameters: {
      type: "object",
      properties: {
        dependency_list: {
          type: "array",
          items: { type: "string" },
          description: "List of packages to install",
        },
        install_or_uninstall: {
          type: "string",
          enum: ["install", "uninstall"],
          description: "Whether to install or uninstall",
        },
        language_or_system: {
          type: "string",
          enum: ["nodejs", "python", "system"],
          description: "Package manager type",
        },
      },
      required: ["dependency_list", "install_or_uninstall", "language_or_system"],
    },
  },

  // === GIT OPERATIONS ===
  {
    name: "git_status",
    description: "Shows git repository status",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Repository path (default: current)" },
      },
    },
  },
  {
    name: "git_diff",
    description: "Shows git differences",
    parameters: {
      type: "object",
      properties: {
        staged: { type: "boolean", description: "Show staged changes only" },
        file_path: { type: "string", description: "Specific file to diff" },
      },
    },
  },

  // === DATABASE OPERATIONS ===
  {
    name: "db_query",
    description: "Executes SQL queries on the development database",
    parameters: {
      type: "object",
      properties: {
        sql_query: { type: "string", description: "SQL query to execute" },
        environment: {
          type: "string",
          enum: ["development"],
          description: "Database environment (only development allowed)",
        },
      },
      required: ["sql_query"],
    },
  },
  {
    name: "db_status",
    description: "Checks database connection and status",
    parameters: {
      type: "object",
      properties: {},
    },
  },

  // === ENVIRONMENT MANAGEMENT ===
  {
    name: "env_check_secrets",
    description: "Checks if environment variables/secrets exist (without exposing values)",
    parameters: {
      type: "object",
      properties: {
        secret_keys: {
          type: "array",
          items: { type: "string" },
          description: "List of secret keys to check",
        },
      },
      required: ["secret_keys"],
    },
  },

  // === DEBUGGING & DIAGNOSTICS ===
  {
    name: "get_logs",
    description: "Retrieves application logs for debugging",
    parameters: {
      type: "object",
      properties: {
        workflow_name: { type: "string", description: "Specific workflow to get logs for" },
        include_browser_logs: { type: "boolean", description: "Include browser console logs" },
      },
    },
  },
  {
    name: "get_diagnostics",
    description: "Gets LSP diagnostics for code issues",
    parameters: {
      type: "object",
      properties: {
        file_path: { type: "string", description: "Specific file to check (optional)" },
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