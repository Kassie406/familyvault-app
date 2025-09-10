export type ExtractedField = {
  key: string;
  value: string;
  confidence: number; // 0–100
  pii?: boolean;
};

export type Suggestion = {
  memberId: string;
  memberName: string;
  confidence: number;
  fields: ExtractedField[];
};

export type InboxItem = {
  id: string;
  fileUrl: string;
  filename: string;
  status: "analyzing" | "suggested" | "accepted" | "dismissed" | "none" | "unsupported" | "failed";
  suggestion?: Suggestion;
  uploadedAt: Date;
  fileSize?: number;
  mimeType?: string;
};

export type InboxAnalysisResult = {
  success: boolean;
  suggestion?: Suggestion;
  error?: string;
};