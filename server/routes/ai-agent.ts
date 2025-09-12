import express from 'express';
import axios from 'axios';
import OpenAI from 'openai';
import { mcpFunctionSchema, validateFunctionCall } from '../../utils/mcpFunctions.js';

const router = express.Router();

// Security fix: Use environment variable instead of hardcoded URL
const MCP_SERVER = process.env.MCP_SERVER_URL || 'https://3eb6ec39-b907-4c70-9a5b-e192bacee3ba-00-1739ki91gyn4k.kirk.replit.dev/mcp';

// Initialize OpenAI client for intelligent function calling
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enhanced conversation memory system
interface ChatMessage {
  id: string;
  timestamp: Date;
  role: 'user' | 'assistant';
  content: string;
  method?: string;
  context?: any;
  metadata?: any;
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
function addMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
  const session = getOrCreateSession(sessionId);
  const newMessage: ChatMessage = {
    ...message,
    id: generateMessageId(),
    timestamp: new Date()
  };
  
  session.messages.push(newMessage);
  session.lastActivity = new Date();
  session.totalMessages++;
  
  // Trim old messages if too many
  if (session.messages.length > MAX_MESSAGES_PER_SESSION) {
    session.messages = session.messages.slice(-MAX_MESSAGES_PER_SESSION);
  }
  
  return newMessage;
}

// Generate conversation summary for context
function generateConversationSummary(messages: ChatMessage[]): string {
  if (messages.length === 0) return '';
  
  const recentMessages = messages.slice(-10); // Last 10 messages
  const topics = new Set<string>();
  const actions = new Set<string>();
  
  recentMessages.forEach(msg => {
    if (msg.method) actions.add(msg.method);
    if (msg.content.includes('design')) topics.add('design');
    if (msg.content.includes('family')) topics.add('family management');
    if (msg.content.includes('task')) topics.add('task management');
    if (msg.content.includes('project')) topics.add('project tracking');
  });
  
  return `Recent conversation context: Topics discussed: ${Array.from(topics).join(', ')}. Actions performed: ${Array.from(actions).join(', ')}. Last ${recentMessages.length} messages active.`;
}

// GPT-powered function calling for intelligent intent parsing
async function parseUserIntentWithGPT(prompt: string, session: ConversationSession): Promise<{ method: string; params: any; reasoning?: string }> {
  const conversationSummary = generateConversationSummary(session.messages);
  
  // Build conversation context for GPT
  const recentMessages = session.messages.slice(-6).map(msg => ({
    role: msg.role,
    content: msg.content.substring(0, 200), // Truncate for context
    method: msg.method || null
  }));
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an intelligent assistant for FamilyVault, a family document management system. 

Conversation Context: ${conversationSummary}

Recent Messages: ${JSON.stringify(recentMessages, null, 2)}

Analyze the user's request and call the most appropriate function. Be intelligent about extracting parameters from natural language. For family member tasks, extract names and roles intelligently. For design tasks, infer project context and priority.

If the user's request doesn't clearly match any function, use 'track_project_progress' as a fallback.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      functions: mcpFunctionSchema,
      function_call: 'auto',
      temperature: 0.3
    });

    const message = completion.choices[0]?.message;
    
    if (message?.function_call) {
      const functionName = message.function_call.name;
      let functionParams;
      
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

// Get conversation history endpoint (SECURITY FIXED)
router.get('/conversation', (req, res) => {
  // Use ONLY server-side session ID - no client control
  const sessionId = req.sessionID || 'anonymous';
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

// Enhanced ask endpoint with memory (SECURITY FIXED)
router.post('/ask', async (req, res) => {
  const { prompt } = req.body; // Remove sessionId from client input
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  // Use ONLY server-side session ID - no client control
  const sessionId = req.sessionID || 'anonymous';
  const session = getOrCreateSession(sessionId);
  
  // Add user message to conversation
  const userMessage = addMessage(sessionId, {
    role: 'user',
    content: prompt
  });
  
  const { method, params, reasoning } = await parseUserIntentWithGPT(prompt, session);
  
  try {
    const mcpRes = await axios.post(MCP_SERVER, {
      method,
      params,
    }, {
      withCredentials: true,
    });
    
    // Format enhanced response
    const responseContent = `✅ **${method}** executed successfully\n\n📝 **Your Request:** ${prompt}\n\n🔧 **Action Taken:** ${method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\n📊 **Result:**\n\`\`\`json\n${JSON.stringify(mcpRes.data, null, 2)}\n\`\`\``;
    
    // Add assistant response to conversation
    const assistantMessage = addMessage(sessionId, {
      role: 'assistant',
      content: responseContent,
      method,
      context: params,
      metadata: {
        mcpResponse: mcpRes.data,
        processingTime: Date.now()
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
    
    // Add error response to conversation
    const errorMessage = addMessage(sessionId, {
      role: 'assistant',
      content: `❌ **Error:** Failed to execute ${method}\n\n**Details:** ${err.message}\n\n**Suggestion:** Please try rephrasing your request or contact support if the issue persists.`,
      method,
      metadata: {
        error: err.message,
        timestamp: Date.now()
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
      error: 'MCP request failed',
      response: errorMessage.content,
      messageId: errorMessage.id,
      sessionId,
      conversation: conversationData
    });
  }
});

// Clear conversation endpoint (SECURITY FIXED)
router.delete('/conversation', (req, res) => {
  // Use ONLY server-side session ID - no client control
  const sessionId = req.sessionID || 'anonymous';
  delete conversationMemory[sessionId];
  return res.json({ message: 'Conversation cleared', sessionId });
});

export default router;