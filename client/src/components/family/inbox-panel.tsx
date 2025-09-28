import React, { useCallback, useMemo, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useDropzone } from "react-dropzone";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Shield,
  Smartphone,
  Mail,
  Sparkles,
  ChevronRight,
  Zap,
  Image,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  Camera,
  FolderOpen,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUploadStore } from "@/stores/uploadStore";
import SuggestDetailsModal from "@/components/inbox/SuggestDetailsModal";
import { formatFileSize, getConfidenceDot } from "@/lib/inbox";
import type { InboxItem } from '@shared/types/inbox';

export default function InboxPanel() {
  const [location, setLocation] = useLocation();
  const isOpen = location === "/family/inbox";
  const { uploads, addUpload, removeUpload } = useUploadStore();
  const [selectedUpload, setSelectedUpload] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showMobileUploadModal, setShowMobileUploadModal] = useState(false);
  const [mobileUploadLink, setMobileUploadLink] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const onClose = useCallback(() => {
    setLocation("/family");
  }, [setLocation]);

  // Upload handler functions
  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    setShowCameraModal(true);
  };

  const handleMobileUpload = async () => {
    try {
      const response = await fetch('/api/mobile-upload/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          familyId: "family-1",
          purpose: "documents"
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create upload session');
      }

      const sessionData = await response.json();
      const baseUrl = window.location.origin;
      const mobileLink = `${baseUrl}/m/u/${sessionData.id}?family=family-1`;
      
      setMobileUploadLink(mobileLink);
      setQrCodeUrl(mobileLink);
      setShowMobileUploadModal(true);
      
    } catch (error) {
      console.error('Failed to generate mobile upload link:', error);
    }
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('familyId', 'family-1');

      try {
        const response = await fetch('/api/trustworthy/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData
        });

        if (response.ok) {
          // Invalidate inbox query to refresh with new upload
          queryClient.invalidateQueries({ queryKey: ["/api/inbox"] });
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  // Fetch inbox items from API (trustworthy workflow integration)
  const { data: inboxItems = [], isLoading: inboxLoading, refetch } = useQuery<InboxItem[]>({
    queryKey: ["/api/inbox"],
    enabled: isOpen, // Only fetch when panel is open
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  const activeItem = inboxItems.find((item) => item.id === activeItemId) || null;

  // Accept suggestion mutation (step 7: Accept/Dismiss)
  const acceptMutation = useMutation({
    mutationFn: async ({ id, memberId, suggestions }: { id: string; memberId: string; suggestions: any }) => {
      const response = await fetch(`/api/inbox/${id}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ memberId, suggestions }),
      });
      if (!response.ok) throw new Error('Failed to accept suggestion');
    },
    onSuccess: () => {
      setActiveItemId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/inbox"] });
    },
    onError: (error) => {
      console.error("Failed to accept suggestion:", error);
    },
  });

  // Dismiss item mutation (step 7: Accept/Dismiss)
  const dismissMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/inbox/${id}/dismiss`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error('Failed to dismiss item');
    },
    onSuccess: () => {
      setActiveItemId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/inbox"] });
    },
    onError: (error) => {
      console.error("Failed to dismiss item:", error);
    },
  });

  // Accept suggestion - move file to member (step 7: Accept/Dismiss)
  const acceptSuggestion = (id: string) => {
    const item = inboxItems.find((item) => item.id === id);
    if (item?.suggestion) {
      // Convert legacy format to new comprehensive format for backend
      const suggestions = {
        fields: item.suggestion.fields.map((field: any) => ({
          label: field.key || field.label,
          key: field.key,
          value: field.value,
          confidence: field.confidence,
          path: field.path || 'person.unknown' // fallback path for legacy fields
        }))
      };
      
      acceptMutation.mutate({
        id,
        memberId: item.suggestion.memberId,
        suggestions,
      });
    }
  };

  // Dismiss item (step 7: Accept/Dismiss)
  const dismissItem = (id: string) => {
    dismissMutation.mutate(id);
  };

  // Navigate to member profile (step 8: Route to profile)
  const openMember = (memberId: string) => {
    setLocation(`/family/member/${memberId}`);
  };

  const visibleInboxItems = inboxItems.filter((item) => item.status !== "dismissed");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Upload files to server first
    await handleFileUpload(acceptedFiles);
    
    // Also add to upload store for UI purposes
    for (const file of acceptedFiles) {
      addUpload({
        id: Date.now() + Math.random(),
        name: file.name,
        file: file,
        status: "pending" as const,
        mode: "auto",
        analyzed: false,
        uploadedAt: new Date()
      });
    }
  }, [addUpload, handleFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  const dropzoneStyle = useMemo(() => ({
    ...(isDragActive ? { borderColor: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.1)' } : {}),
  }), [isDragActive]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="left" 
        className="w-full sm:max-w-lg bg-[#0A0A1A] border-r border-[#2A2A33] text-white overflow-auto"
        data-testid="inbox-panel"
      >
        <div className="space-y-6 p-1">
          <SheetHeader className="space-y-1">
            <SheetTitle className="text-2xl font-bold text-white">
              Inbox
            </SheetTitle>
            <p className="text-sm text-neutral-400">
              Drop files, forward emails, or browse to add documents to your family vault.
            </p>
          </SheetHeader>

          {/* Upload Toolbar */}
          <div className="grid grid-cols-3 gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf,.doc,.docx"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
            
            <Button
              onClick={handleBrowseFiles}
              className="upload-button h-20 bg-[#D4AF37] hover:bg-[#B8941F] text-black font-medium rounded-2xl border-0 transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center gap-2"
              data-testid="button-browse-files"
            >
              <FolderOpen className="h-6 w-6" />
              <span className="text-sm">Browse Files</span>
            </Button>

            <Button
              onClick={handleTakePhoto}
              className="upload-button h-20 bg-[#6366f1] hover:bg-[#5855eb] text-white font-medium rounded-2xl border-0 transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center gap-2"
              data-testid="button-take-photo"
            >
              <Camera className="h-6 w-6" />
              <span className="text-sm">Take Photo</span>
            </Button>

            <Button
              onClick={handleMobileUpload}
              className="upload-button h-20 bg-[#10b981] hover:bg-[#059669] text-white font-medium rounded-2xl border-0 transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center gap-2"
              data-testid="button-mobile-upload"
            >
              <Smartphone className="h-6 w-6" />
              <span className="text-sm">Mobile Upload</span>
            </Button>
          </div>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className="rounded-2xl border-2 border-dashed border-[#2A2A33] bg-[#0F0F13] p-8 text-center transition-colors hover:border-[#D4AF37]/50 cursor-pointer group"
            style={dropzoneStyle}
            data-testid="file-dropzone"
          >
            <input {...getInputProps()} />
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-[#111111] border border-[#2A2A33] grid place-items-center group-hover:border-[#D4AF37]/50 transition-colors">
              <Upload className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-sm text-neutral-400">
                or <span className="text-[#D4AF37] font-medium">browse to choose files</span>
              </p>
              <p className="text-xs text-neutral-500">
                Supports PDF, Word docs, images, and more
              </p>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-[#D4AF37]/40" />
          </div>

          {/* Promo/education card */}
          <div className="rounded-2xl border border-[#2A2A33] bg-[#0F0F13] p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg grid place-items-center bg-[#111111] border border-[#2A2A33]">
                <Sparkles className="h-4 w-4 text-[#D4AF37]" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Autofill suggestions</p>
                <p className="text-neutral-400">We'll detect file type, extract key details, and suggest a destination.</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <FeatureChip icon={<Shield className="h-3.5 w-3.5" />} label="Encrypted at rest" />
              <FeatureChip icon={<Smartphone className="h-3.5 w-3.5" />} label="Mobile capture" />
              <FeatureChip icon={<Mail className="h-3.5 w-3.5" />} label="Email to Inbox" />
            </div>
          </div>

          <Separator className="bg-[#1E1E24]" />

          {/* Steps */}
          <div className="space-y-4">
            <StepRow index={1} title="Add your files to Inbox" subtitle="Drag & drop, browse, or forward by email" />
            <StepRow index={2} title="We automatically find insights" subtitle="Extract details, summaries, and destinations" />
            <StepRow index={3} title="Organize with one click" subtitle="Accept suggestions to file docs into the right place" />
          </div>

          {/* Suggested items (placeholder list) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Suggestions</h3>
              <Button variant="ghost" className="h-8 px-2 text-xs text-neutral-300 hover:text-white">
                View all
              </Button>
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="rounded-xl border border-[#2A2A33] bg-[#0F0F13] p-3 flex items-center gap-3 hover:border-[#D4AF37]/30 transition-colors"
                  data-testid={`suggestion-item-${i}`}
                >
                  <div className="h-9 w-9 rounded-lg grid place-items-center bg-[#111111] border border-[#2A2A33]">
                    <FileText className="h-4 w-4 text-neutral-300" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium">scan-{396 + i}.pdf</p>
                    <p className="text-xs text-neutral-400">
                      Suggested: <span className="text-[#D4AF37]">Insurance ▸ Life Policy</span>
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-[#D4AF37] text-black hover:bg-[#c6a02e] transition-colors"
                    data-testid={`open-suggestion-${i}`}
                  >
                    Open
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Trustworthy Workflow Items - Steps 4-9 */}
          {visibleInboxItems.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">AI Analysis ({visibleInboxItems.length})</h3>
                <Button variant="ghost" className="h-8 px-2 text-xs text-neutral-300 hover:text-white">
                  View all
                </Button>
              </div>

              <div className="space-y-3">
                {visibleInboxItems.map((item: InboxItem) => (
                  <TrustworthyInboxItemCard
                    key={item.id}
                    item={item}
                    onOpenMember={() => item.suggestion && openMember(item.suggestion.memberId)}
                    onShowDetails={() => setActiveItemId(item.id)}
                    onDismiss={() => dismissItem(item.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Local Upload Store Items (legacy support) */}
          {uploads.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Local Uploads ({uploads.length})</h3>
                <Button variant="ghost" className="h-8 px-2 text-xs text-neutral-300 hover:text-white">
                  View all
                </Button>
              </div>

              <div className="space-y-3">
                {uploads.map((upload) => (
                  <div 
                    key={upload.id} 
                    className="rounded-xl border border-[#2A2A33] bg-[#0F0F13] p-3 flex items-center gap-3 hover:border-[#D4AF37]/30 transition-colors"
                    data-testid={`upload-item-${upload.id}`}
                  >
                    {/* File thumbnail/icon */}
                    <div className="h-9 w-9 rounded-lg grid place-items-center bg-[#111111] border border-[#2A2A33]">
                      {upload.file.type.startsWith('image/') ? (
                        <Image className="h-4 w-4 text-neutral-300" />
                      ) : (
                        <FileText className="h-4 w-4 text-neutral-300" />
                      )}
                    </div>
                    
                    {/* File info */}
                    <div className="flex-1 text-sm">
                      <p className="font-medium truncate" data-testid={`upload-name-${upload.id}`}>
                        {upload.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-400">
                          {(upload.file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                        <Badge 
                          variant={upload.status === "complete" ? "default" : upload.status === "analyzing" ? "secondary" : upload.status === "error" ? "destructive" : "outline"}
                          className="text-xs h-5"
                        >
                          {upload.status === "analyzing" ? "Processing..." : upload.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {upload.status === "complete" && (
                        <Button
                          size="sm"
                          className="bg-[#D4AF37] text-black hover:bg-[#c6a02e] transition-colors"
                          onClick={() => {
                            setSelectedUpload(upload);
                            setShowDetailsModal(true);
                          }}
                          data-testid={`button-details-${upload.id}`}
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Details {upload.result?.extractedData ? Object.keys(upload.result.extractedData).length : ''}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-neutral-400 hover:text-white hover:bg-[#111111]"
                        onClick={() => removeUpload(upload.id)}
                        data-testid={`button-remove-${upload.id}`}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state for both systems */}
          {visibleInboxItems.length === 0 && uploads.length === 0 && !inboxLoading && (
            <div className="text-center py-8">
              <div className="text-white/40 text-sm">
                No files to review
              </div>
              <div className="text-white/30 text-xs mt-2">
                Upload files above to see AI analysis here
              </div>
            </div>
          )}

          {/* Loading state */}
          {inboxLoading && (
            <div className="text-center py-8">
              <div className="w-8 h-8 mx-auto mb-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
              </div>
              <div className="text-white/40 text-sm">
                Loading inbox...
              </div>
            </div>
          )}
        </div>
      </SheetContent>

      {/* Trustworthy Details Modal - Step 6: Click Details → Modal opens with filename suggestion */}
      <SuggestDetailsModal
        open={!!activeItem}
        item={activeItem}
        onAccept={acceptSuggestion}
        onDismiss={dismissItem}
        onOpenMember={(memberId) => openMember(memberId)}
        onClose={() => setActiveItemId(null)}
      />

      {/* Legacy Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="bg-[#0A0A1A] border-[#2A2A33] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Document Analysis Results
            </DialogTitle>
          </DialogHeader>
          {selectedUpload && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-[#2A2A33]">
                <div className="h-10 w-10 rounded-lg grid place-items-center bg-[#111111] border border-[#2A2A33]">
                  {selectedUpload.file.type.startsWith('image/') ? (
                    <Image className="h-5 w-5 text-neutral-300" />
                  ) : (
                    <FileText className="h-5 w-5 text-neutral-300" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedUpload.name}</h3>
                  <p className="text-sm text-neutral-400">
                    {(selectedUpload.file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>

              {selectedUpload.result?.extractedData && (
                <div className="space-y-3">
                  <h4 className="font-medium text-[#D4AF37]">Extracted Information</h4>
                  <div className="grid gap-3">
                    {Object.entries(selectedUpload.result.extractedData).map(([key, value]) => (
                      <div key={key} className="bg-[#0F0F13] border border-[#2A2A33] rounded-lg p-3">
                        <div className="text-sm font-medium text-neutral-300 capitalize mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-sm text-white">
                          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedUpload.result?.extractedText && (
                <div className="space-y-3">
                  <h4 className="font-medium text-[#D4AF37]">Full Text</h4>
                  <div className="bg-[#0F0F13] border border-[#2A2A33] rounded-lg p-3 max-h-40 overflow-y-auto">
                    <pre className="text-sm text-neutral-300 whitespace-pre-wrap">
                      {selectedUpload.result.extractedText}
                    </pre>
                  </div>
                </div>
              )}

              {selectedUpload.status === "error" && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                  <h4 className="font-medium text-red-400 mb-1">Error</h4>
                  <p className="text-sm text-red-300">{selectedUpload.error}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Camera Modal */}
      {showCameraModal && (
        <Dialog open={showCameraModal} onOpenChange={(open) => {
          if (!open) {
            // Stop camera stream when modal closes
            if (videoRef.current?.srcObject) {
              const stream = videoRef.current.srcObject as MediaStream;
              stream.getTracks().forEach(track => track.stop());
              videoRef.current.srcObject = null;
            }
          }
          setShowCameraModal(open);
        }}>
          <DialogContent className="bg-[#0A0A1A] border-[#2A2A33] text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[#6366f1]">
                <Camera className="h-5 w-5" />
                Take Photo
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
                <canvas
                  ref={canvasRef}
                  style={{ display: 'none' }}
                />
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={async () => {
                    try {
                      const stream = await navigator.mediaDevices.getUserMedia({ 
                        video: { facingMode: 'environment' } 
                      });
                      if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                      }
                    } catch (error) {
                      console.error('Failed to start camera:', error);
                    }
                  }}
                  className="bg-[#6366f1] hover:bg-[#5855eb] text-white"
                  data-testid="button-start-camera"
                >
                  Start Camera
                </Button>
                <Button
                  onClick={() => {
                    if (videoRef.current && canvasRef.current) {
                      const canvas = canvasRef.current;
                      const video = videoRef.current;
                      const context = canvas.getContext('2d');
                      
                      canvas.width = video.videoWidth;
                      canvas.height = video.videoHeight;
                      context.drawImage(video, 0, 0);
                      
                      canvas.toBlob(async (blob) => {
                        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
                        await handleFileUpload([file]);
                        setShowCameraModal(false);
                        
                        // Stop camera
                        const stream = video.srcObject;
                        if (stream) {
                          stream.getTracks().forEach(track => track.stop());
                        }
                      }, 'image/jpeg', 0.8);
                    }
                  }}
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-black"
                  data-testid="button-capture-photo"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Photo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Mobile Upload Modal */}
      {showMobileUploadModal && (
        <Dialog open={showMobileUploadModal} onOpenChange={setShowMobileUploadModal}>
          <DialogContent className="bg-[#0A0A1A] border-[#2A2A33] text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[#10b981]">
                <Smartphone className="h-5 w-5" />
                Mobile Upload
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg inline-block mb-4">
                  {qrCodeUrl && (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code for Mobile Upload" 
                      className="w-48 h-48"
                    />
                  )}
                </div>
                <h4 className="text-lg font-medium text-white mb-2">Scan with your phone camera</h4>
                <p className="text-sm text-neutral-400">Point your phone's camera at the QR code to open the upload page</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Or copy this link:</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={mobileUploadLink} 
                    readOnly 
                    className="flex-1 px-3 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white text-sm"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(mobileUploadLink);
                    }}
                    className="bg-[#10b981] hover:bg-[#059669] text-white px-3 py-2"
                    data-testid="button-copy-link"
                  >
                    📋
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Sheet>
  );
}

function StepRow({ index, title, subtitle }: { index: number; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <Badge className="mt-0.5 h-6 rounded-full bg-[#111111] border border-[#2A2A33] text-[#D4AF37]">
        {index}
      </Badge>
      <div className="flex-1">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-neutral-400">{subtitle}</div>
      </div>
      <ChevronRight className="h-4 w-4 text-neutral-500" />
    </div>
  );
}

function FeatureChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[#2A2A33] bg-[#111111] px-3 py-1.5 text-neutral-300">
      {icon}
      <span>{label}</span>
    </div>
  );
}

// Trustworthy Inbox Item Card - Steps 4-9 Implementation
interface TrustworthyInboxItemCardProps {
  item: InboxItem;
  onOpenMember: () => void;
  onShowDetails: () => void;
  onDismiss: () => void;
}

function TrustworthyInboxItemCard({ item, onOpenMember, onShowDetails, onDismiss }: TrustworthyInboxItemCardProps) {
  const suggestion = item.suggestion;
  
  // Step 4: AI analyzes → "Analyzing..." spinner shows
  const getStatusIcon = () => {
    switch (item.status) {
      case "analyzing":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />;
      case "suggested":
        return <div className={`w-2 h-2 rounded-full ${getConfidenceDot(suggestion?.confidence || 0)}`} />;
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "dismissed":
        return <XCircle className="w-4 h-4 text-gray-400" />;
      case "none":
        return <span className="text-amber-400">⚠️</span>;
      case "unsupported":
        return <span className="text-red-400">⚠️</span>;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="rounded-xl border border-[#2A2A33] bg-[#0F0F13] p-3 space-y-3 hover:border-[#D4AF37]/30 transition-colors"
      data-testid={`trustworthy-item-${item.id}`}
    >
      {/* File Info with Thumbnail */}
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-16 rounded-lg bg-[#111111] border border-[#2A2A33] overflow-hidden flex items-center justify-center">
          {item.fileUrl ? (
            <img 
              src={item.fileUrl} 
              alt="" 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : null}
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white/40" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-white text-sm truncate font-medium">
            {item.filename}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            {getStatusIcon()}
            <span>
              {item.status === "analyzing" && "Analyzing..."}
              {item.status === "suggested" && suggestion && `${suggestion.confidence}% match`}
              {item.status === "accepted" && "Accepted"}
              {item.status === "dismissed" && "Dismissed"}
              {item.status === "none" && "No details found"}
              {item.status === "unsupported" && "File type not supported"}
              {item.status === "failed" && "Analysis failed"}
            </span>
            {item.fileSize && (
              <>
                <span>•</span>
                <span>{formatFileSize(item.fileSize)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Step 8: Route to profile → Suggested Destination */}
      {suggestion && item.status === "suggested" && (
        <div className="rounded-lg border border-[#2A2A33] bg-[#111111] p-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="text-white/50 text-xs">Suggested destination</div>
              <div className="text-white text-sm font-medium">
                {suggestion.memberName}
              </div>
              <div className="text-white/40 text-xs">
                Family IDs › Family Member
              </div>
            </div>
            <button
              onClick={onOpenMember}
              className="px-3 py-1.5 rounded-lg border border-[#2A2A33] text-white/80 hover:bg-white/5 transition-colors flex-shrink-0"
              data-testid="button-open-member"
            >
              Open
            </button>
          </div>
        </div>
      )}

      {/* Step 5 & 7: Lightning bolt appears + Accept/Dismiss */}
      <div className="flex items-center gap-2">
        {suggestion && item.status === "suggested" && (
          <>
            {/* Step 5: Lightning bolt appears → "⚡ Details 2" button on thumbnail */}
            <button
              onClick={onShowDetails}
              className="px-3 py-1.5 rounded-lg border border-[#2A2A33] text-white/80 hover:bg-white/5 transition-colors text-sm"
              data-testid="button-show-details"
            >
              <Zap className="w-3 h-3 mr-1 text-[#D4AF37]" />
              Details
              <span className="ml-1 px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-xs">
                {suggestion.fields?.length || 0}
              </span>
            </button>
          </>
        )}
        {/* Step 7: Accept/Dismiss → Filename suggestion handling */}
        {item.status !== "dismissed" && (
          <button
            onClick={onDismiss}
            className="px-3 py-1.5 rounded-lg border border-[#2A2A33] text-white/60 hover:bg-white/5 transition-colors text-sm"
            data-testid="button-dismiss"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}