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

export function useManusAgent() {
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationData>({
    messages: [],
    totalMessages: 0
  });
  // No client-side sessionId - server manages this securely

  // Load conversation history on mount (using secure endpoint)
  const loadConversation = useCallback(async () => {
    try {
      const res = await axios.get('/api/ai-agent/conversation'); // No sessionId in URL
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
  }, []);

  // Load conversation on mount and when sessionId changes
  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  const askManus = async (prompt: string): Promise<string> => {
    setIsLoading(true);
    try {
      const res = await axios.post('/api/ai-agent/ask', {
        prompt // No sessionId - server manages this securely
      });
      
      // Use conversation data from response (UX optimization - no extra round trip)
      if (res.data?.conversation) {
        const conversationData = {
          ...res.data.conversation,
          messages: res.data.conversation.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        };
        setConversation(conversationData);
      }
      
      return res.data?.response || 'No response received.';
    } catch (err: any) {
      console.error('[ManusAgent Error]', err);
      
      // Even error responses might include conversation data
      if (err.response?.data?.conversation) {
        const conversationData = {
          ...err.response.data.conversation,
          messages: err.response.data.conversation.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        };
        setConversation(conversationData);
      }
      
      return '⚠️ Failed to reach Manus backend.';
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = async (): Promise<void> => {
    try {
      await axios.delete('/api/ai-agent/conversation'); // No sessionId in URL
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
    refreshConversation: loadConversation,
    conversationSummary: getConversationSummary()
    // No sessionId exposed - server manages this securely
  };
}