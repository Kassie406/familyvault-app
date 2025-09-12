// ✅ useManusAgent.ts
// Enhanced hook with context-aware chat memory

import { useState, useCallback, useEffect, useRef } from 'react';
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

interface UseManusAgentOptions {
  autoload?: boolean;
}

export function useManusAgent(options: UseManusAgentOptions = {}) {
  const { autoload = false } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationData>({
    messages: [],
    totalMessages: 0
  });
  const loadedRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3; // Prevent infinite loops
  // No client-side sessionId - server manages this securely

  // Load conversation history (using secure endpoint)
  const loadConversation = useCallback(async () => {
    if (loadedRef.current) return; // Prevent duplicate calls in StrictMode
    loadedRef.current = true;
    
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
        retryCountRef.current = 0; // Reset retry count on success
      }
    } catch (err) {
      if (err.response?.status === 429 && retryCountRef.current < maxRetries) {
        // Rate limited, wait with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000);
        retryCountRef.current += 1;
        setTimeout(() => {
          loadedRef.current = false;
          loadConversation();
        }, delay);
        return;
      }
      console.warn('[ManusAgent] Failed to load conversation history:', err);
      // Reset retry count on other errors or max retries reached
      retryCountRef.current = 0;
    }
  }, []);

  // Manually refresh conversation
  const refreshConversation = useCallback(() => {
    loadedRef.current = false;
    loadConversation();
  }, [loadConversation]);

  // Load conversation on mount only if autoload is enabled
  useEffect(() => {
    if (autoload) {
      loadConversation();
    }
  }, [autoload, loadConversation]);

  const askManus = async (prompt: string, files?: File[]): Promise<string> => {
    if (isLoading) return 'Already processing...'; // Prevent parallel calls
    
    setIsLoading(true);
    try {
      let requestData: any = { prompt };
      
      // If files are provided, create FormData for multipart upload
      if (files && files.length > 0) {
        const formData = new FormData();
        formData.append('prompt', prompt);
        files.forEach((file, index) => {
          formData.append(`file_${index}`, file);
        });
        requestData = formData;
      }
      
      const res = await axios.post('/api/ai-agent/ask', requestData, {
        headers: files && files.length > 0 ? { 'Content-Type': 'multipart/form-data' } : {}
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
      if (err.response?.status === 429) {
        // Rate limited, wait and retry once
        await new Promise(resolve => setTimeout(resolve, 3000));
        return '⚠️ Rate limited. Please try again in a moment.';
      }
      
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