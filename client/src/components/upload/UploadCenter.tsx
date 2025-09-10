"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, AlertCircle, UploadCloud, FileText, Image as ImageIcon, ShieldCheck, X, Camera, Smartphone, Sparkles } from "lucide-react";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useFileStatus } from "@/hooks/useFileStatus";
import MobileUploadModal from "./MobileUploadModal";
import InboxDrawer from "@/components/inbox/InboxDrawer";

type FileRow = {
  id: string;
  file: File;
  previewUrl?: string;
  progress: number; // 0..100
  status: "idle" | "uploading" | "done" | "error";
  errorMsg?: string;
  // Document specific fields
  title?: string;
  description?: string;
  category?: string;
  // Photo specific fields
  caption?: string;
  altText?: string;
  location?: string;
  docId?: string; // for tracking document records
  photoId?: string; // for tracking photo records
};

interface UploadCenterProps {
  familyId?: string;
  onUploadComplete?: (id: string, type: 'document' | 'photo') => void;
  onFileUploaded?: (file: File, s3Key: string, type: 'document' | 'photo') => void;
  className?: string;
}

export default function UploadCenter({ 
  familyId = "family-1", 
  onUploadComplete,
  onFileUploaded,
  className 
}: UploadCenterProps) {
  const [tab, setTab] = useState<"docs" | "photos">("docs");
  const [rows, setRows] = useState<FileRow[]>([]);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  
  // Form fields for current upload
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [documentCategory, setDocumentCategory] = useState("general");
  
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoAltText, setPhotoAltText] = useState("");
  const [photoLocation, setPhotoLocation] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = usePresignedUpload();
  const { toast } = useToast();
  const queryClient = useQueryClient();


  const documentAccept = "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/msword,image/*";
  const photoAccept = "image/*";

  const accept = tab === "docs" ? documentAccept : photoAccept;

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const mapped = files.map((f) => {
      // Enhanced image type detection
      const isImage = f.type.startsWith("image/") || 
                     /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(f.name);
      
      let previewUrl: string | undefined;
      if (isImage) {
        try {
          previewUrl = URL.createObjectURL(f);
        } catch (error) {
          console.warn("Failed to create preview URL for", f.name, error);
        }
      }
      
      return {
        id: crypto.randomUUID(),
        file: f,
        previewUrl,
        progress: 0,
        status: "idle" as const,
        // Apply current form values to new files
        ...(tab === "docs" ? {
          title: documentTitle || f.name.replace(/\.[^/.]+$/, ""),
          description: documentDescription,
          category: documentCategory,
        } : {
          caption: photoCaption,
          altText: photoAltText,
          location: photoLocation,
        })
      };
    });
    setRows((r) => [...mapped, ...r]);
  }

  // Document upload mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: async (row: FileRow) => {
      // Step 1: Upload file to S3/R2 with progress tracking
      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, status: "uploading" } : x)));
      
      const { key, publicUrl } = await uploadFile(row.file, {
        type: "document",
        familyId
      });

      return { key, publicUrl };
    },
    onSuccess: async (result, row) => {
      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, status: "done", progress: 100 } : x)));
      
      toast({
        title: "Document uploaded",
        description: `${row.file.name} has been uploaded successfully.`,
      });
      
      // Notify parent about file upload for potential AI analysis
      onFileUploaded?.(row.file, result.key, 'document');
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    },
    onError: (error, row) => {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, status: "error", errorMsg: errorMessage } : x)));
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Photo upload mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async (row: FileRow) => {
      // Step 1: Create photo record
      const createRes = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          familyId,
          caption: row.caption,
          altText: row.altText,
          location: row.location,
        }),
      });

      if (!createRes.ok) {
        throw new Error(`Failed to create photo record for ${row.file.name}`);
      }

      const photo = await createRes.json();

      // Step 2: Upload file to S3/R2 with progress tracking
      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, status: "uploading", photoId: photo.id } : x)));
      
      const { key, publicUrl } = await uploadFile(row.file, {
        type: "photo",
        familyId
      });

      // Step 3: Attach file to photo
      const attachRes = await fetch(`/api/photos/${photo.id}/attach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ key, publicUrl }),
      });

      if (!attachRes.ok) {
        throw new Error(`Failed to attach file to photo ${photo.id}`);
      }

      return { photoId: photo.id, key, publicUrl };
    },
    onSuccess: async (result, row) => {
      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, status: "done", progress: 100 } : x)));
      onUploadComplete?.(result.photoId, 'photo');
      toast({
        title: "Photo uploaded",
        description: `${row.file.name} has been uploaded successfully.`,
      });
      
      // Notify parent about file upload for potential AI analysis
      onFileUploaded?.(row.file, result.key, 'photo');
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
    },
    onError: (error, row) => {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, status: "error", errorMsg: errorMessage } : x)));
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  async function uploadAll() {
    const pendingRows = rows.filter((r) => r.status === "idle");
    
    for (const row of pendingRows) {
      try {
        if (tab === "docs") {
          await uploadDocumentMutation.mutateAsync(row);
        } else {
          await uploadPhotoMutation.mutateAsync(row);
        }
      } catch (error) {
        // Error handling is done in the mutation onError callback
        console.error(`Upload failed for ${row.file.name}:`, error);
      }
    }
  }

  function clearAll() {
    rows.forEach((r) => r.previewUrl && URL.revokeObjectURL(r.previewUrl));
    setRows([]);
  }

  function removeFile(fileId: string) {
    setRows((r) => {
      const file = r.find(f => f.id === fileId);
      if (file?.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
      return r.filter(f => f.id !== fileId);
    });
  }

  const hasPending = rows.some((r) => r.status === "idle");
  const uploading = uploadDocumentMutation.isPending || uploadPhotoMutation.isPending;








  return (
    <Card className={`bg-zinc-950/70 border-zinc-800 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-zinc-100 flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-[#D4AF37]" />
              Upload Center
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Secure S3 <span className="mx-1">•</span> Virus-scanned <span className="mx-1">•</span> Max 25MB each
            </CardDescription>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInboxOpen(true)}
              className="text-zinc-400 hover:text-[#D4AF37] border border-zinc-700 hover:border-[#D4AF37]"
              data-testid="button-open-inbox"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              AI Inbox
            </Button>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
              Encrypted in transit
            </div>
          </div>
        </div>
      </CardHeader>


      <CardContent className="pt-0">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
          <TabsList id="upload-tabs" className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger 
              value="docs" 
              className="text-[#c5a000] hover:text-[#c5a000] focus:text-[#c5a000] focus-visible:text-[#c5a000] active:text-[#c5a000] data-[state=active]:bg-[#c5a000]/20 data-[state=active]:text-[#c5a000] [&:focus]:text-[#c5a000] [&:focus:hover]:text-[#c5a000]"
            >
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger 
              value="photos" 
              className="text-[#c5a000] hover:text-[#c5a000] focus:text-[#c5a000] focus-visible:text-[#c5a000] active:text-[#c5a000] data-[state=active]:bg-[#c5a000]/20 data-[state=active]:text-[#c5a000] [&:focus]:text-[#c5a000] [&:focus:hover]:text-[#c5a000]"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Photos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="docs" className="mt-6 space-y-4">
            {/* Document form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="doc-title" className="text-zinc-300">Document Title</Label>
                <Input
                  id="doc-title"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="Insurance Policy, Medical Records, etc."
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="doc-category" className="text-zinc-300">Category</Label>
                <Select value={documentCategory} onValueChange={setDocumentCategory}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="doc-description" className="text-zinc-300">Description (Optional)</Label>
              <Textarea
                id="doc-description"
                value={documentDescription}
                onChange={(e) => setDocumentDescription(e.target.value)}
                placeholder="Brief description of the document"
                className="bg-zinc-900 border-zinc-700 text-white"
                rows={2}
              />
            </div>
            <DropArea onPick={() => inputRef.current?.click()} tab="docs" />
          </TabsContent>

          <TabsContent value="photos" className="mt-6 space-y-4">
            {/* Photo form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="photo-caption" className="text-zinc-300">Caption (Optional)</Label>
                <Input
                  id="photo-caption"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="What's happening in this photo?"
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="photo-location" className="text-zinc-300">Location (Optional)</Label>
                <Input
                  id="photo-location"
                  value={photoLocation}
                  onChange={(e) => setPhotoLocation(e.target.value)}
                  placeholder="Where was this taken?"
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="photo-alt" className="text-zinc-300">Alt Text (Optional)</Label>
              <Input
                id="photo-alt"
                value={photoAltText}
                onChange={(e) => setPhotoAltText(e.target.value)}
                placeholder="Describe the photo for accessibility"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <DropArea onPick={() => inputRef.current?.click()} tab="photos" />
          </TabsContent>
        </Tabs>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept={accept}
          onChange={onPickFiles}
        />

        {/* Selected files list */}
        {!!rows.length && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-zinc-300 mb-3">Selected Files ({rows.length})</h4>
            <ul className="space-y-3">
              {rows.map((r) => (
                <FilePreview key={r.id} row={r} onRemove={() => removeFile(r.id)} />
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="text-xs text-zinc-500">
          <div>Tip: You can drag & drop files here. All uploads are virus-scanned.</div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
            onClick={() => setMobileModalOpen(true)}
            data-testid="button-mobile-upload"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile Upload
          </Button>
          <Button
            variant="ghost"
            className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
            onClick={() => inputRef.current?.click()}
            data-testid="button-select-files"
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            Select Files
          </Button>
          <Button
            onClick={uploadAll}
            disabled={!hasPending || uploading}
            className="rounded-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 disabled:opacity-40"
            data-testid="button-upload-all"
          >
            Upload ({rows.filter(r => r.status === "idle").length})
          </Button>
          <Button
            variant="outline"
            onClick={clearAll}
            className="rounded-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            data-testid="button-clear-all"
          >
            Clear
          </Button>
        </div>
      </CardFooter>

      {/* Mobile Upload Modal */}
      <MobileUploadModal
        open={mobileModalOpen}
        onOpenChange={setMobileModalOpen}
        purpose={tab === "docs" ? "documents" : "photos"}
        familyId={familyId}
      />
      
      {/* AI Inbox Drawer */}
      <InboxDrawer
        isOpen={inboxOpen}
        onClose={() => setInboxOpen(false)}
      />
    </Card>
  );
}

function DropArea({ onPick, tab }: { onPick: () => void; tab: "docs" | "photos" }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onPick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? onPick() : null)}
      className="rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900/40
                 p-8 text-center hover:border-[#D4AF37] hover:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]
                 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]
                 cursor-pointer"
      aria-label={`Select ${tab === "docs" ? "documents" : "photos"} to upload`}
      data-testid={`dropzone-${tab}`}
    >
      <div className="mx-auto mb-3 rounded-xl h-12 w-12 bg-zinc-800 flex items-center justify-center">
        {tab === "docs" ? (
          <FileText className="h-6 w-6 text-[#D4AF37]" />
        ) : (
          <ImageIcon className="h-6 w-6 text-[#D4AF37]" />
        )}
      </div>
      <div className="text-base text-zinc-300 mb-2">
        Click to select {tab === "docs" ? "documents" : "photos"} or drag & drop
      </div>
      <div className="text-sm text-zinc-500">
        {tab === "docs" ? (
          <>PDF, DOC, DOCX, TXT, Images <span className="mx-1">•</span> Max 25MB each</>
        ) : (
          <>JPG, PNG, GIF, WebP <span className="mx-1">•</span> Max 10MB each</>
        )}
      </div>
    </div>
  );
}

