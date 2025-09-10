import { useCallback, useState } from "react";

type Field = { key: string; value: string; confidence?: number; pii?: boolean };
type Suggestion = { memberId: string; memberName: string; confidence: number };
type Item = {
  id: string;
  fileName: string;
  status: "analyzing"|"suggested"|"accepted"|"dismissed"|"uploaded"|"failed";
  suggestion?: Suggestion | null;
  fields?: Field[];
};

export function useAutoFill() {
  const [banner, setBanner] = useState<null | {
    fileName: string;
    detailsCount: number;
    fields: Field[];
    suggestion?: Suggestion | null;
    id: string;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerAndAnalyze = useCallback(async (args: {
    userId: string; fileName: string; s3Key: string; mime?: string; size?: number;
  }) => {
    setError(null); setLoading(true);

    // 1) register
    const reg = await fetch("/api/inbox/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        userId: args.userId, fileKey: args.s3Key, fileName: args.fileName,
        mime: args.mime, size: args.size
      })
    }).then(r => r.ok ? r.json() : Promise.reject({ step: "register", status: r.status }));

    // 2) analyze (simple retry 3x)
    let analyzeRes: any, lastErr: any;
    for (let i = 0; i < 3; i++) {
      try {
        analyzeRes = await fetch(`/api/inbox/${reg.uploadId}/analyze`, { method: "POST" })
          .then(r => r.ok ? r.json() : Promise.reject({ step: "analyze", status: r.status }));
        break;
      } catch (e) { lastErr = e; await new Promise(r => setTimeout(r, 600 * (i + 1))); }
    }
    if (!analyzeRes) { setLoading(false); setError(JSON.stringify(lastErr)); return; }

    const fields: Field[] = analyzeRes.fields ?? [];
    setBanner({
      id: reg.uploadId,
      fileName: args.fileName,
      detailsCount: fields.length,
      fields,
      suggestion: analyzeRes.suggestion ?? null,
    });
    setLoading(false);
  }, []);

  const accept = useCallback(async (id: string, memberId?: string) => {
    await fetch(`/api/inbox/${id}/accept`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ memberId })
    });
    setBanner(null);
  }, []);

  const dismiss = useCallback(async (id: string) => {
    await fetch(`/api/inbox/${id}/dismiss`, { method: "POST" });
    setBanner(null);
  }, []);

  return { banner, loading, error, registerAndAnalyze, accept, dismiss };
}