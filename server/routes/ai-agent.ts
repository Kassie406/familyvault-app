import express from 'express';
import axios from 'axios';

const router = express.Router();

// Security fix: Use environment variable instead of hardcoded URL
const MCP_SERVER = process.env.MCP_SERVER_URL || 'https://3eb6ec39-b907-4c70-9a5b-e192bacee3ba-00-1739ki91gyn4k.kirk.replit.dev/mcp';

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

// Enhanced prompt-to-intent mapping with context awareness
function inferIntentWithContext(prompt: string, session: ConversationSession): { method: string; params: any } {
  const lower = prompt.toLowerCase();
  const conversationSummary = generateConversationSummary(session.messages);
  
  // Context-aware intent inference
  const recentMethods = session.messages
    .filter(m => m.method)
    .slice(-5)
    .map(m => m.method);
  
  // Check for follow-up context
  const hasRecentTask = recentMethods.includes('manage_design_tasks');
  const hasRecentAudit = recentMethods.includes('audit_design_system');
  const hasRecentFamily = recentMethods.includes('add_family_member');
  
  if (lower.includes('task') || (hasRecentTask && (lower.includes('update') || lower.includes('status')))) {
    return {
      method: 'manage_design_tasks',
      params: {
        project: 'FamilyVault AI',
        task: prompt,
        priority: 'High',
        assigned_to: 'UI Team',
        context: conversationSummary
      },
    };
  }

  if (lower.includes('audit') || lower.includes('design system') || (hasRecentAudit && lower.includes('follow'))) {
    return {
      method: 'audit_design_system',
      params: {
        scope: 'full',
        note: prompt,
        context: conversationSummary
      },
    };
  }

  if (lower.includes('add') && lower.includes('member') || (hasRecentFamily && lower.includes('another'))) {
    return {
      method: 'add_family_member',
      params: {
        name: 'Sarah',
        role: 'guardian',
        context: conversationSummary
      },
    };
  }

  if (lower.includes('progress') || lower.includes('status') || lower.includes('track')) {
    return {
      method: 'track_project_progress',
      params: {
        project: 'FamilyVault AI',
        context: conversationSummary
      },
    };
  }

  // Default fallback with context
  return {
    method: 'track_project_progress',
    params: {
      project: 'FamilyVault AI',
      context: conversationSummary
    },
  };
}

// Get conversation history endpoint
router.get('/conversation/:sessionId?', (req, res) => {
  const sessionId = req.params.sessionId || req.sessionID || 'anonymous';
  const session = conversationMemory[sessionId];
  
  if (!session) {
    return res.json({ messages: [], summary: '', totalMessages: 0 });
  }
  
  return res.json({
    messages: session.messages,
    summary: session.summary || generateConversationSummary(session.messages),
    totalMessages: session.totalMessages,
    lastActivity: session.lastActivity
  });
});

// Enhanced ask endpoint with memory
router.post('/ask', async (req, res) => {
  const { prompt, sessionId: requestSessionId } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  // Use provided sessionId or fall back to express session or anonymous
  const sessionId = requestSessionId || req.sessionID || 'anonymous';
  const session = getOrCreateSession(sessionId);
  
  // Add user message to conversation
  const userMessage = addMessage(sessionId, {
    role: 'user',
    content: prompt
  });
  
  const { method, params } = inferIntentWithContext(prompt, session);
  
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
    
    // Update session summary if needed
    if (session.messages.length > SUMMARIZE_THRESHOLD && !session.summary) {
      session.summary = generateConversationSummary(session.messages);
    }
    
    return res.json({ 
      response: responseContent,
      messageId: assistantMessage.id,
      sessionId,
      conversationLength: session.messages.length
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
    
    return res.status(500).json({ 
      error: 'MCP request failed',
      response: errorMessage.content,
      messageId: errorMessage.id,
      sessionId
    });
  }
});

// Clear conversation endpoint
router.delete('/conversation/:sessionId?', (req, res) => {
  const sessionId = req.params.sessionId || req.sessionID || 'anonymous';
  delete conversationMemory[sessionId];
  return res.json({ message: 'Conversation cleared', sessionId });
});

export default router;