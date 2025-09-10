import { useState, useCallback } from "react";

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

  const registerAndAnalyze = useCallback(async (args: {
    userId: string;
    fileKey: string;
    fileName: string;
    mime?: string;
    size?: number;
  }) => {
    try {
      setBanner({ open: true, fileName: args.fileName });

      // 1) register
      const reg = await fetch("/api/inbox/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(args)
      }).then(r => r.json());

      // 2) analyze
      const res = await fetch(`/api/inbox/${reg.uploadId}/analyze`, { method: "POST" }).then(r => r.json());

      setBanner({
        open: true,
        fileName: args.fileName,
        uploadId: reg.uploadId,
        fields: res.fields || [],      // <- this must be here (not undefined)
        suggestion: res.suggestion || null
      });
    } catch (e: any) {
      setBanner(b => ({ ...b, error: String(e?.message || e) }));
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