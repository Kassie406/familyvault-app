// Unstickable UI patterns - ensures UI never gets stuck in loading states
// Based on production-tested patterns for robust frontend behavior

export type JobStatus = "queued" | "running" | "completed" | "failed";

/**
 * Safe JSON parsing with content-type validation
 * Prevents silent failures when server returns HTML error pages
 */
export async function safeJson(res: Response) {
  if (res.status === 204) return null;
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const text = await res.text();
    throw new Error(`Expected JSON, got: ${ct}. Body: ${text.slice(0, 200)}`);
  }
  return res.json();
}

/**
 * Fetch with timeout and abort controller
 * Prevents requests from hanging indefinitely
 */
export async function fetchWithTimeout(input: RequestInfo, init: RequestInit = {}, ms = 20000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(input, { ...init, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(t);
  }
}

/**
 * Polling with exponential backoff and terminal states
 * Prevents infinite polling and escalates gracefully
 */
export async function waitForAnalysis(jobId: string, opts = { maxMs: 120000 }) {
  const start = Date.now();
  let delay = 800;

  while (true) {
    if (Date.now() - start > opts.maxMs) {
      throw new Error("Timeout waiting for analysis");
    }

    const res = await fetchWithTimeout(`/api/inbox/${jobId}`, {}, 15000);
    if (!res.ok) {
      throw new Error(`Status ${res.status}: ${res.statusText}`);
    }
    
    const data = await safeJson(res);

    if (!data || !data.status) {
      throw new Error("Malformed status payload");
    }
    
    if (data.status === "completed") return data.suggestions;
    if (data.status === "failed") {
      throw new Error(data.error || "Analysis failed");
    }

    await new Promise(r => setTimeout(r, delay));
    delay = Math.min(delay * 1.6, 4000); // Exponential backoff with cap
  }
}

/**
 * Enhanced polling with progress updates and heartbeat detection
 * Detects stuck states and provides detailed progress feedback
 */
export async function pollWithHeartbeat(
  jobId: string, 
  onProgress?: (step: string, progress?: number) => void,
  opts = { maxMs: 120000, maxSilenceMs: 30000 }
) {
  const start = Date.now();
  let lastHeartbeat = Date.now();
  let delay = 800;
  let lastStatus = '';

  while (true) {
    const now = Date.now();
    
    // Check overall timeout
    if (now - start > opts.maxMs) {
      throw new Error(`Timeout waiting for analysis after ${Math.floor(opts.maxMs / 1000)}s`);
    }

    // Check heartbeat timeout (no status changes)
    if (now - lastHeartbeat > opts.maxSilenceMs) {
      throw new Error(`No heartbeat from analysis in ${Math.floor((now - lastHeartbeat) / 1000)}s (likely network/CORS)`);
    }

    try {
      const res = await fetchWithTimeout(`/api/inbox/${jobId}`, {}, 15000);
      if (!res.ok) {
        if (res.status === 415) {
          throw new Error("File type unsupported (415). Try PDF/JPG.");
        }
        throw new Error(`Status ${res.status}: ${res.statusText}`);
      }
      
      const data = await safeJson(res);

      if (!data || !data.status) {
        throw new Error("Malformed status payload");
      }

      // Update heartbeat if status changed
      if (data.status !== lastStatus) {
        lastHeartbeat = now;
        lastStatus = data.status;
      }

      // Provide progress feedback
      if (onProgress) {
        const step = getStepLabel(data.status, data.stage);
        onProgress(step, data.progress);
      }
      
      if (data.status === "completed") return data.suggestions;
      if (data.status === "failed") {
        const errorMsg = data.error || data.message || "Analysis failed";
        throw new Error(errorMsg);
      }

    } catch (error) {
      // Don't retry on known terminal errors
      if (error instanceof Error) {
        if (error.message.includes('415') || 
            error.message.includes('Timeout') ||
            error.message.includes('heartbeat')) {
          throw error;
        }
      }
      // For network errors, continue polling but don't update heartbeat
    }

    await new Promise(r => setTimeout(r, delay));
    delay = Math.min(delay * 1.6, 4000);
  }
}

/**
 * Convert backend status to user-friendly step labels
 */
function getStepLabel(status: string, stage?: string): string {
  switch (status) {
    case 'queued':
      return 'Queued for processing...';
    case 'running':
      if (stage === 'upload') return 'Uploading document (1/3)';
      if (stage === 'analyze') return 'Analyzing with AI (2/3)';
      if (stage === 'extract') return 'Extracting fields (3/3)';
      return 'Processing document...';
    case 'completed':
      return 'Analysis complete!';
    case 'failed':
      return 'Analysis failed';
    default:
      return 'Processing...';
  }
}

/**
 * Robust API request wrapper with retry logic
 * Handles common failure modes with exponential backoff
 */
export async function robustApiRequest(
  url: string, 
  options: RequestInit = {},
  retries = 2
): Promise<any> {
  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, options, 20000);
      
      if (!res.ok) {
        const isRetryable = res.status >= 500 || res.status === 429;
        if (!isRetryable || attempt === retries) {
          const error = await safeJson(res).catch(() => ({ error: res.statusText }));
          throw new Error(error.error || `HTTP ${res.status}`);
        }
      } else {
        return await safeJson(res);
      }
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors or timeouts
      if (error instanceof Error && 
          (error.name === 'AbortError' || 
           error.message.includes('400') || 
           error.message.includes('401') || 
           error.message.includes('403'))) {
        throw error;
      }

      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  throw lastError!;
}