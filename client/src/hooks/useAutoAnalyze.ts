import { useEffect } from "react";
import { useUploadStore } from "@/stores/uploadStore";

// Global auto-analysis hook that works regardless of page
export function useAutoAnalyze() {
  const { uploads, updateUpload } = useUploadStore();

  useEffect(() => {
    uploads.forEach(item => {
      if (item.status === "pending" && !item.analyzed) {
        // Set analyzing state immediately
        updateUpload(item.id, { status: "analyzing" as const, analyzed: true });
        
        // Start analysis
        analyzeDocument(item.file, "auto").then(result => {
          updateUpload(item.id, { 
            status: "complete" as const, 
            result,
            analyzed: true 
          });
        }).catch(err => {
          console.error("Analysis error:", err);
          updateUpload(item.id, { 
            status: "error" as const, 
            error: (err as Error).message,
            analyzed: true 
          });
        });
      }
    });
  }, [uploads, updateUpload]);
}

// Helper: file -> base64 (NO data: prefix)
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const result = r.result as string;
      resolve(result.split(",")[1]); // strip "data:...;base64,"
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });

async function analyzeDocument(file: File, mode: string = "auto") {
  // Get API URL from environment - this should be your AWS Lambda URL
  const BASE_API_URL = import.meta?.env?.VITE_API_URL;
  const API_URL = BASE_API_URL ? `${BASE_API_URL}/analyze` : null;
  
  console.log("[DEBUG] Environment check:", {
    VITE_API_URL: import.meta?.env?.VITE_API_URL,
    API_URL: API_URL,
    hasApiUrl: !!API_URL
  });
  
  if (!API_URL) {
    console.error('❌ VITE_API_URL not configured - please set this to your AWS Lambda URL');
    throw new Error("AWS Lambda URL not configured. Please set VITE_API_URL environment variable.");
  }

  // Map analysis modes to document types for Lambda
  const docTypeMap: Record<string, string> = {
    'auto': 'auto',
    'id': 'identity', 
    'forms': 'form',
    'tables': 'form' // Use form for tables as well
  };
  
  const documentType = docTypeMap[mode] || 'auto';
  
  // Call your Lambda through API Gateway
  const fileContent = await fileToBase64(file);

  // DEBUG: Add diagnostic logging
  console.log("[ANALYZE] sending", {
    filename: file.name,
    size: file.size,
    base64Head: fileContent.slice(0, 40),
    documentType,
    apiUrl: API_URL
  });

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image: fileContent,
      documentType: documentType,
      filename: file.name
    })
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("[ANALYZE] error response:", error);
    throw new Error(`Analysis failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}