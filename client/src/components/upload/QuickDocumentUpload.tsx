import { useState, useRef } from "react";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, FileText, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFileStatus } from "@/hooks/useFileStatus";
import { useAutoFill } from "@/hooks/useAutofill";
import AutofillBanner from "@/components/AutofillBanner";
import MobileUploadModal from "./MobileUploadModal";

interface QuickDocumentUploadProps {
  familyId?: string;
  onUploadComplete?: (documentId: string) => void;
  className?: string;
}

// Status indicator component
function FileStatusIndicator({ fileId, fileName }: { fileId: string; fileName: string }) {
  const { status, connected } = useFileStatus(fileId, 'document');
  
  if (!status) return null;
  
  return (
    <div className="mt-2 p-2 bg-gray-700/30 rounded text-sm">
      <div className="flex items-center justify-between">
        <span className="text-gray-300">{fileName}</span>
        <div className="flex items-center gap-2">
          {connected && <div className="w-2 h-2 bg-green-400 rounded-full" title="Real-time connected" />}
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-1 text-xs">
        <span className={`px-2 py-1 rounded ${
          status.scanStatus === 'clean' ? 'bg-green-600/20 text-green-400' :
          status.scanStatus === 'infected' ? 'bg-red-600/20 text-red-400' :
          status.scanStatus === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
          'bg-gray-600/20 text-gray-400'
        }`}>
          Scan: {status.scanStatus}
        </span>
        
        <span className={`px-2 py-1 rounded ${
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

export default function QuickDocumentUpload({ 
  familyId = "family-1", 
  onUploadComplete,
  className 
}: QuickDocumentUploadProps) {
  const { uploadFile, progress, uploading, error, reset } = usePresignedUpload();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { banner, loading: aiLoading, error: aiError, registerAndAnalyze, accept, dismiss } = useAutoFill();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedDocId, setUploadedDocId] = useState<string | null>(null);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  
  // Refs for camera capture
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const scanInputRef = useRef<HTMLInputElement>(null);

  // Handle camera/scan capture
  const handleCameraCapture = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    setTitle(file.name.replace(/\.[^/.]+$/, "") || "Scanned Document");
  };

  // Create document and attach file mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Step 1: Create document metadata
      const createRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          title: title || file.name,
          description,
          category,
          familyId 
        }),
      });
      
      if (!createRes.ok) {
        throw new Error("Failed to create document");
      }
      
      const doc = await createRes.json();

      // Step 2: Upload file to S3/R2
      const { key, publicUrl } = await uploadFile(file, {
        type: "document",
        familyId
      });

      // Step 2.5: Trigger AI analysis immediately after S3 upload
      try {
        await registerAndAnalyze({
          userId: "current-user", // TODO: get real user ID from auth context
          fileName: file.name,
          s3Key: key,
          mime: file.type,
          size: file.size
        });
      } catch (aiErr) {
        console.log("AI analysis failed (non-critical):", aiErr);
        // Don't fail the upload if AI analysis fails
      }

      // Step 3: Attach file to document
      const attachRes = await fetch(`/api/documents/${doc.id}/attach-file`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          storageKey: key,
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          size: file.size,
          publicUrl,
        }),
      });

      if (!attachRes.ok) {
        throw new Error("Failed to attach file");
      }

      return doc;
    },
    onSuccess: (doc) => {
      toast({
        title: "Document uploaded successfully",
        description: `"${doc.title || title}" has been added to your family vault.`,
      });
      
      // Track uploaded document for real-time status
      setUploadedDocId(doc.id);
      
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("general");
      setSelectedFile(null);
      reset();
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/family/stats"] });
      
      onUploadComplete?.(doc.id);
    },
    onError: (err) => {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadMutation.mutate(selectedFile);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setTitle("");
    setDescription("");
    setCategory("general");
    reset();
  };

  const isUploading = uploading || uploadMutation.isPending;
  const showProgress = isUploading && progress > 0;

  return (
    <div className="space-y-4">
      {/* AI Autofill Banner */}
      {banner && (
        <AutofillBanner
          fileName={banner.fileName}
          detailsCount={banner.detailsCount}
          fields={banner.fields}
          suggestion={banner.suggestion}
          onAccept={() => accept(banner.id, banner.suggestion?.memberId)}
          onDismiss={() => dismiss(banner.id)}
          onViewDetails={() => {
            // TODO: Open modal with banner.fields details
            toast({
              title: "Extracted Details",
              description: `Found ${banner.fields.length} fields: ${banner.fields.map(f => f.key).join(", ")}`,
            });
          }}
        />
      )}

      {/* AI Error Display */}
      {aiError && (
        <div className="p-3 bg-red-900/20 border border-red-600/30 rounded-lg text-red-300 text-sm">
          AI analysis failed: {aiError}
        </div>
      )}

      <Card className={`bg-gray-800/50 border-gray-700/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FileText className="h-5 w-5 text-yellow-400" />
          Upload Document
        </CardTitle>
        <CardDescription className="text-gray-400">
          Add important documents to your family vault
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!selectedFile ? (
          <>
            {/* File Selection */}
            <div>
              <Label htmlFor="title" className="text-gray-300">
                Document Title (optional)
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Insurance Policy, Medical Records, etc."
                className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-gray-300">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="file-upload" className="text-gray-300 mb-2 block">
                Select File
              </Label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-700/20 hover:bg-gray-700/30 transition-colors">
                <div className="flex flex-col items-center justify-center pt-3 pb-3">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mb-3">PDF, DOC, DOCX, TXT, Images (MAX. 25MB)</p>
                  
                  {/* Mobile Upload Button */}
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMobileModalOpen(true);
                    }}
                    className="h-8 px-4 border-gray-500 bg-gray-800/70 hover:bg-gray-700/70 text-white text-sm"
                    disabled={isUploading}
                  >
                    📱 Mobile Upload
                  </Button>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                />
              </label>

              {/* Hidden camera input */}
              <input
                ref={scanInputRef}
                type="file"
                accept="image/*,.pdf"
                capture="environment"
                onChange={(e) => handleCameraCapture(e.target.files)}
                className="hidden"
                disabled={isUploading}
              />
            </div>
          </>
        ) : (
          <>
            {/* File Selected View */}
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="font-medium text-white">{selectedFile.name}</p>
                    <p className="text-sm text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="final-title" className="text-gray-300">
                    Title
                  </Label>
                  <Input
                    id="final-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Document title"
                    className="bg-gray-600/50 border-gray-500/50 text-white"
                    disabled={isUploading}
                  />
                </div>

                <div>
                  <Label htmlFor="final-description" className="text-gray-300">
                    Description (optional)
                  </Label>
                  <Input
                    id="final-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description..."
                    className="bg-gray-600/50 border-gray-500/50 text-white"
                    disabled={isUploading}
                  />
                </div>
              </div>

              {/* Progress Bar */}
              {showProgress && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mt-3 p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isUploading}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || !selectedFile}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-medium"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      {/* Real-time status display for last uploaded file */}
      {uploadedDocId && (
        <CardContent className="pt-0">
          <div className="border-t border-gray-700/50 pt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Last Upload Status</h4>
            <FileStatusIndicator fileId={uploadedDocId} fileName={title || "Uploaded Document"} />
          </div>
        </CardContent>
      )}
      
      {/* Mobile Upload Modal */}
      <MobileUploadModal
        open={mobileModalOpen}
        onOpenChange={setMobileModalOpen}
        purpose="documents"
        familyId={familyId}
      />
    </Card>
    </div>
  );
}