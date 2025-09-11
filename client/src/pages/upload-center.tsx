import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Image as ImageIcon, Camera, Zap, X, AlertCircle, Clock } from "lucide-react";
import { useUploadStore } from "@/stores/uploadStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Types for upload state management
interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error' | 'analyzing';
  error?: string;
  canRetry?: boolean;
  eta?: number;
  analysis?: {
    detailsCount: number;
    extractedData: Record<string, any>;
    extractedText: string;
  };
}

// Client-side validation
const ALLOWED_TYPES = [
  'image/', 
  'application/pdf', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword', 
  'text/plain'
];

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

function validateFile(file: File) {
  const okType = ALLOWED_TYPES.some(type => file.type.startsWith(type));
  if (!okType) {
    throw new Error(`"${file.name}" is not supported. Allowed: images, PDF, DOC/DOCX, TXT.`);
  }
  if (file.size > MAX_SIZE) {
    throw new Error(`"${file.name}" is ${Math.round(file.size/1e6)}MB. Max is 25MB. Try compressing or upload PDF.`);
  }
}

// Convert file to base64 for API
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// Analyze document via backend API (secure)
async function analyzeDocument(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch('/api/ai-inbox/analyze', {
    method: 'POST',
    body: formData
  });
  
  if (!res.ok) throw new Error('Analysis failed');
  return await res.json();
}

