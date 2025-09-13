import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Camera, 
  QrCode, 
  Upload, 
  X, 
  Zap, 
  Copy, 
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Sparkles,
  FileImage,
  Eye
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { CameraManager, BarcodeDetectionManager, MobileUtils } from '@/utils/cameraUtils';
import DetailsModal from '@/components/upload/DetailsModal';
import type { TrustworthyDocument, FamilyMember } from '@shared/schema';

// Trustworthy Upload States
const TRUSTWORTHY_STATES = {
  BROWSE: 'browse',
  UPLOADING: 'uploading', 
  ANALYZING: 'analyzing',
  COMPLETE: 'complete'
} as const;

type TrustworthyState = typeof TRUSTWORTHY_STATES[keyof typeof TRUSTWORTHY_STATES];
type DocumentStatus = 'uploaded' | 'analyzing' | 'analyzed' | 'error';

// Type guard for safe status handling
const isDocumentStatus = (status: string): status is DocumentStatus => {
  return ['uploaded', 'analyzing', 'analyzed', 'error'].includes(status);
};

// Safe status getter with fallback
const getSafeStatus = (status: string | undefined | null): DocumentStatus => {
  if (!status || !isDocumentStatus(status)) {
    return 'uploaded'; // Safe fallback
  }
  return status;
};

interface CameraModalProps {
  isOpen: boolean;
  isBarcodeMode: boolean;
  onCapture: (file: File) => void;
  onClose: () => void;
}

interface QRCodeModalProps {
  isOpen: boolean;
  url: string;
  onClose: () => void;
  onCopyUrl: () => void;
  urlCopied: boolean;
}

