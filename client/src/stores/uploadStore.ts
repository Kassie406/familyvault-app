import { create } from 'zustand';

// Upload item for the trustworthy inbox
export interface UploadedItem {
  id: number;
  name: string;
  file: File;
  status: "pending" | "analyzing" | "complete" | "error";
  mode: string;
  analyzed: boolean;
  result?: {
    extractedData?: Record<string, any>;
    extractedText?: string;
  };
  error?: string;
  uploadedAt: Date;
}

interface UploadStore {
  uploads: UploadedItem[];
  addUpload: (item: UploadedItem) => void;
  updateUpload: (id: number, updates: Partial<UploadedItem>) => void;
  removeUpload: (id: number) => void;
  clearUploads: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  uploads: [],
  
  addUpload: (item) =>
    set((state) => ({
      uploads: [...state.uploads, { ...item, uploadedAt: new Date() }],
    })),
  
  updateUpload: (id, updates) =>
    set((state) => ({
      uploads: state.uploads.map((upload) =>
        upload.id === id ? { ...upload, ...updates } : upload
      ),
    })),
  
  removeUpload: (id) =>
    set((state) => ({
      uploads: state.uploads.filter((upload) => upload.id !== id),
    })),
  
  clearUploads: () => set({ uploads: [] }),
}));