export default function UploadCenter() {
  const [isOver, setIsOver] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addUpload } = useUploadStore();

  // Handle file uploads
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = files instanceof FileList ? Array.from(files) : files;
    
    for (const file of fileArray) {
      const uploadFile: UploadFile = {
        id: `upload-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading'
      };

      // Add to queue first, then validate
      setUploadQueue(prev => [...prev, uploadFile]);

      try {
        // Client-side validation
        validateFile(file);

        // Simulate upload progress
        await simulateUpload(uploadFile.id);
        
        // Start analysis after upload
        await analyzeFile(uploadFile.id);
        
      } catch (error: any) {
        setUploadQueue(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'error', error: error.message, canRetry: true }
            : f
        ));
      }
    }
  };

  // Simulate upload progress
  const simulateUpload = async (fileId: string) => {
    return new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadQueue(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: 100, status: 'complete', eta: 0 }
              : f
          ));
          resolve();
        } else {
          const eta = Math.round((100 - progress) / 10);
          setUploadQueue(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: Math.round(progress), eta: eta }
              : f
          ));
        }
      }, 200);
    });
  };

  // Analyze file after upload
  const analyzeFile = async (fileId: string) => {
    const uploadFile = uploadQueue.find(f => f.id === fileId);
    if (!uploadFile) return;

    setUploadQueue(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'analyzing' } : f
    ));

    try {
      const result = await analyzeDocument(uploadFile.file);
      const detailsCount = result.extractedData ? Object.keys(result.extractedData).length : 0;
      
      setUploadQueue(prev => prev.map(f => 
        f.id === fileId 
          ? { 
              ...f, 
              status: 'complete',
              analysis: {
                detailsCount,
                extractedData: result.extractedData || {},
                extractedText: result.extractedText || ''
              }
            }
          : f
      ));

      // Add to global store for sidebar inbox
      addUpload({
        id: Date.now(),
        name: uploadFile.name,
        file: uploadFile.file,
        status: 'complete',
        mode: 'auto',
        analyzed: true,
        uploadedAt: new Date(),
        result: {
          extractedData: result.extractedData || {},
          extractedText: result.extractedText || ''
        }
      });

    } catch (error: any) {
      setUploadQueue(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'error', error: 'Analysis failed. Try again.', canRetry: true }
          : f
      ));
    }
  };

  // Cancel upload
  const cancelUpload = (fileId: string) => {
    setUploadQueue(prev => prev.filter(f => f.id !== fileId));
  };

  // Retry upload
  const retryUpload = async (fileId: string) => {
    const uploadFile = uploadQueue.find(f => f.id === fileId);
    if (!uploadFile) return;

    setUploadQueue(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status: 'uploading', progress: 0, error: undefined }
        : f
    ));

    try {
      await simulateUpload(fileId);
      await analyzeFile(fileId);
    } catch (error: any) {
      setUploadQueue(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'error', error: error.message, canRetry: true }
          : f
      ));
    }
  };

  // Handle paste from clipboard
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = e.clipboardData?.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#e5e7eb] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Center</h1>
          <p className="text-[#9ca3af]">
            Drag & drop files, paste from clipboard, or browse to upload. 
            AI analysis happens automatically.
          </p>
        </div>

        {/* Main Drop Zone */}
        <Card className="bg-[#111827] border-[#374151] mb-6">
          <CardContent className="p-8">
            <div
              role="button"
              tabIndex={0}
              onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
              onDragLeave={() => setIsOver(false)}
              onDrop={(e) => { 
                e.preventDefault(); 
                setIsOver(false); 
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              data-testid="upload-drop-zone"
              className={`
                border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200
                min-h-[200px] flex flex-col items-center justify-center
                ${isOver 
                  ? 'border-[#60a5fa] bg-[#60a5fa]/10 shadow-[0_0_0_2px_rgba(96,165,250,0.3)]' 
                  : 'border-[#374151] bg-[#111827] hover:border-[#4b5563] hover:bg-[#1f2937]'
                }
              `}
              aria-label="Upload files by dragging and dropping or clicking to browse"
            >
              <Upload className={`w-16 h-16 mb-4 ${isOver ? 'text-[#60a5fa]' : 'text-[#9ca3af]'}`} />
              <p className="text-lg mb-2">
                {isOver ? 'Release to upload' : 'Drag files here or click to upload'}
              </p>
              <p className="text-sm text-[#9ca3af] mb-4">
                Images, PDF, DOC/DOCX, TXT • Max 25MB each
              </p>
              
              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap justify-center">
                <Button
                  variant="outline"
                  className="border-[#374151] text-[#e5e7eb] hover:bg-[#374151]"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  data-testid="button-browse-files"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
                
                {/* Camera button for mobile */}
                <Button
                  variant="outline"
                  className="border-[#374151] text-[#e5e7eb] hover:bg-[#374151] md:hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Camera input will be handled by the file input with capture attribute
                    fileInputRef.current?.click();
                  }}
                  data-testid="button-take-photo"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
                capture="environment"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                data-testid="input-file"
              />
            </div>
          </CardContent>
        </Card>

        {/* Upload Queue */}
        {uploadQueue.length > 0 && (
          <Card className="bg-[#111827] border-[#374151]">
            <CardHeader>
              <CardTitle className="text-[#e5e7eb]">Uploads ({uploadQueue.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" aria-live="polite" aria-label="Upload progress">
                {uploadQueue.map(file => (
                  <UploadFileRow
                    key={file.id}
                    file={file}
                    onCancel={() => cancelUpload(file.id)}
                    onRetry={() => retryUpload(file.id)}
                    onShowDetails={(f) => {
                      setSelectedFile(f);
                      setShowDetailsModal(true);
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Details Modal */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="bg-[#111827] border-[#374151] text-[#e5e7eb] max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Document Analysis Results
              </DialogTitle>
            </DialogHeader>
            {selectedFile && selectedFile.analysis && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-[#374151]">
                  <div className="h-10 w-10 rounded-lg grid place-items-center bg-[#0f172a] border border-[#374151]">
                    {selectedFile.type.startsWith('image/') ? (
                      <ImageIcon className="h-5 w-5 text-[#9ca3af]" />
                    ) : (
                      <FileText className="h-5 w-5 text-[#9ca3af]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedFile.name}</h3>
                    <p className="text-sm text-[#9ca3af]">
                      {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>

                {selectedFile.analysis.extractedData && Object.keys(selectedFile.analysis.extractedData).length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-[#d97706]">Extracted Information</h4>
                    <div className="grid gap-3">
                      {Object.entries(selectedFile.analysis.extractedData).map(([key, value]) => (
                        <div key={key} className="bg-[#0f172a] border border-[#374151] rounded-lg p-3">
                          <div className="text-sm font-medium text-[#9ca3af] capitalize mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-sm text-[#e5e7eb]">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFile.analysis.extractedText && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-[#d97706]">Full Text</h4>
                    <div className="bg-[#0f172a] border border-[#374151] rounded-lg p-3 max-h-40 overflow-y-auto">
                      <pre className="text-sm text-[#9ca3af] whitespace-pre-wrap">
                        {selectedFile.analysis.extractedText}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Individual upload file row component
function UploadFileRow({ 
  file, 
  onCancel, 
  onRetry, 
  onShowDetails 
}: { 
  file: UploadFile;
  onCancel: () => void;
  onRetry: () => void;
  onShowDetails: (file: UploadFile) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#374151] last:border-b-0">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* File Icon/Thumbnail */}
        <div className="h-10 w-10 rounded-lg grid place-items-center bg-[#0f172a] border border-[#374151] flex-shrink-0">
          {file.type.startsWith('image/') ? (
            file.file ? (
              <img 
                src={URL.createObjectURL(file.file)} 
                alt="" 
                className="w-10 h-10 object-cover rounded-lg border border-[#374151]" 
              />
            ) : (
              <ImageIcon className="h-5 w-5 text-[#9ca3af]" />
            )
          ) : (
            <FileText className="h-5 w-5 text-[#9ca3af]" />
          )}
        </div>

        {/* File Info */}
        <div className="min-w-0 flex-1">
          <div className="truncate text-[#e5e7eb] text-sm font-medium">{file.name}</div>
          <div className="text-xs text-[#9ca3af] mb-1">
            {(file.size / 1024 / 1024).toFixed(1)} MB
          </div>
          
          {/* Progress Bar */}
          {file.status === 'uploading' && (
            <>
              <div className="h-1 bg-[#374151] rounded mt-1">
                <div 
                  className="h-1 bg-[#60a5fa] rounded transition-all duration-300" 
                  style={{ width: `${file.progress}%` }} 
                />
              </div>
              <div className="text-xs text-[#9ca3af] mt-1 flex items-center gap-2">
                <span>{file.progress}%</span>
                {file.eta && (
                  <>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>~{file.eta}s left</span>
                  </>
                )}
              </div>
            </>
          )}

          {/* Status Messages */}
          {file.status === 'analyzing' && (
            <div className="text-xs text-[#d97706] mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3 animate-pulse" />
              Analyzing document...
            </div>
          )}

          {file.status === 'complete' && !file.error && (
            <div className="text-xs text-[#10b981] mt-1">Upload complete</div>
          )}

          {/* Error Message */}
          {file.error && (
            <div className="mt-2 rounded-md border border-[#ef4444] bg-[#ef4444]/20 text-[#fca5a5] p-2 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  {file.error}
                  {file.canRetry && (
                    <button 
                      onClick={onRetry} 
                      className="ml-3 underline hover:no-underline"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Details Button */}
        {file.status === 'complete' && file.analysis && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs border-[#d97706] text-[#d97706] hover:bg-[#d97706]/10"
            onClick={() => onShowDetails(file)}
            data-testid={`button-details-${file.id}`}
          >
            <Zap className="w-3 h-3 mr-1" />
            Details {file.analysis.detailsCount}
          </Button>
        )}

        {/* Cancel Button */}
        {file.status !== 'complete' && (
          <button
            onClick={onCancel}
            className="text-xs text-[#9ca3af] hover:text-[#e5e7eb] p-1"
            aria-label={`Cancel upload of ${file.name}`}
            data-testid={`button-cancel-${file.id}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}