export default function Inbox() {
  // Core Trustworthy workflow state
  const [uploadState, setUploadState] = useState<TrustworthyState>(TRUSTWORTHY_STATES.BROWSE);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedDocument, setUploadedDocument] = useState<TrustworthyDocument | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Camera functionality state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isBarcodeMode, setIsBarcodeMode] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // QR Code functionality state
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [mobileUploadUrl, setMobileUploadUrl] = useState<string>('');
  const [urlCopied, setUrlCopied] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const cameraManagerRef = useRef<CameraManager | null>(null);
  const barcodeDetectorRef = useRef<BarcodeDetectionManager | null>(null);

  // TanStack Query setup
  const queryClient = useQueryClient();

  // Fetch all trustworthy documents for suggestions
  const { data: documentsResponse, isLoading: documentsLoading } = useQuery<{success: boolean, documents: TrustworthyDocument[], count: number}>({
    queryKey: ['/api/trustworthy/documents'],
    enabled: true,
    staleTime: 10000,
  });
  
  // Extract documents from API response format: {success: true, documents: [...]}
  const documents = documentsResponse?.documents || [];

  // Fetch family members for profile routing
  const { data: familyMembers = [] } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family/members'],
    enabled: isDetailsModalOpen
  });

  // Upload mutation with enhanced debugging and fallback
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      console.log('Starting upload for file:', file.name, 'Size:', file.size);
      
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await fetch('/api/trustworthy/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        throw new Error(`Upload failed: ${errorText}`);
      }
      
      const result = await response.json() as TrustworthyDocument;
      return result;
    },
    onSuccess: async (document: TrustworthyDocument) => {
      setUploadedDocument(document);
      setUploadState(TRUSTWORTHY_STATES.ANALYZING);
      
      // Force refresh documents list so the new document appears immediately
      await queryClient.invalidateQueries({ queryKey: ['/api/trustworthy/documents'] });
      await queryClient.refetchQueries({ queryKey: ['/api/trustworthy/documents'] });
      
      // Auto-trigger AI analysis after successful upload
      setTimeout(async () => {
        try {
          await analysisMutation.mutateAsync(document);
        } catch (error) {
          console.error('Auto-analysis failed:', error);
          setUploadState(TRUSTWORTHY_STATES.COMPLETE);
        }
      }, 1500);
    },
    onError: (error: Error) => {
      setError(error.message || 'Upload failed');
      setUploadState(TRUSTWORTHY_STATES.BROWSE);
    }
  });

  // AWS Lambda + OpenAI Analysis integration
  const analysisMutation = useMutation({
    mutationFn: async (document: TrustworthyDocument) => {
      // Call your existing AWS Lambda endpoint for real AI analysis
      const response = await fetch('/api/trustworthy/lambda-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          documentUrl: document.filePath,
          documentType: document.mimeType,
          fileName: document.originalFilename,
          documentId: document.id
        })
      });

      if (!response.ok) {
        // If Lambda fails, try Textract as fallback
        console.log('Lambda analysis failed, trying Textract fallback...');
        const textractResponse = await fetch('/api/trustworthy/textract-analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            documentUrl: document.filePath,
            documentId: document.id
          })
        });

        if (!textractResponse.ok) {
          throw new Error(`Analysis failed: ${response.statusText}`);
        }

        return await textractResponse.json();
      }

      return await response.json();
    },
    onSuccess: (analysisResult: any) => {
      console.log('AI Analysis completed:', analysisResult);
      
      if (uploadedDocument) {
        const updatedDocument = {
          ...uploadedDocument,
          status: 'analyzed' as const,
          extractedFields: JSON.stringify({
            extractedText: analysisResult.extractedText || '',
            keyValuePairs: analysisResult.keyValuePairs || [],
            documentType: analysisResult.documentType || 'unknown',
            confidence: analysisResult.confidence || 0,
            summary: analysisResult.summary || ''
          }),
          confidence: analysisResult.confidence || 0,
          documentType: analysisResult.documentType || 'unknown',
          aiConfidence: Math.round((analysisResult.confidence || 0) * 100)
        };
        setUploadedDocument(updatedDocument);
        setUploadState(TRUSTWORTHY_STATES.COMPLETE);
      }
      
      // Refresh documents list to show updated analysis status
      queryClient.invalidateQueries({ queryKey: ['/api/trustworthy/documents'] });
    },
    onError: (error: Error) => {
      setError(error.message || 'AI analysis failed');
      setUploadState(TRUSTWORTHY_STATES.COMPLETE);
    }
  });

  // Initialize camera utilities
  useEffect(() => {
    cameraManagerRef.current = new CameraManager();
    barcodeDetectorRef.current = new BarcodeDetectionManager();
    
    // Initialize barcode detector
    barcodeDetectorRef.current.initialize();

    return () => {
      // Cleanup camera resources
      if (cameraManagerRef.current) {
        cameraManagerRef.current.stopCamera();
      }
      if (barcodeDetectorRef.current) {
        barcodeDetectorRef.current.stopDetection();
      }
    };
  }, []);

  // Handle Browse button click
  const handleBrowseClick = useCallback(() => {
    console.log('Browse Files clicked');
    
    if (!fileInputRef.current) {
      setError('File input not found. Please refresh the page.');
      return;
    }
    
    fileInputRef.current.click();
  }, []);

  // Handle Camera button click
  const handleCameraClick = useCallback(async () => {
    console.log('Take Photo clicked');
    
    try {
      const isAvailable = await CameraManager.isCameraAvailable();
      
      if (!isAvailable) {
        setError('No camera found on this device');
        alert('Take Photo functionality - coming soon!');
        return;
      }

      setIsCameraOpen(true);
      setIsBarcodeMode(false);
      setCameraError(null);
    } catch (error) {
      console.error('Camera access failed:', error);
      setError('Camera access failed. Please enable camera permissions.');
      alert('Take Photo functionality - coming soon!');
    }
  }, []);

  // Handle Mobile Upload button click
  const handleMobileUploadClick = useCallback(async () => {
    console.log('Mobile Upload clicked');
    
    try {
      // Create secure mobile upload session via API
      const response = await fetch('/api/mobile-upload/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          purpose: 'documents',
          familyId: 'family-1'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create mobile upload session');
      }

      const session = await response.json();
      setMobileUploadUrl(session.url);
      setIsQRModalOpen(true);
      setUrlCopied(false);
    } catch (error) {
      console.error('Failed to create mobile upload session:', error);
      setError('Failed to create mobile upload session. Please try again.');
    }
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/heic',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload PDF, DOC, or image files.');
      return;
    }

    setError(null);
    setUploadState(TRUSTWORTHY_STATES.UPLOADING);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await uploadMutation.mutateAsync(file);
      setUploadProgress(100);
      clearInterval(progressInterval);
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
    }
  }, [uploadMutation]);

  // Handle camera capture
  const handleCameraCapture = useCallback((file: File) => {
    setIsCameraOpen(false);
    setScannedBarcode(null);
    handleFileUpload([file]);
  }, [handleFileUpload]);

  // Handle Details Modal
  const handleViewDetails = useCallback((document: TrustworthyDocument) => {
    setUploadedDocument(document);
    setIsDetailsModalOpen(true);
  }, []);

  // Close Details Modal
  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
  }, []);

  // Reset workflow
  const handleReset = useCallback(() => {
    setUploadState(TRUSTWORTHY_STATES.BROWSE);
    setUploadProgress(0);
    setUploadedDocument(null);
    setIsDetailsModalOpen(false);
    setError(null);
    setScannedBarcode(null);
  }, []);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  // Status badge component
  const StatusBadge: React.FC<{ status: DocumentStatus }> = ({ status }) => {
    const statusConfig = {
      uploaded: { 
        icon: Upload, 
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        label: 'Uploaded' 
      },
      analyzing: { 
        icon: Clock, 
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        label: 'Analyzing...' 
      },
      analyzed: { 
        icon: CheckCircle, 
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        label: 'Complete' 
      },
      error: { 
        icon: AlertCircle, 
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        label: 'Error' 
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;

    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-medium ${config.color}`}>
        <IconComponent size={12} />
        {config.label}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FileText className="h-8 w-8 text-[#D4AF37]" />
            <h1 className="text-3xl font-bold">Inbox</h1>
            <button
              className="ml-4 p-2 text-gray-400 hover:text-white transition-colors"
              data-testid="button-close-inbox"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-gray-400">
            Drop files, forward emails, or browse to add documents to your family vault.
          </p>
        </div>

        {/* Upload Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <motion.button
            className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-[#E5C054] transition-all duration-200"
            onClick={handleBrowseClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="button-browse-files"
          >
            <Upload size={20} />
            Browse Files
          </motion.button>
          
          <motion.button
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
            onClick={handleCameraClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="button-take-photo"
          >
            <Camera size={20} />
            Take Photo
          </motion.button>
          
          <motion.button
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-200"
            onClick={handleMobileUploadClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="button-mobile-upload"
          >
            <QrCode size={20} />
            Mobile Upload
          </motion.button>
        </div>

        {/* Drag & Drop Area */}
        <div 
          ref={dropZoneRef}
          className="border-2 border-dashed border-[#D4AF37]/30 rounded-xl p-12 text-center bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 transition-all duration-200"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-testid="drag-drop-area"
        >
          <Upload className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Drag & drop files here</h3>
          <p className="text-gray-400 mb-4">or <button className="text-[#D4AF37] hover:text-[#E5C054] underline" onClick={handleBrowseClick}>browse to choose files</button></p>
          <p className="text-sm text-gray-500">Supports PDF, Word docs, images, and more</p>
        </div>

        {/* Upload Progress */}
        {uploadState === TRUSTWORTHY_STATES.UPLOADING && (
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-6 h-6 border-2 border-gray-600 border-t-[#D4AF37] rounded-full animate-spin"></div>
              <span data-testid="upload-progress">Uploading... {Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Analyzing State */}
        {uploadState === TRUSTWORTHY_STATES.ANALYZING && (
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Zap className="h-6 w-6 text-[#D4AF37] animate-pulse" />
              <span className="text-lg font-medium">Analyzing document...</span>
            </div>
            <p className="text-gray-400">AI is extracting key details and finding matching family members</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-red-400">
              <AlertCircle size={20} />
              <span data-testid="error-message">{error}</span>
            </div>
          </div>
        )}

        {/* Autofill Suggestions Section */}
        <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-[#D4AF37]" />
            <h3 className="text-lg font-semibold">Autofill suggestions</h3>
          </div>
          <p className="text-gray-400 mb-6">
            We'll detect file type, extract key details, and suggest a destination.
          </p>
          
          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h4 className="font-medium text-white">Add your files to Inbox</h4>
                <p className="text-sm text-gray-400">Drag & drop, browse, or forward by email</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h4 className="font-medium text-white">We automatically find insights</h4>
                <p className="text-sm text-gray-400">Extract details, summaries, and destinations</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h4 className="font-medium text-white">Organize with one click</h4>
                <p className="text-sm text-gray-400">Accept suggestions to file docs into the right place</p>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Circle className="h-4 w-4" />
              <span>Encrypted at rest</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Circle className="h-4 w-4" />
              <span>Mobile capture</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Circle className="h-4 w-4" />
              <span>Email to inbox</span>
            </div>
          </div>
        </div>

        {/* Suggestions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Suggestions</h3>
            <button className="text-[#D4AF37] hover:text-[#E5C054] text-sm font-medium">
              View all
            </button>
          </div>

          {documentsLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 mx-auto mb-4">
                <Clock className="w-8 h-8 animate-spin text-[#D4AF37]" />
              </div>
              <div className="text-gray-400 text-sm">Loading suggestions...</div>
            </div>
          ) : documents.length > 0 ? (
            <div className="space-y-3">
              {documents.slice(0, 3).map((document) => (
                <div key={document.id} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    {/* Document Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-400" />
                    </div>
                    
                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white truncate">{document.filename}</h4>
                        <StatusBadge status={getSafeStatus(document.status)} />
                      </div>
                      
                      {document.personIdentified && (
                        <div className="text-sm text-gray-400 mb-2">
                          Suggested: <span className="text-[#D4AF37]">{document.personIdentified}</span> • Family Member
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        {document.uploadTime ? new Date(document.uploadTime).toLocaleDateString() : 'Unknown'} • 
                        {document.documentType || 'Document'}
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    {document.status === 'analyzed' && (
                      <motion.button
                        className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-medium hover:bg-[#E5C054] transition-colors"
                        onClick={() => handleViewDetails(document)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        data-testid={`button-open-${document.id}`}
                      >
                        Open
                      </motion.button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-300 mb-2">No files to review</h4>
              <p className="text-gray-500">Upload documents to see AI analysis and suggestions here</p>
            </div>
          )}
        </div>

        {/* Success Message */}
        {uploadState === TRUSTWORTHY_STATES.COMPLETE && (
          <div className="text-center py-6">
            <div className="flex items-center justify-center space-x-2 text-[#D4AF37] mb-4">
              <CheckCircle size={24} />
              <span className="text-lg font-medium">Document uploaded and analyzed successfully!</span>
            </div>
            <button 
              className="px-6 py-2 bg-[#D4AF37] text-black rounded-lg font-medium hover:bg-[#E5C054] transition-colors"
              onClick={handleReset} 
              data-testid="button-upload-another"
            >
              Upload Another Document
            </button>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.heic"
        style={{ display: 'none' }}
        data-testid="input-trustworthy-files"
      />

      {/* Details Modal */}
      {uploadedDocument && (
        <DetailsModal
          document={uploadedDocument}
          isVisible={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
        />
      )}

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        isBarcodeMode={isBarcodeMode}
        onCapture={handleCameraCapture}
        onClose={() => setIsCameraOpen(false)}
      />

      {/* QR Code Modal for Mobile Upload */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        url={mobileUploadUrl}
        onClose={() => setIsQRModalOpen(false)}
        onCopyUrl={() => {
          navigator.clipboard.writeText(mobileUploadUrl);
          setUrlCopied(true);
          setTimeout(() => setUrlCopied(false), 2000);
        }}
        urlCopied={urlCopied}
      />
    </div>
  );
}

// Camera Modal Component
const CameraModal: React.FC<CameraModalProps> = ({ 
  isOpen, 
  isBarcodeMode, 
  onCapture, 
  onClose 
}) => {
  const [cameraReady, setCameraReady] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraManagerRef = useRef<CameraManager | null>(null);
  const barcodeDetectorRef = useRef<BarcodeDetectionManager | null>(null);

  // Initialize camera when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const initializeCamera = async () => {
      try {
        cameraManagerRef.current = new CameraManager();
        
        if (videoRef.current && canvasRef.current) {
          await cameraManagerRef.current.initializeCamera(
            videoRef.current, 
            canvasRef.current
          );
          setCameraReady(true);
          setPermissionDenied(false);
        }
      } catch (error) {
        console.error('Camera initialization failed:', error);
        setPermissionDenied(true);
        setCameraReady(false);
      }
    };

    initializeCamera();

    // Cleanup function
    return () => {
      if (cameraManagerRef.current) {
        cameraManagerRef.current.stopCamera();
      }
      if (barcodeDetectorRef.current) {
        barcodeDetectorRef.current.stopDetection();
      }
    };
  }, [isOpen, isBarcodeMode]);

  // Handle photo capture
  const handleCapture = useCallback(async () => {
    if (!cameraManagerRef.current) return;

    try {
      const captureResult = await cameraManagerRef.current.capturePhoto({
        quality: 0.9,
        filename: `camera_${Date.now()}.jpg`
      });
      
      onCapture(captureResult.file);
    } catch (error) {
      console.error('Photo capture failed:', error);
    }
  }, [onCapture]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-2xl mx-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Camera size={20} className="text-[#D4AF37]" />
              <h3 className="text-lg font-semibold">Take Photo</h3>
            </div>
            <button 
              className="text-gray-400 hover:text-white transition-colors" 
              onClick={onClose}
              data-testid="button-close-camera"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              {permissionDenied ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <Camera className="h-12 w-12 text-gray-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Camera Access Required</h3>
                  <p className="text-gray-400 mb-4">Please enable camera permissions to capture documents.</p>
                  <button 
                    className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-medium hover:bg-[#E5C054] transition-colors"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    data-testid="camera-video"
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </>
              )}
            </div>

            {cameraReady && (
              <div className="flex justify-center">
                <button
                  className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-[#E5C054] transition-colors"
                  onClick={handleCapture}
                  data-testid="button-capture-photo"
                >
                  Capture Photo
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// QR Code Modal Component
const QRCodeModal: React.FC<QRCodeModalProps> = ({ 
  isOpen, 
  url, 
  onClose, 
  onCopyUrl, 
  urlCopied 
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-md mx-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <QrCode size={20} className="text-[#D4AF37]" />
              <h3 className="text-lg font-semibold">Mobile Upload</h3>
            </div>
            <button 
              className="text-gray-400 hover:text-white transition-colors" 
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 text-center">
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              <QRCodeSVG value={url} size={200} />
            </div>
            <p className="text-gray-400 mb-4">
              Scan this QR code with your phone to upload files directly to your family vault.
            </p>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors mx-auto"
              onClick={onCopyUrl}
            >
              {urlCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
              {urlCopied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Add missing Circle icon component
const Circle: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`rounded-full border-2 border-current ${className}`} style={{ width: '1em', height: '1em' }} />
);