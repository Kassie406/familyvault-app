// useAiSuggestions.ts
import { useState, useCallback, useRef } from "react";
import { EventSourcePolyfill } from 'event-source-polyfill';

// =========================
// Types
// =========================

type AiState =
  | { kind: "idle" }
  | { kind: "analyzing"; step: string }
  | { kind: "success"; suggestions: any }
  | { kind: "error"; message: string }
  | { kind: "timeout"; message: string };

interface RunParams {
  file: File;
  familyId: string;
}

interface UseAiSuggestionsOptions {
  apiBase?: string;
  totalTimeoutMs?: number;
  sseHeartbeatMs?: number;
  logs?: boolean;
  pollCfg?: {
    start: number;
    max: number;
    factor: number;
  };
}

// =========================
// Hook
// =========================

export function useAiSuggestions(options: UseAiSuggestionsOptions = {}) {
  const {
    apiBase = "/api",
    totalTimeoutMs = 90_000,
    sseHeartbeatMs = 5_000,
    logs = false,
    pollCfg = { start: 500, max: 8000, factor: 1.5 }
  } = options;

  const [state, setState] = useState<AiState>({ kind: "idle" });
  const cancelRef = useRef<(() => void) | null>(null);

  const log = useCallback((...args: any[]) => {
    if (logs) console.log("[useAiSuggestions]", ...args);
  }, [logs]);

  const cancel = useCallback(() => {
    log("Canceling...");
    if (cancelRef.current) {
      cancelRef.current();
    }
    setState({ kind: "idle" });
  }, [log]);

  // SSE + Polling fallback
  const streamOrPoll = useCallback(async (
    apiBase: string,
    jobId: string,
    heartbeatMs: number,
    pollConfig: { start: number; max: number; factor: number },
    totalMs: number
  ): Promise<{ status: "completed" | "failed"; suggestions?: any; error?: string }> => {
    return new Promise((resolve, reject) => {
      let resolved = false;
      let sseSource: EventSource | null = null;
      let pollTimer: NodeJS.Timeout | null = null;
      let heartbeatTimer: NodeJS.Timeout | null = null;
      let delay = pollConfig.start;

      const cleanup = () => {
        if (sseSource) {
          sseSource.close();
          sseSource = null;
        }
        if (pollTimer) {
          clearTimeout(pollTimer);
          pollTimer = null;
        }
        if (heartbeatTimer) {
          clearTimeout(heartbeatTimer);
          heartbeatTimer = null;
        }
      };

      const finish = (result: any) => {
        if (resolved) return;
        resolved = true;
        cleanup();
        resolve(result);
      };

      const fail = (error: any) => {
        if (resolved) return;
        resolved = true;
        cleanup();
        reject(error);
      };

      // Global timeout
      const globalTimer = setTimeout(() => {
        fail(new Error(`Analysis timeout after ${totalMs}ms`));
      }, totalMs);

      cancelRef.current = () => {
        clearTimeout(globalTimer);
        fail(new Error("Cancelled by user"));
      };

      // Try SSE first
      const trySSE = () => {
        log("Trying SSE...");
        const url = `${apiBase}/inbox/${jobId}/stream`;
        sseSource = new EventSourcePolyfill(url, {
          withCredentials: true,        // send cookies
          headers: { /* add token headers if needed */ }
        });

        let lastHeartbeat = Date.now();
        heartbeatTimer = setInterval(() => {
          if (Date.now() - lastHeartbeat > heartbeatMs) {
            log("SSE heartbeat timeout, falling back to polling");
            cleanup();
            startPolling();
          }
        }, heartbeatMs);

        sseSource.onmessage = (event) => {
          lastHeartbeat = Date.now();
          try {
            const data = JSON.parse(event.data);
            log("SSE data:", data);
            
            if (data.type === "progress") {
              setState({ kind: "analyzing", step: data.message });
            } else if (data.type === "complete") {
              finish({ status: "completed", suggestions: data.suggestions });
            } else if (data.type === "error") {
              finish({ status: "failed", error: data.message });
            }
          } catch (e) {
            log("SSE parse error:", e);
          }
        };

        sseSource.onerror = () => {
          log("SSE error, falling back to polling");
          cleanup();
          startPolling();
        };
      };

      // Polling fallback
      const startPolling = () => {
        const poll = async () => {
          try {
            const response = await fetch(`${apiBase}/inbox/${jobId}/status`, {
              credentials: 'include'
            });
            
            if (!response.ok) {
              if (response.status === 404) {
                // 404 race condition retry
                log("404 during polling, retrying...");
                delay = Math.min(delay * pollConfig.factor, pollConfig.max);
                pollTimer = setTimeout(poll, delay);
                return;
              }
              throw new Error(`Status ${response.status}`);
            }

            const data = await response.json();
            log("Poll data:", data);

            if (data.status === "completed" || data.status === "suggested") {
              // Handle both payload formats: SSE uses 'suggestions', polling uses 'result'
              const suggestions = data.suggestions ?? data.result;
              finish({ status: "completed", suggestions });
            } else if (data.status === "failed") {
              finish({ status: "failed", error: data.error });
            } else if (data.status === "analyzing") {
              setState({ kind: "analyzing", step: data.step || "Processing..." });
              delay = Math.min(delay * pollConfig.factor, pollConfig.max);
              pollTimer = setTimeout(poll, delay);
            }
          } catch (e) {
            log("Poll error:", e);
            delay = Math.min(delay * pollConfig.factor, pollConfig.max);
            pollTimer = setTimeout(poll, delay);
          }
        };

        poll();
      };

      // Start with SSE
      trySSE();
    });
  }, [log]);

  const run = useCallback(
    async ({ file, familyId }: RunParams) => {
      if (state.kind !== "idle") {
        log("Already running, ignoring");
        return;
      }

      log("Starting AI analysis for:", file.name);
      setState({ kind: "analyzing", step: "Preparing upload..." });

      const guardTimer = setTimeout(() => {
        setState({ kind: "error", message: "Analysis startup timeout" });
      }, totalTimeoutMs);

      try {
        // Step 1: Get presigned URL for S3 upload
        log("Step 1: Getting presigned URL");
        const presignResponse = await fetch(`${apiBase}/storage/presign`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            type: 'document',
            fileName: file.name,
            contentType: file.type,
            contentLength: file.size,
            familyId: familyId || 'family-1'
          })
        });

        if (!presignResponse.ok) {
          throw new Error(`Presign failed: ${presignResponse.status}`);
        }

        const { uploadUrl, key: s3Key } = await presignResponse.json();
        log("Got presigned URL and S3 key:", s3Key);

        // Step 2: Upload file to S3
        setState({ kind: "analyzing", step: "Uploading file..." });
        log("Step 2: Uploading to S3");
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file
        });

        if (!uploadResponse.ok) {
          throw new Error(`S3 upload failed: ${uploadResponse.status}`);
        }

        // Step 3: Register with AI inbox
        log("Step 3: Registering with AI inbox");
        const registerResponse = await fetch(`${apiBase}/inbox/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            userId: 'current-user',
            fileKey: s3Key, // Use real S3 key, not hardcoded path
            fileName: file.name,
            mime: file.type,
            size: file.size
          })
        });

        if (!registerResponse.ok) {
          throw new Error(`Register failed: ${registerResponse.status}`);
        }

        const { uploadId: jobId } = await registerResponse.json();
        log("Got jobId:", jobId);

        // Step 4: Start analysis
        setState({ kind: "analyzing", step: "Starting analysis..." });
        log("Step 4: Starting analysis");
        
        const analyzeResponse = await fetch(`${apiBase}/inbox/${jobId}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            userId: 'current-user',
            fileName: file.name
          })
        });

        if (!analyzeResponse.ok) {
          if (analyzeResponse.status === 404) {
            // 404 race retry after brief delay
            log("404 race condition, retrying analysis...");
            await new Promise(resolve => setTimeout(resolve, 1000));
            const retryResponse = await fetch(`${apiBase}/inbox/${jobId}/analyze`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                userId: 'current-user',
                fileName: file.name,
                retryAttempt: 2
              })
            });
            if (!retryResponse.ok) {
              throw new Error(`Analyze retry failed: ${retryResponse.status}`);
            }
          } else {
            throw new Error(`Analyze failed: ${analyzeResponse.status}`);
          }
        }

        // Only now show analyzing state
        setState({ kind: "analyzing", step: "Looking for key fields (1/3)" });

        const result = await streamOrPoll(apiBase, jobId, sseHeartbeatMs, pollCfg, totalTimeoutMs);
        if (result.status === "completed") {
          setState({ kind: "success", suggestions: result.suggestions });
        } else if (result.status === "failed") {
          setState({ kind: "error", message: result.error || "Analysis failed" });
        }
      } catch (e: any) {
        const msg = String(e?.message || e);
        // Map known backend codes to human help
        if (msg.includes("legacy_key_unusable") || msg.includes("410")) {
          setState({
            kind: "error",
            message: "This document was saved with an old path and can't be analyzed. Please re-upload it."
          });
          return;
        }
        if (msg.includes("Timeout")) {
          setState({ kind: "timeout", message: msg });
          return;
        }
        setState({ kind: "error", message: msg });
      } finally {
        clearTimeout(guardTimer);
        cancelRef.current = null;
      }
    },
    [apiBase, pollCfg.max, pollCfg.start, sseHeartbeatMs, totalTimeoutMs, cancel, state.kind, log, streamOrPoll]
  );

  const retry = useCallback(() => {
    // Consumer can call run() again with same params they track externally
    setState({ kind: "idle" });
  }, []);

  return { state, run, retry, cancel } as const;
}