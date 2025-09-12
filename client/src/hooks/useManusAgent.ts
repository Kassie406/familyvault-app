// ✅ useManusAgent.ts
// Hook to talk to Manus AI from your React dashboard

import { useState } from 'react';
import axios from 'axios';

export function useManusAgent() {
  const [isLoading, setIsLoading] = useState(false);

  const askManus = async (prompt: string): Promise<string> => {
    setIsLoading(true);
    try {
      const res = await axios.post('/api/ai-agent/ask', {
        prompt
      });
      return res.data?.response || 'No response received.';
    } catch (err: any) {
      console.error('[ManusAgent Error]', err);
      return '⚠️ Failed to reach Manus backend.';
    } finally {
      setIsLoading(false);
    }
  };

  return { askManus, isLoading };
}