function FilePreview({ row, onRemove }: { row: FileRow; onRemove: () => void }) {
  return (
    <li className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-zinc-800 overflow-hidden flex items-center justify-center flex-shrink-0">
          {row.previewUrl ? (
            <img 
              src={row.previewUrl} 
              alt={row.file.name} 
              className="h-full w-full object-cover" 
              onError={(e) => {
                console.warn("Failed to load preview for", row.file.name);
                // Hide the broken image
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <FileText className="h-6 w-6 text-zinc-300" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="truncate text-sm font-medium text-zinc-200">{row.file.name}</div>
            <button
              onClick={onRemove}
              className="text-zinc-500 hover:text-red-400 transition-colors"
              data-testid={`remove-file-${row.id}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="text-xs text-zinc-500 mb-2">
            {(row.file.size / 1024 / 1024).toFixed(2)} MB
            {row.title && <span className="ml-2">• {row.title}</span>}
            {row.caption && <span className="ml-2">• {row.caption}</span>}
          </div>

          {/* Progress bar */}
          {row.status !== "idle" && row.status !== "done" && (
            <div className="mb-2">
              <Progress value={row.progress} className="h-2 [&>div]:bg-[#D4AF37]" />
            </div>
          )}

          {/* Status pills */}
          <div className="flex items-center gap-2">
            {row.status === "done" && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Uploaded
              </span>
            )}
            {row.status === "error" && (
              <span className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {row.errorMsg ?? "Failed"}
              </span>
            )}
            {row.status === "uploading" && (
              <span className="text-xs text-[#D4AF37] flex items-center gap-1">
                <div className="h-3 w-3 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                Uploading...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* File Status for documents */}
      {row.status === "done" && row.docId && (
        <FileStatusIndicator fileId={row.docId} fileName={row.file.name} />
      )}
    </li>
  );
}

// Status indicator component for documents
function FileStatusIndicator({ fileId, fileName }: { fileId: string; fileName: string }) {
  const { status, connected } = useFileStatus(fileId, 'document');
  
  if (!status) return null;
  
  return (
    <div className="mt-3 p-2 bg-zinc-800/50 rounded-lg text-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-zinc-300 text-xs">{fileName}</span>
        <div className="flex items-center gap-2">
          {connected && <div className="w-2 h-2 bg-green-400 rounded-full" title="Real-time connected" />}
        </div>
      </div>
      
      <div className="flex items-center gap-3 text-xs">
        <span className={`px-2 py-0.5 rounded ${
          status.scanStatus === 'clean' ? 'bg-green-600/20 text-green-400' :
          status.scanStatus === 'infected' ? 'bg-red-600/20 text-red-400' :
          status.scanStatus === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
          'bg-gray-600/20 text-gray-400'
        }`}>
          Scan: {status.scanStatus}
        </span>
        
        <span className={`px-2 py-0.5 rounded ${
          status.thumbStatus === 'done' ? 'bg-green-600/20 text-green-400' :
          status.thumbStatus === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
          'bg-gray-600/20 text-gray-400'
        }`}>
          Thumb: {status.thumbStatus}
        </span>
        
        {status.ready && <span className="text-green-400">✓ Ready</span>}
        {status.blocked && <span className="text-red-400">⚠ Blocked</span>}
        {status.processing && <span className="text-yellow-400">⏳ Processing</span>}
      </div>
    </div>
  );
}