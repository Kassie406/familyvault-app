import express from 'express';
import axios from 'axios';
import OpenAI from 'openai';
import { mcpFunctionSchema, validateFunctionCall } from '../../utils/mcpFunctions';

const router = express.Router();

// Production-ready configuration validation
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required for AI agent functionality');
}
if (!process.env.MCP_SERVER_URL) {
  throw new Error('MCP_SERVER_URL environment variable is required for AI agent functionality');
}

const MCP_SERVER = process.env.MCP_SERVER_URL;

// Initialize OpenAI client for intelligent function calling
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('[AI AGENT] GPT-4 function calling initialized with MCP server:', MCP_SERVER);

// Enhanced conversation memory system
interface ChatMessage {
  id: string;
  timestamp: Date;
  role: 'user' | 'assistant';
  content: string;
  method?: string;
  context?: any;
  metadata?: any;
  gptReasoning?: string;  // GPT's reasoning for function selection
  functionCall?: {        // Detailed function call info
    name: string;
    parameters: any;
    success: boolean;
    executionTime?: number;
    mcpExecutionTime?: number;  // Time spent on MCP call specifically
  };
}

interface ConversationSession {
  sessionId: string;
  messages: ChatMessage[];
  summary?: string;
  lastActivity: Date;
  totalMessages: number;
}

// In-memory conversation store (replace with Redis/DB for production)
const conversationMemory: Record<string, ConversationSession> = {};
const MAX_MESSAGES_PER_SESSION = 50;
const SUMMARIZE_THRESHOLD = 20;

// Generate unique message ID
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create conversation session
function getOrCreateSession(sessionId: string): ConversationSession {
  if (!conversationMemory[sessionId]) {
    conversationMemory[sessionId] = {
      sessionId,
      messages: [],
      lastActivity: new Date(),
      totalMessages: 0
    };
  }
  return conversationMemory[sessionId];
}

// Add message to conversation
function addMessage(sessionId: string, messageData: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
  const session = getOrCreateSession(sessionId);
  const message: ChatMessage = {
    id: generateMessageId(),
    timestamp: new Date(),
    ...messageData
  };
  
  session.messages.push(message);
  session.lastActivity = new Date();
  session.totalMessages += 1;
  
  // Trim old messages if over limit
  if (session.messages.length > MAX_MESSAGES_PER_SESSION) {
    session.messages = session.messages.slice(-MAX_MESSAGES_PER_SESSION);
  }
  
  return message;
}

// Generate conversation summary with enhanced context
function generateConversationSummary(messages: ChatMessage[]): string {
  if (messages.length === 0) return '';
  
  const recentMessages = messages.slice(-10);
  const topics: string[] = [];
  const functionCalls: string[] = [];
  
  recentMessages.forEach(msg => {
    if (msg.method) {
      const success = msg.functionCall?.success ? '✅' : '❌';
      functionCalls.push(`${success} ${msg.method}`);
    }
    if (msg.gptReasoning) {
      topics.push(msg.gptReasoning.slice(0, 50));
    }
    if (msg.content && msg.role === 'user') {
      topics.push(msg.content.slice(0, 100));
    }
  });
  
  let summary = `Conversation with ${messages.length} messages. `;
  if (topics.length > 0) {
    summary += `Topics: ${[...new Set(topics)].join(', ').slice(0, 200)}. `;
  }
  if (functionCalls.length > 0) {
    summary += `Functions: ${functionCalls.join(', ')}.`;
  }
  
  return summary;
}

