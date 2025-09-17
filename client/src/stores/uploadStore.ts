import { create } from 'zustand';

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
}

interface UploadStore {
  uploads: UploadedItem[];
  addUpload: (file: File, mode: string) => number;
  updateUpload: (id: number, updates: Partial<UploadedItem>) => void;
  removeUpload: (id: number) => void;
  clearUploads: () => void;
  getUpload: (id: number) => UploadedItem | undefined;
}

export const useUploadStore = create<UploadStore>((set, get) => ({
  uploads: [],
  
  addUpload: (file: File, mode: string) => {
    const id = Date.now() + Math.random();
    const newUpload: UploadedItem = {
      id,
      name: file.name,
      file,
      status: "pending",
      mode,
      analyzed: false,
    };
    
    set((state) => ({
      uploads: [...state.uploads, newUpload]
    }));
    
    return id;
  },
  
  updateUpload: (id: number, updates: Partial<UploadedItem>) => {
    set((state) => ({
      uploads: state.uploads.map((upload) =>
        upload.id === id ? { ...upload, ...updates } : upload
      )
    }));
  },
  
  removeUpload: (id: number) => {
    set((state) => ({
      uploads: state.uploads.filter((upload) => upload.id !== id)
    }));
  },
  
  clearUploads: () => {
    set({ uploads: [] });
  },
  
  getUpload: (id: number) => {
    return get().uploads.find((upload) => upload.id === id);
  },
}));
