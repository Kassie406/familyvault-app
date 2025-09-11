/**
 * Manus.im API Client for Replit Integration
 * Note: Requires API key from manus.im (currently in beta)
 */

class ManusClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.manus.im';
    this.headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey // Adjust based on their auth method
    };
  }

  /**
   * Execute a task using Manus AI agent
   */
  async executeTask(options) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/execute`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          goal: options.goal,
          inputs: options.inputs || [],
          mode: options.mode || 'multimodal',
          constraints: options.constraints || {},
          tools: options.tools || []
        })
      });

      if (!response.ok) {
        throw new Error(`Manus API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Manus execution error:', error);
      throw error;
    }
  }

  /**
   * Get task status (for long-running tasks)
   */
  async getTaskStatus(taskId) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/tasks/${taskId}`, {
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`Failed to get task status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Status check error:', error);
      throw error;
    }
  }

  /**
   * Stream real-time results via WebSocket
   */
  streamTask(options, onMessage, onError) {
    const wsUrl = `wss://ws.manus.im/v1/stream?token=${this.apiKey}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        action: 'execute',
        ...options
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        onError(error);
      }
    };

    ws.onerror = onError;
    
    return ws; // Return for manual close if needed
  }
}

export default ManusClient;