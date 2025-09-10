import mitt from 'mitt';

export type AutofillJob = {
  uploadId: string;
  fileName: string;
  s3Key?: string;
};

export type AutofillResult = {
  uploadId: string;
  fileName: string;
  detailsCount: number;
  fields: Array<{ key: string; value: string; pii?: boolean; confidence?: number }>;
  suggestion?: { memberId?: string; memberName?: string; confidence?: number } | null;
};

type Events = {
  'autofill:started': AutofillJob;
  'autofill:ready': AutofillResult;
  'autofill:failed': { uploadId: string; fileName: string; error: string };
};

const bus = mitt<Events>();
export default bus;