// Enhanced GPT-4 function calling with conversation context
async function parseUserIntentWithGPT(prompt: string, session: ConversationSession) {
  try {
    // Build conversation context
    const conversationSummary = session.summary || generateConversationSummary(session.messages);
    const recentMessages = session.messages.slice(-5);
    const contextStr = recentMessages.map(m => `${m.role}: ${m.content.slice(0, 100)}`).join('\n');
    
    const systemPrompt = `You are Manus, an AI assistant for the FamilyVault app. Parse user requests and call the appropriate function.

Conversation Context:
${conversationSummary}

Recent Messages:
${contextStr}

Available functions: ${mcpFunctionSchema.map(f => f.name).join(', ')}

Choose the most appropriate function for: "${prompt}"`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      functions: mcpFunctionSchema,
      function_call: 'auto',
      temperature: 0.3
    });

    const message = completion.choices[0]?.message;
    
    if (message?.function_call) {
      const functionName = message.function_call.name || 'track_project_progress';
      let functionParams = {};
      
      try {
        functionParams = JSON.parse(message.function_call.arguments || '{}');
      } catch (parseError) {
        console.warn('[GPT Parse Error]', parseError);
        functionParams = {};
      }
      
      // Validate function call
      const validation = validateFunctionCall(functionName, functionParams);
      if (!validation.valid) {
        console.warn('[Function Validation Failed]', validation.errors);
        // Fallback with error context
        return {
          method: 'track_project_progress',
          params: {
            project: 'FamilyVault AI',
            context: `GPT function validation failed: ${validation.errors?.join(', ')}. Original request: ${prompt}`
          }
        };
      }
      
      return {
        method: functionName,
        params: functionParams,
        reasoning: message.content || 'GPT function call'
      };
    }
    
    // No function call made, use fallback
    return {
      method: 'track_project_progress',
      params: {
        project: 'FamilyVault AI',
        context: `No clear function match. Original request: ${prompt}. Conversation summary: ${conversationSummary}`
      },
      reasoning: 'No function match found'
    };
    
  } catch (error) {
    console.error('[GPT Function Calling Error]', error);
    
    // Enhanced fallback with error context
    return {
      method: 'track_project_progress',
      params: {
        project: 'FamilyVault AI',
        context: `GPT parsing failed (${error instanceof Error ? error.message : 'unknown error'}). Original request: ${prompt}`
      },
      reasoning: 'GPT error fallback'
    };
  }
}

// Get conversation history endpoint (SECURITY ENHANCED)
router.get('/conversation', (req, res) => {
  // CRITICAL: Require proper session - no anonymous fallback in production
  if (!req.sessionID) {
    return res.status(401).json({ error: 'Session required for conversation access' });
  }
  const sessionId = req.sessionID;
  const session = conversationMemory[sessionId];
  
  if (!session) {
    return res.json({ messages: [], summary: '', totalMessages: 0 });
  }
  
  // Always generate fresh summary (fix stale summarization)
  const freshSummary = generateConversationSummary(session.messages);
  
  return res.json({
    messages: session.messages,
    summary: freshSummary,
    totalMessages: session.totalMessages,
    lastActivity: session.lastActivity
  });
});

// Enhanced ask endpoint with memory (SECURITY ENHANCED)
router.post('/ask', async (req, res) => {
  const { prompt } = req.body; // Remove sessionId from client input
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  // CRITICAL: Require proper session - no anonymous fallback in production
  if (!req.sessionID) {
    return res.status(401).json({ error: 'Session required for AI agent access' });
  }
  const sessionId = req.sessionID;
  const session = getOrCreateSession(sessionId);
  
  // Track execution timing
  const executionStart = Date.now();
  
  // Add user message to conversation
  const userMessage = addMessage(sessionId, {
    role: 'user',
    content: prompt
  });
  
  const { method, params, reasoning } = await parseUserIntentWithGPT(prompt, session);
  
  try {
    const mcpCallStart = Date.now();
    const mcpRes = await axios.post(MCP_SERVER, {
      method,
      params,
    });
    const mcpExecutionTime = Date.now() - mcpCallStart;
    
    // Format enhanced response
    const responseContent = `✅ **${method}** executed successfully\n\n📝 **Your Request:** ${prompt}\n\n🔧 **Action Taken:** ${method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\n📊 **Result:**\n\`\`\`json\n${JSON.stringify(mcpRes.data, null, 2)}\n\`\`\``;
    
    // Add assistant response with enhanced tracking
    const totalExecutionTime = Date.now() - executionStart;
    const assistantMessage = addMessage(sessionId, {
      role: 'assistant',
      content: responseContent,
      method,
      context: params,
      gptReasoning: reasoning,
      functionCall: {
        name: method,
        parameters: params,
        success: true,
        executionTime: totalExecutionTime,
        mcpExecutionTime
      },
      metadata: {
        mcpResponse: mcpRes.data,
        processingTime: Date.now(),
        gptModel: 'gpt-4'
      }
    });
    
    // Update session summary dynamically (fix stale summarization)
    if (session.messages.length > SUMMARIZE_THRESHOLD) {
      session.summary = generateConversationSummary(session.messages);
    }
    
    // Return conversation data to eliminate extra round trip (UX optimization)
    const conversationData = {
      messages: session.messages,
      summary: session.summary || generateConversationSummary(session.messages),
      totalMessages: session.totalMessages,
      lastActivity: session.lastActivity
    };
    
    return res.json({ 
      response: responseContent,
      messageId: assistantMessage.id,
      sessionId,
      conversationLength: session.messages.length,
      conversation: conversationData // Include full conversation data
    });
  } catch (err: any) {
    console.error('[MCP_ERROR]', err.message);
    
    // Add error response with function call tracking
    const totalExecutionTime = Date.now() - executionStart;
    const errorMessage = addMessage(sessionId, {
      role: 'assistant',
      content: `❌ **Error:** Failed to execute ${method}\n\n**Details:** ${err.message}\n\n**Suggestion:** Please try rephrasing your request or contact support if the issue persists.`,
      method,
      gptReasoning: reasoning,
      functionCall: {
        name: method,
        parameters: params,
        success: false,
        executionTime: totalExecutionTime
      },
      metadata: {
        error: err.message,
        timestamp: Date.now(),
        gptModel: 'gpt-4',
        errorType: err.code || 'MCP_ERROR'
      }
    });
    
    // Return conversation data even for errors (UX consistency)
    const conversationData = {
      messages: session.messages,
      summary: session.summary || generateConversationSummary(session.messages),
      totalMessages: session.totalMessages,
      lastActivity: session.lastActivity
    };
    
    return res.status(500).json({
      error: err.message || 'MCP request failed',
      messageId: errorMessage.id,
      sessionId,
      conversationLength: session.messages.length,
      conversation: conversationData
    });
  }
});

