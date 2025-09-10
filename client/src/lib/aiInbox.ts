type Field = { key: string; value: string; confidence: number; pii?: boolean };

export async function aiInboxProcessFile(
  file: File,
  s3Key: string,
  userId: string,
  inbox: {
    open: () => void;
    addOrUpdate: (item: {
      id: string;
      fileName: string;
      status: "analyzing"|"suggested"|"dismissed";
      suggestion?: { memberId: string; memberName: string; confidence: number } | null;
      fields?: Field[];
    }) => void;
  }
) {
  // 1) Register the upload (this is where the current error is)
  const regRes = await fetch("/api/uploads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      userId,                     // MUST be non-empty
      fileKey: s3Key,             // e.g. "u123/inbox/abc.jpg"
      fileName: file.name,
      mime: file.type || "application/octet-stream",
      size: file.size ?? 0,
    }),
  });

  if (!regRes.ok) {
    const msg = await regRes.text();
    throw new Error(`register failed: ${msg}`);  // surfaces the real reason in the toast
  }

  const { uploadId } = await regRes.json();

  // Optimistic card - show analyzing immediately
  inbox.addOrUpdate({ id: uploadId, fileName: file.name, status: "analyzing" });

  // 2) Analyze (OCR + family match) with retry to handle race conditions
  let anRes;
  const maxRetries = 3;
  const retryDelays = [0, 250, 600]; // ms
  
  for (let i = 0; i < maxRetries; i++) {
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, retryDelays[i]));
      console.log(`🔄 Retrying analysis (attempt ${i + 1}/${maxRetries}) for ID: ${uploadId}`);
    }
    
    anRes = await fetch(`/api/inbox/${uploadId}/analyze`, { 
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ 
        // Pass context for fallback recovery
        userId,
        fileKey: s3Key,
        fileName: file.name,
        retryAttempt: i + 1
      })
    });
    
    if (anRes.ok) break;
    
    // If it's the last attempt, throw the error
    if (i === maxRetries - 1) {
      const msg = await anRes.text();
      throw new Error(`analyze failed after ${maxRetries} attempts: ${msg}`);
    }
  }

  const { suggestion, fields } = await anRes.json();

  // 3) Update the card and open Inbox drawer
  inbox.addOrUpdate({
    id: uploadId,
    fileName: file.name,
    status: suggestion ? "suggested" : "dismissed",
    suggestion: suggestion ?? null,
    fields: fields ?? [],
  });

  inbox.open();
}