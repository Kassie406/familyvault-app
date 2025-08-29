import { useEffect, useRef } from 'react';
import { useToasts } from './toast-host';

interface Component {
  component: string;
  ok: boolean;
  latency_ms?: number | null;
  avg_latency_ms?: number | null;
  ts?: string;
}

interface StatusResponse {
  components: Component[];
}

const STORAGE_KEY = 'fcs-status-last-state';
const POLL_INTERVAL = 30000; // 30 seconds

export default function StatusWatcher() {
  const { push } = useToasts();
  const isInitialized = useRef(false);

  const checkStatusChanges = async () => {
    try {
      const response = await fetch('/api/admin/status/summary', { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.warn('Failed to fetch status summary for monitoring');
        return;
      }
      
      const data: StatusResponse = await response.json();
      
      // Get previous state from localStorage
      const previousStateJson = localStorage.getItem(STORAGE_KEY);
      const previousState: Record<string, boolean> = previousStateJson ? 
        JSON.parse(previousStateJson) : {};
      
      // Build current state and check for changes
      const currentState: Record<string, boolean> = {};
      
      data.components.forEach(component => {
        const { component: name, ok } = component;
        currentState[name] = ok;
        
        // Skip notifications on first run (initialization)
        if (!isInitialized.current) return;
        
        // Check if state changed
        const previousOk = previousState[name];
        if (previousOk !== undefined && previousOk !== ok) {
          if (ok) {
            // Component recovered
            push({
              kind: 'success',
              title: `${name.toUpperCase()} Recovered`,
              body: `System component is back online and operational.`
            });
          } else {
            // Component failed
            push({
              kind: 'error',
              title: `${name.toUpperCase()} Failure`,
              body: `System component is experiencing issues and needs attention.`
            });
          }
        }
      });
      
      // Save current state
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
      
      // Mark as initialized after first successful check
      if (!isInitialized.current) {
        isInitialized.current = true;
      }
      
    } catch (error) {
      console.error('Error checking status changes:', error);
    }
  };

  const initializeState = async () => {
    try {
      const response = await fetch('/api/admin/status/summary', { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) return;
      
      const data: StatusResponse = await response.json();
      const initialState: Record<string, boolean> = {};
      
      data.components.forEach(component => {
        initialState[component.component] = component.ok;
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    } catch (error) {
      console.error('Error initializing status state:', error);
    }
  };

  useEffect(() => {
    // Initialize state without triggering notifications
    initializeState();
    
    // Start polling for changes
    const interval = setInterval(checkStatusChanges, POLL_INTERVAL);
    
    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [push]);

  // This component doesn't render anything, it just monitors in the background
  return null;
}