import { useState, useCallback } from "react";

export type PresignBody = {
  type: "document" | "photo";
  fileName: string;
  contentType: string;
  contentLength?: number;
  familyId?: string;
};

export type PresignResponse = {
  uploadUrl: string;
  key: string;
  bucket: string;
  expiresIn: number;
  publicUrl?: string;
  maxSize: number;
};

export type UploadResult = {
  key: string;
  publicUrl?: string;
};

export function usePresignedUpload() {
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const presign = useCallback(async (body: PresignBody): Promise<PresignResponse> => {
    setError(null);
    const r = await fetch("/api/storage/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
    
    if (!r.ok) {
      const errorData = await r.json();
      throw new Error(errorData.error || `Presign failed: ${r.status}`);
    }
    
    return (await r.json()) as PresignResponse;
  }, []);

  const uploadToSignedUrl = useCallback(
    async (file: File, signed: PresignResponse, contentType?: string): Promise<UploadResult> => {
      setProgress(0);
      setUploading(true);
      setError(null);

      try {
        const finalContentType = contentType || file.type || "application/octet-stream";
        
        // Debug logging to see what we're sending
        console.log('🚀 Uploading to:', signed.uploadUrl);
        console.log('📝 Headers Content-Type:', finalContentType);
        console.log('📦 File size:', file.size, 'bytes');
        
        // Validate the uploadUrl is HTTPS (required for CORS)
        if (!signed.uploadUrl.startsWith('https://')) {
          throw new Error('Upload URL must be HTTPS for CORS to work');
        }
        
        // Use fetch with exact S3-compatible settings
        const response = await fetch(signed.uploadUrl, {
          method: "PUT",
          mode: "cors",
          credentials: "omit", // Critical: do NOT send cookies to S3
          headers: { 
            "Content-Type": finalContentType
          },
          body: file,
        });
        
        console.log('✅ PUT response:', response.status, response.statusText);

        if (!response.ok) {
          // Try to get the actual S3 error message
          let errorMsg = `Upload failed: ${response.status} ${response.statusText}`;
          try {
            const responseText = await response.text();
            if (responseText) {
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(responseText, "text/xml");
              const code = xmlDoc.getElementsByTagName("Code")[0]?.textContent;
              const message = xmlDoc.getElementsByTagName("Message")[0]?.textContent;
              if (code && message) {
                errorMsg = `S3 Error: ${code} - ${message}`;
              }
            }
          } catch (e) {
            // Fall back to status text
          }
          throw new Error(errorMsg);
        }

        setProgress(100);
        return { key: signed.key, publicUrl: signed.publicUrl };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const uploadFile = useCallback(
    async (file: File, options: Omit<PresignBody, 'fileName' | 'contentType' | 'contentLength'>): Promise<UploadResult> => {
      try {
        // Ensure consistent Content-Type
        const contentType = file.type || "application/octet-stream";
        
        // Step 1: Get presigned URL
        const signed = await presign({
          fileName: file.name,
          contentType,
          contentLength: file.size,
          ...options,
        });

        // Step 2: Upload to S3/R2 (ensure same Content-Type)
        return await uploadToSignedUrl(file, signed, contentType);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        throw err;
      }
    },
    [presign, uploadToSignedUrl]
  );

  const reset = useCallback(() => {
    setProgress(0);
    setUploading(false);
    setError(null);
  }, []);

  return { 
    presign, 
    uploadToSignedUrl, 
    uploadFile,
    progress, 
    uploading, 
    error,
    reset
  };
}