// Get available capabilities endpoint
router.get('/capabilities', (req, res) => {
  try {
    // Group capabilities by category for better UX
    const capabilities = {
      version: "1.0.0",
      total_functions: mcpFunctionSchema.length,
      categories: {
        "Family & Project Management": mcpFunctionSchema
          .filter(f => ["add_family_member", "manage_design_tasks", "audit_design_system", "track_project_progress", "get_family_members", "analyze_ui_component"].includes(f.name))
          .map(f => ({ name: f.name, description: f.description })),
        
        "File Operations": mcpFunctionSchema
          .filter(f => f.name.startsWith("fs_"))
          .map(f => ({ name: f.name, description: f.description })),
        
        "Code Analysis": mcpFunctionSchema
          .filter(f => f.name.startsWith("code_"))
          .map(f => ({ name: f.name, description: f.description })),
        
        "Bash & Workflows": mcpFunctionSchema
          .filter(f => f.name.startsWith("bash_") || f.name.startsWith("workflow_"))
          .map(f => ({ name: f.name, description: f.description })),
        
        "Package Management": mcpFunctionSchema
          .filter(f => f.name.startsWith("pkg_"))
          .map(f => ({ name: f.name, description: f.description })),
        
        "Git Operations": mcpFunctionSchema
          .filter(f => f.name.startsWith("git_"))
          .map(f => ({ name: f.name, description: f.description })),
        
        "Database Operations": mcpFunctionSchema
          .filter(f => f.name.startsWith("db_"))
          .map(f => ({ name: f.name, description: f.description })),
        
        "Environment Management": mcpFunctionSchema
          .filter(f => f.name.startsWith("env_"))
          .map(f => ({ name: f.name, description: f.description })),
        
        "Debugging & Diagnostics": mcpFunctionSchema
          .filter(f => f.name.startsWith("get_"))
          .map(f => ({ name: f.name, description: f.description }))
      },
      all_functions: mcpFunctionSchema.map(f => ({ 
        name: f.name, 
        description: f.description,
        parameters: f.parameters 
      }))
    };
    
    return res.json(capabilities);
  } catch (error) {
    console.error('[CAPABILITIES ERROR]', error);
    return res.status(500).json({ error: 'Failed to retrieve capabilities' });
  }
});

// Clear conversation endpoint (SECURITY ENHANCED)
router.delete('/conversation', (req, res) => {
  // CRITICAL: Require proper session - no anonymous fallback
  if (!req.sessionID) {
    return res.status(401).json({ error: 'Session required to clear conversation' });
  }
  const sessionId = req.sessionID;
  delete conversationMemory[sessionId];
  return res.json({ message: 'Conversation cleared', sessionId });
});

export default router;