// ✅ useManusAgent.ts
// Enhanced hook with context-aware chat memory

import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

interface ChatMessage {
  id: string;
  timestamp: Date;
  role: 'user' | 'assistant';
  content: string;
  method?: string;
  context?: any;
  metadata?: any;
}

interface ConversationData {
  messages: ChatMessage[];
  summary?: string;
  totalMessages: number;
  lastActivity?: Date;
}

export function useManusAgent(sessionId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationData>({
    messages: [],
    totalMessages: 0
  });
  const [currentSessionId, setCurrentSessionId] = useState<string>(
    sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  // Load conversation history on mount
  const loadConversation = useCallback(async () => {
    try {
      const res = await axios.get(`/api/ai-agent/conversation/${currentSessionId}`);
      if (res.data) {
        const conversationData = {
          ...res.data,
          messages: res.data.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        };
        setConversation(conversationData);
      }
    } catch (err) {
      console.warn('[ManusAgent] Failed to load conversation history:', err);
    }
  }, [currentSessionId]);

  // Load conversation on mount and when sessionId changes
  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  const askManus = async (prompt: string): Promise<string> => {
    setIsLoading(true);
    try {
      const res = await axios.post('/api/ai-agent/ask', {
        prompt,
        sessionId: currentSessionId
      });
      
      // Refresh conversation after new message
      await loadConversation();
      
      return res.data?.response || 'No response received.';
    } catch (err: any) {
      console.error('[ManusAgent Error]', err);
      return '⚠️ Failed to reach Manus backend.';
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = async (): Promise<void> => {
    try {
      await axios.delete(`/api/ai-agent/conversation/${currentSessionId}`);
      setConversation({ messages: [], totalMessages: 0 });
    } catch (err) {
      console.error('[ManusAgent] Failed to clear conversation:', err);
    }
  };

  const getConversationSummary = (): string => {
    return conversation.summary || 
      `${conversation.totalMessages} messages in this conversation`;
  };

  return { 
    askManus, 
    isLoading, 
    conversation,
    clearConversation,
    sessionId: currentSessionId,
    refreshConversation: loadConversation,
    conversationSummary: getConversationSummary()
  };
}