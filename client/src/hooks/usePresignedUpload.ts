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
    async (file: File, signed: PresignResponse): Promise<UploadResult> => {
      setProgress(0);
      setUploading(true);
      setError(null);

      try {
        // Use XHR so we can report progress
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", signed.uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type);

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
            }
          };

          xhr.onerror = () => reject(new Error("Network error during upload"));
          xhr.ontimeout = () => reject(new Error("Upload timeout"));
          xhr.timeout = 60000; // 60 second timeout

          xhr.send(file);
        });

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
        // Step 1: Get presigned URL
        const signed = await presign({
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          contentLength: file.size,
          ...options,
        });

        // Step 2: Upload to S3/R2
        return await uploadToSignedUrl(file, signed);
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