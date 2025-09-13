// Enhanced Trustworthy Upload Center with Camera & Barcode Scanning
// Complete implementation of the Trustworthy Upload Strategy workflow
// Browse → Upload → LEFT Sidebar → AI Analysis → Lightning Bolt → Details Modal → Profile Routing

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, QrCode, Upload, X, RotateCcw, Zap, Copy, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { apiRequest } from '@/lib/queryClient';
import { CameraManager, BarcodeDetectionManager, MobileUtils } from '@/utils/cameraUtils';
import { LeftSidebar } from '../LeftSidebar';
import DetailsModal from '../DetailsModal';
import '../TrustworthyStyles.css';
import type { TrustworthyDocument, FamilyMember } from '@shared/schema';

// Trustworthy Upload States
const TRUSTWORTHY_STATES = {
  BROWSE: 'browse',
  UPLOADING: 'uploading', 
  INBOX_OPEN: 'inbox_open',
  ANALYZING: 'analyzing',
  DETAILS_READY: 'details_ready',
  MODAL_OPEN: 'modal_open'
} as const;

type TrustworthyState = typeof TRUSTWORTHY_STATES[keyof typeof TRUSTWORTHY_STATES];

interface CameraModalProps {
  isOpen: boolean;
  isBarcodeMode: boolean;
  onCapture: (file: File) => void;
  onClose: () => void;
}

