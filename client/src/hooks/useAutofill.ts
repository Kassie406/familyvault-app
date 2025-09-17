import { useState, useCallback, useEffect, useRef } from "react";
import bus from '@/lib/autofillBus';
import io, { Socket } from 'socket.io-client';

export type ExtractField = { key: string; value: string; confidence: number; pii?: boolean };
export type Suggestion = { memberId: string; memberName: string; confidence: number };

type BannerState = {
  open: boolean;
  fileName?: string;
  uploadId?: string;
  fields?: ExtractField[];
  suggestion?: Suggestion | null;
  error?: string | null;
};

export function useAutofill() {
  const [banner, setBanner] = useState<BannerState>({ open: false });
  const socketRef = useRef<Socket | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('/', { path: '/socket.io' });
    
    const socket = socketRef.current;
    socket.on('inbox:ready', (data: any) => {
      console.log('[AUTOFILL] Socket: inbox:ready', data);
      bus.emit('autofill:ready', data);
    });
    
    socket.on('inbox:failed', (data: any) => {
      console.log('[AUTOFILL] Socket: inbox:failed', data);
      bus.emit('autofill:failed', data);
    });
    
    return () => {
      socket.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const registerAndAnalyze = useCallback(async (args: {
    userId: string;
    fileKey: string;
    fileName: string;
    mime?: string;
    size?: number;
  }) => {
    let uploadId: string = '';
    let stopped = false;
    let stepProgressTimer: NodeJS.Timeout | null = null;
    
    try {
      // Check for unsupported file types before processing
      if (args.mime && !['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(args.mime)) {
        console.log('[AUTOFILL] Unsupported file type:', args.mime);
        setBanner({ open: true, fileName: args.fileName, error: 'Unsupported file type' });
        bus.emit('autofill:unsupported', {
          uploadId: 'temp-id',
          fileName: args.fileName,
          error: 'File type not supported'
        });
        return;
      }
      
      setBanner({ open: true, fileName: args.fileName });

      // 1) register
      const reg = await fetch("/api/inbox/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(args)
      }).then(r => r.json());

      uploadId = reg.uploadId;
      console.log('[AUTOFILL] Registered upload:', uploadId);
      
      // Emit started event (step 1)
      bus.emit('autofill:started', { uploadId, fileName: args.fileName });
      bus.emit('autofill:step', { uploadId, step: 1 });

      // 2) Start analysis with step progression
      stepProgressTimer = setTimeout(() => {
        if (!stopped) {
          bus.emit('autofill:step', { uploadId, step: 2 });
          
          setTimeout(() => {
            if (!stopped) {
              bus.emit('autofill:step', { uploadId, step: 3 });
            }
          }, 1500); // Step 3 after 1.5s more
        }
      }, 1000); // Step 2 after 1s
      
      fetch(`/api/inbox/${uploadId}/analyze`, { method: "POST" }).catch(e => {
        console.warn('[AUTOFILL] Analysis request failed:', e);
        if (stepProgressTimer) clearTimeout(stepProgressTimer);
      });
      
      // 3) Set up polling fallback with timeout
      let tries = 0;
      const pollStatus = async () => {
        if (stopped || tries++ > 10) return; // ~20s max
        
        try {
          const r = await fetch(`/api/inbox/${uploadId}/status`);
          if (!r.ok) throw new Error(`Status ${r.status}`);
          
          const status = await r.json();
          console.log('[AUTOFILL] Polling status:', status);
          
          if (status.status === 'ready' || status.status === 'suggested') {
            stopped = true;
            if (stepProgressTimer) clearTimeout(stepProgressTimer);
            const result = status.result || { fields: [], suggestion: null };
            
            // Check if we have any meaningful data
            if (!result.fields?.length && !result.suggestion) {
              // No details found - emit 'none' state
              setBanner({ open: true, fileName: args.fileName, uploadId, error: 'No readable text detected' });
              bus.emit('autofill:none', {
                uploadId,
                fileName: args.fileName,
                error: 'No readable text detected'
              });
              return;
            }
            
            setBanner({
              open: true,
              fileName: args.fileName,
              uploadId,
              fields: result.fields || [],
              suggestion: result.suggestion || null
            });
            
            bus.emit('autofill:ready', {
              uploadId,
              fileName: args.fileName,
              detailsCount: result.fields?.length || 0,
              fields: result.fields || [],
              suggestion: result.suggestion || null,
            });
            return;
          }
          
          if (status.status === 'failed') {
            stopped = true;
            if (stepProgressTimer) clearTimeout(stepProgressTimer);
            setBanner(b => ({ ...b, error: status.error || 'Analysis failed' }));
            bus.emit('autofill:failed', {
              uploadId,
              fileName: args.fileName,
              error: status.error || 'Analysis failed',
            });
            return;
          }
          
          // Still processing, poll again in 2s
          setTimeout(pollStatus, 2000);
        } catch (e: any) {
          console.warn('[AUTOFILL] Polling error:', e);
          if (tries <= 10) setTimeout(pollStatus, 2000);
        }
      };
      
      // Start polling after 1s delay
      setTimeout(pollStatus, 1000);
      
      // Set hard timeout - if nothing after 20s, show "working in background" message
      timeoutRef.current = setTimeout(() => {
        if (!stopped) {
          console.log('[AUTOFILL] Timeout reached, working in background');
          setBanner(b => ({ ...b, error: "We're still working in the background..." }));
        }
      }, 20000);

    } catch (e: any) {
      console.error('[AUTOFILL] Register failed:', e);
      if (stepProgressTimer) clearTimeout(stepProgressTimer);
      setBanner(b => ({ ...b, error: String(e?.message || e) }));
      bus.emit('autofill:failed', {
        uploadId: uploadId || 'unknown',
        fileName: args.fileName,
        error: e?.message || 'Failed to register upload',
      });
    }
  }, []);

  const accept = useCallback(async (memberId: string) => {
    if (!banner.uploadId) return;
    await fetch(`/api/inbox/${banner.uploadId}/accept`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ memberId })
    });
    setBanner(b => ({ ...b, open: false }));
  }, [banner.uploadId]);

  const dismiss = useCallback(async () => {
    if (!banner.uploadId) return setBanner(b => ({ ...b, open: false }));
    await fetch(`/api/inbox/${banner.uploadId}/dismiss`, { method: "POST" });
    setBanner(b => ({ ...b, open: false }));
  }, [banner.uploadId]);

  return { banner, registerAndAnalyze, accept, dismiss };
}

export default useAutofill;