// Main Enhanced Trustworthy Upload Center Component
export const EnhancedTrustworthyUploadCenter: React.FC = () => {
  // Core Trustworthy workflow state
  const [uploadState, setUploadState] = useState<TrustworthyState>(TRUSTWORTHY_STATES.BROWSE);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedDocument, setUploadedDocument] = useState<TrustworthyDocument | null>(null);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
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
  const cameraManagerRef = useRef<CameraManager | null>(null);
  const barcodeDetectorRef = useRef<BarcodeDetectionManager | null>(null);

  // TanStack Query setup
  const queryClient = useQueryClient();

  // Fetch all trustworthy documents for the left sidebar
  const { data: documents = [], isLoading: documentsLoading } = useQuery<TrustworthyDocument[]>({
    queryKey: ['/api/trustworthy/documents'],
    enabled: true, // Always fetch documents so they're ready when sidebar opens
    staleTime: 10000, // Consider data fresh for 10 seconds
  });

  // Fetch family members for profile routing
  const { data: familyMembers = [] } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family/members'],
    enabled: isDetailsModalOpen
  });

  // Upload mutation with enhanced debugging and fallback
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      console.log('Starting upload for file:', file.name, 'Size:', file.size); // Debug log
      
      const formData = new FormData();
      formData.append('document', file); // Fix: Use 'document' field name to match backend
      
      console.log('FormData prepared, making request to /api/trustworthy/upload'); // Debug log
      
      const response = await fetch('/api/trustworthy/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      console.log('Response status:', response.status); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        throw new Error(`Upload failed: ${errorText}`);
      }
      
      const result = await response.json() as TrustworthyDocument;
      console.log('Upload success:', result); // Debug log
      return result;
    },
    onSuccess: async (document: TrustworthyDocument) => {
      setUploadedDocument(document);
      
      // Automatically open left sidebar and fetch documents
      setIsLeftSidebarOpen(true);
      setUploadState(TRUSTWORTHY_STATES.INBOX_OPEN);
      
      // Refresh documents list so the new document appears immediately
      queryClient.invalidateQueries({ queryKey: ['/api/trustworthy/documents'] });
      queryClient.invalidateQueries({ queryKey: ['/api/family/members'] });
      
      // Auto-trigger AI analysis after successful upload
      setTimeout(async () => {
        setUploadState(TRUSTWORTHY_STATES.ANALYZING);
        try {
          await analysisMutation.mutateAsync(document);
        } catch (error) {
          console.error('Auto-analysis failed:', error);
          // On analysis failure, still show the document as ready for manual review
          setUploadState(TRUSTWORTHY_STATES.DETAILS_READY);
        }
      }, 1500); // Small delay to show upload success and let documents refresh
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
        setUploadState(TRUSTWORTHY_STATES.DETAILS_READY);
      }
      
      // Refresh documents list to show updated analysis status and lightning bolts
      queryClient.invalidateQueries({ queryKey: ['/api/trustworthy/documents'] });
      queryClient.invalidateQueries({ queryKey: ['/api/family/members'] });
    },
    onError: (error: Error) => {
      setError(error.message || 'AI analysis failed');
      // Set fallback analysis data on error
      if (uploadedDocument) {
        const fallbackDocument = {
          ...uploadedDocument,
          status: 'analyzed' as const,
          extractedFields: JSON.stringify({
            extractedText: 'Analysis failed - please try again',
            keyValuePairs: [],
            documentType: 'unknown',
            confidence: 0,
            summary: 'Analysis could not be completed'
          }),
          confidence: 0,
          documentType: 'unknown',
          aiConfidence: 0
        };
        setUploadedDocument(fallbackDocument);
        setUploadState(TRUSTWORTHY_STATES.DETAILS_READY);
      }
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

  // Step 1: Handle Browse button click (Enhanced Debugging)
  const handleBrowseClick = useCallback(() => {
    console.log('Browse Files clicked'); // Debug log per PDF specification
    console.log('File input ref:', fileInputRef.current); // Debug log
    
    if (!fileInputRef.current) {
      console.error('File input ref is null!'); // Debug log
      setError('File input not found. Please refresh the page.');
      return;
    }
    
    fileInputRef.current.click();
    console.log('File picker should now open'); // Debug log
  }, []);

  // Step 2: Handle Camera button click (Enhanced Debugging)
  const handleCameraClick = useCallback(async () => {
    console.log('Take Photo clicked'); // Debug log per PDF specification
    console.log('Checking camera availability...'); // Debug log
    
    try {
      const isAvailable = await CameraManager.isCameraAvailable();
      console.log('Camera availability:', isAvailable); // Debug log
      
      if (!isAvailable) {
        console.error('Camera not available on this device'); // Debug log
        setError('No camera found on this device');
        // Fallback alert per PDF specification for now
        alert('Take Photo functionality - coming soon!');
        return;
      }

      console.log('Opening camera interface...'); // Debug log
      setIsCameraOpen(true);
      setIsBarcodeMode(false);
      setCameraError(null);
    } catch (error) {
      console.error('Camera access failed:', error);
      setError('Camera access failed. Please enable camera permissions.');
      // Fallback alert per PDF specification
      alert('Take Photo functionality - coming soon!');
    }
  }, []);

  // Step 3: Handle Mobile Upload button click (Enhanced Debugging)
  const handleMobileUploadClick = useCallback(async () => {
    console.log('Mobile Upload clicked'); // Debug log per PDF specification
    
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
          familyId: 'family-1' // TODO: Get from authenticated family context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create mobile upload session');
      }

      const session = await response.json();
      console.log('Mobile upload session created:', session);
      
      setMobileUploadUrl(session.url);
      setIsQRModalOpen(true);
      setUrlCopied(false);
    } catch (error) {
      console.error('Failed to create mobile upload session:', error);
      setError('Failed to create mobile upload session. Please try again.');
    }
  }, []);

  // Step 4: Handle file upload (from browse or camera capture)
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

  // Step 5: Handle camera capture
  const handleCameraCapture = useCallback((file: File) => {
    setIsCameraOpen(false);
    setScannedBarcode(null);
    handleFileUpload([file]);
  }, [handleFileUpload]);

  // Step 6: Handle AI Analysis (Lightning Bolt click)
  const handleAnalyzeDocument = useCallback(async (documentId: string) => {
    if (!uploadedDocument) return;

    setUploadState(TRUSTWORTHY_STATES.ANALYZING);
    await analysisMutation.mutateAsync(uploadedDocument);
  }, [uploadedDocument, analysisMutation]);

  // Step 7: Handle Details Modal (Lightning Bolt click when ready)
  const handleViewDetails = useCallback((document: TrustworthyDocument) => {
    setUploadedDocument(document);
    setIsDetailsModalOpen(true);
    setUploadState(TRUSTWORTHY_STATES.MODAL_OPEN);
  }, []);

  // Step 8: Close Details Modal
  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setUploadState(TRUSTWORTHY_STATES.DETAILS_READY);
  }, []);

  // Step 9: Reset workflow
  const handleReset = useCallback(() => {
    setUploadState(TRUSTWORTHY_STATES.BROWSE);
    setUploadProgress(0);
    setUploadedDocument(null);
    setIsLeftSidebarOpen(false);
    setIsDetailsModalOpen(false);
    setError(null);
    setScannedBarcode(null);
  }, []);

  // Handle camera modal close
  const handleCloseCameraModal = useCallback(() => {
    setIsCameraOpen(false);
    setIsBarcodeMode(false);
    setScannedBarcode(null);
    setCameraError(null);
  }, []);

  return (
    <div className="enhanced-trustworthy-upload-center">
      {/* Simplified Upload Buttons for Family Home Embedding */}
      <div className="flex flex-col space-y-4">
        {uploadState === TRUSTWORTHY_STATES.BROWSE && (
          <div className="space-y-4">
            {/* Upload Button Group */}
            <div className="flex flex-wrap gap-3 justify-center">
              <motion.button
                className="flex items-center gap-2 px-4 py-3 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-[#E5C054] transition-all duration-200"
                onClick={handleBrowseClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid="button-browse-files"
              >
                <Upload size={18} />
                Browse Files
              </motion.button>
              
              <motion.button
                className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg hover:bg-[#D4AF37]/10 transition-all duration-200"
                onClick={handleCameraClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid="button-camera-capture"
              >
                <Camera size={18} />
                Take Photo
              </motion.button>
              
              <motion.button
                className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg hover:bg-[#D4AF37]/10 transition-all duration-200"
                onClick={handleMobileUploadClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid="button-mobile-upload"
              >
                <QrCode size={18} />
                Mobile Upload
              </motion.button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-sm text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg" data-testid="error-message">
                {error}
              </div>
            )}
          </div>
        )}

        {uploadState === TRUSTWORTHY_STATES.UPLOADING && (
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 border-2 border-gray-600 border-t-[#D4AF37] rounded-full animate-spin"></div>
              <span data-testid="upload-progress">Uploading... {Math.round(uploadProgress)}%</span>
            </div>
          </div>
        )}

        {(uploadState === TRUSTWORTHY_STATES.INBOX_OPEN || 
          uploadState === TRUSTWORTHY_STATES.ANALYZING || 
          uploadState === TRUSTWORTHY_STATES.DETAILS_READY || 
          uploadState === TRUSTWORTHY_STATES.MODAL_OPEN) && (
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 text-[#D4AF37]">
              <Zap size={20} />
              <span>Document uploaded successfully!</span>
            </div>
            <button 
              className="px-4 py-2 text-sm bg-[#1a1a1a] text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg hover:bg-[#D4AF37]/10 transition-all duration-200"
              onClick={handleReset} 
              data-testid="button-upload-another"
            >
              Upload Another
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

      {/* LEFT Sidebar - Trustworthy workflow component */}
      <LeftSidebar
        isVisible={isLeftSidebarOpen}
        documents={documents}
        onDocumentSelect={(doc) => setUploadedDocument(doc)}
        onAnalyzeDocument={handleAnalyzeDocument}
        onShowDetails={handleViewDetails}
        onClose={() => setIsLeftSidebarOpen(false)}
        selectedDocumentId={uploadedDocument?.id}
        isLoading={documentsLoading}
      />

      {/* Details Modal - Trustworthy workflow component */}
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
        onClose={handleCloseCameraModal}
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
};

// Remove the MainUploadArea component - replaced with inline simplified version

// Remove the old state components - replaced with inline simplified versions

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

          // Start barcode detection if in barcode mode
          if (isBarcodeMode && videoRef.current) {
            barcodeDetectorRef.current = new BarcodeDetectionManager();
            await barcodeDetectorRef.current.initialize();
            
            barcodeDetectorRef.current.startDetection(videoRef.current, (result) => {
              setScannedBarcode(result.value);
              // Auto-capture after 1 second when barcode is detected
              setTimeout(() => {
                handleCapture();
              }, 1000);
            });
          }
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
        filename: isBarcodeMode ? 
          `barcode_${Date.now()}.jpg` : 
          `camera_${Date.now()}.jpg`
      });
      
      onCapture(captureResult.file);
    } catch (error) {
      console.error('Photo capture failed:', error);
    }
  }, [isBarcodeMode, onCapture]);

  // Handle camera switch
  const handleSwitchCamera = useCallback(async () => {
    if (!cameraManagerRef.current) return;

    try {
      await cameraManagerRef.current.switchCamera();
    } catch (error) {
      console.error('Camera switch failed:', error);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="camera-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="camera-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="camera-header">
            <h3>
              <Camera size={20} />
              Take Photo
            </h3>
            <button 
              className="camera-close-btn" 
              onClick={onClose}
              data-testid="button-close-camera"
            >
              <X size={20} />
            </button>
          </div>

          <div className="camera-content">
            <div className="camera-viewport">
              {permissionDenied ? (
                <div className="camera-permission-denied">
                  <div className="icon">📷</div>
                  <h3>Camera Access Required</h3>
                  <p>Please enable camera permissions to capture documents and scan barcodes.</p>
                  <button onClick={() => window.location.reload()}>
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
                    className="camera-video"
                    data-testid="camera-video"
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  
                  {/* Barcode scanning overlay */}
                  {isBarcodeMode && cameraReady && (
                    <div className="barcode-overlay">
                      <div className="barcode-frame">
                        <div className="corner top-left"></div>
                        <div className="corner top-right"></div>
                        <div className="corner bottom-left"></div>
                        <div className="corner bottom-right"></div>
                      </div>
                      <p className="barcode-instruction">
                        Position barcode within the frame
                      </p>
                      {scannedBarcode && (
                        <div className="barcode-detected" data-testid="barcode-detected">
                          ✅ Barcode detected: {scannedBarcode}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Photo capture overlay */}
                  {!isBarcodeMode && cameraReady && (
                    <div className="photo-overlay">
                      <div className="photo-frame"></div>
                      <p className="photo-instruction">
                        Position document within the frame
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {cameraReady && !permissionDenied && (
              <div className="camera-controls">
                <button 
                  className="camera-control-btn cancel" 
                  onClick={onClose}
                  data-testid="button-cancel-camera"
                >
                  Cancel
                </button>
                
                <motion.button
                  className="camera-control-btn capture"
                  onClick={handleCapture}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid="button-capture-photo"
                >
                  <div className="capture-button-inner">
                    <Camera size={24} />
                  </div>
                </motion.button>
                
                <button 
                  className="camera-control-btn switch" 
                  onClick={handleSwitchCamera}
                  data-testid="button-switch-camera"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            )}

            {/* Camera Tips */}
            {cameraReady && !permissionDenied && (
              <div className="camera-tips">
                <h4>💡 Tips for best results:</h4>
                <ul>
                  <li>Ensure good lighting</li>
                  <li>Hold camera steady</li>
                  <li>Fill the frame with document</li>
                  <li>Avoid shadows and glare</li>
                  {isBarcodeMode && (
                    <li>Center barcode in frame for automatic detection</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// QR Code Modal Component for Mobile Upload
interface QRCodeModalProps {
  isOpen: boolean;
  url: string;
  onClose: () => void;
  onCopyUrl: () => void;
  urlCopied: boolean;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ 
  isOpen, 
  url, 
  onClose, 
  onCopyUrl, 
  urlCopied 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-md w-full shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#D4AF37]/10">
              <QrCode className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Mobile Upload</h2>
              <p className="text-sm text-gray-400">Scan with your phone to upload documents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            data-testid="button-close-qr-modal"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <QRCodeSVG
              value={url}
              size={200}
              level="M"
              includeMargin={true}
              fgColor="#000000"
              bgColor="#ffffff"
            />
          </div>

          {/* Instructions */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-white">How to use:</h3>
            <ol className="text-sm text-gray-300 space-y-1 text-left">
              <li>1. Open your phone's camera app</li>
              <li>2. Point at the QR code above</li>
              <li>3. Tap the notification to open the link</li>
              <li>4. Upload documents directly from your phone</li>
            </ol>
          </div>

          {/* URL Copy Option */}
          <div className="w-full">
            <p className="text-xs text-gray-400 mb-2">Or copy the link:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-[#D4AF37]/50"
                data-testid="input-mobile-url"
              />
              <button
                onClick={onCopyUrl}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  urlCopied 
                    ? 'bg-green-600 text-white' 
                    : 'bg-[#D4AF37] text-black hover:bg-[#E5C054]'
                }`}
                data-testid="button-copy-url"
              >
                {urlCopied ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-zinc-800 text-gray-300 rounded-lg hover:bg-zinc-700 transition-colors"
            data-testid="button-close-modal"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedTrustworthyUploadCenter;