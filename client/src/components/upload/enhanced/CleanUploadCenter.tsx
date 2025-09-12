// Clean Upload Center - Three upload methods: Browse Files, Take Photo, Mobile Upload
// No barcode scanning - Clean professional interface with dark gold theme

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Smartphone, Upload, X, RotateCcw, Zap, Copy, CheckCircle, Loader2, FileText } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { apiRequest } from '@/lib/queryClient';
import InboxPanel from '@/components/family/inbox-panel';
import DetailsModal from '../DetailsModal';
import type { TrustworthyDocument, FamilyMember } from '@shared/schema';

// Upload States
const UPLOAD_STATES = {
  READY: 'ready',
  UPLOADING: 'uploading', 
  PROCESSING: 'processing',
  COMPLETE: 'complete'
} as const;

type UploadState = typeof UPLOAD_STATES[keyof typeof UPLOAD_STATES];

interface CleanUploadCenterProps {
  familyId?: string;
  onDocumentProcessed?: (documents: TrustworthyDocument[]) => void;
  onNavigateToProfile?: (memberId: string) => void;
}

// Main Clean Upload Center Component
export const CleanUploadCenter: React.FC<CleanUploadCenterProps> = ({ 
  familyId = 'camacho_family',
  onDocumentProcessed,
  onNavigateToProfile 
}) => {
  // Core upload state
  const [uploadState, setUploadState] = useState<UploadState>(UPLOAD_STATES.READY);
  const [uploadedDocuments, setUploadedDocuments] = useState<TrustworthyDocument[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TrustworthyDocument | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showMobileUploadModal, setShowMobileUploadModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [mobileUploadLink, setMobileUploadLink] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const queryClient = useQueryClient();

  // Fetch family members for profile routing
  const { data: familyMembers = [] } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family/members'],
    enabled: showDetailsModal
  });

  // Handle Browse Files
  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  // Handle Take Photo
  const handleTakePhoto = () => {
    setShowCameraModal(true);
    startCamera();
  };

  // Handle Mobile Upload
  const handleMobileUpload = async () => {
    try {
      const uploadSession = await generateUploadSession();
      const baseUrl = window.location.origin;
      const mobileLink = `${baseUrl}/m/u/${uploadSession.sessionId}?family=${familyId}`;
      
      setMobileUploadLink(mobileLink);
      setQrCodeUrl(mobileLink);
      setShowMobileUploadModal(true);
      
    } catch (error) {
      console.error('Failed to generate mobile upload link:', error);
      setError('Failed to generate mobile upload link');
    }
  };

  // Generate upload session for mobile
  const generateUploadSession = async () => {
    const response = await fetch('/api/mobile-upload/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        familyId,
        expiresIn: 3600 // 1 hour
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create upload session');
    }

    return response.json();
  };

  // Handle file upload (unified for all methods)
  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setUploadState(UPLOAD_STATES.UPLOADING);
    setProcessingProgress(0);

    try {
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(async (file, index) => {
        const formData = new FormData();
        formData.append('document', file);
        formData.append('familyId', familyId);

        const uploadResponse = await fetch('/api/trustworthy/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const uploadResult = await uploadResponse.json() as TrustworthyDocument;
        setProcessingProgress(((index + 1) / fileArray.length) * 50);
        
        return uploadResult;
      });

      const documents = await Promise.all(uploadPromises);
      
      // Open LEFT sidebar with documents
      setUploadedDocuments(prev => [...documents, ...prev]);
      setSidebarOpen(true);
      setUploadState(UPLOAD_STATES.PROCESSING);
      
      // Start AI analysis for each document
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        await startAIAnalysis(doc.id);
        setProcessingProgress(50 + ((i + 1) / documents.length) * 50);
      }

      setUploadState(UPLOAD_STATES.COMPLETE);
      
      if (onDocumentProcessed) {
        onDocumentProcessed(documents);
      }

    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      setUploadState(UPLOAD_STATES.READY);
    }
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to start camera:', error);
      setError('Failed to access camera');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            await handleFileUpload([file]);
            setShowCameraModal(false);
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  // AI Analysis
  const startAIAnalysis = async (documentId: string) => {
    try {
      const response = await fetch(`/api/trustworthy/analyze/${documentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      
      setUploadedDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: 'analyzed' as const, extractedFields: JSON.stringify(result?.extractedFields || {}), confidence: result?.confidence || 0.85 }
            : doc
        )
      );

    } catch (error) {
      console.error('AI analysis failed:', error);
    }
  };

  // Copy link to clipboard
  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mobileUploadLink);
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  // Share link
  const shareMobileLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Upload Documents to Family Vault',
          text: 'Use this link to upload documents to our family vault',
          url: mobileUploadLink
        });
      } catch (error) {
        console.error('Failed to share link:', error);
      }
    } else {
      copyLinkToClipboard();
    }
  };

  return (
    <div className="clean-upload-system">
      {/* Family Header */}
      <FamilyHeader familyId={familyId} />
      
      {/* Main Upload Area */}
      <CleanUploadArea
        uploadState={uploadState}
        processingProgress={processingProgress}
        onBrowseFiles={handleBrowseFiles}
        onTakePhoto={handleTakePhoto}
        onMobileUpload={handleMobileUpload}
        onFileUpload={handleFileUpload}
        error={error}
      />

      {/* Camera Modal */}
      <CameraModal
        isOpen={showCameraModal}
        videoRef={videoRef}
        canvasRef={canvasRef}
        onCapture={capturePhoto}
        onClose={() => {
          setShowCameraModal(false);
          stopCamera();
        }}
      />

      {/* Mobile Upload Modal */}
      <MobileUploadModal
        isOpen={showMobileUploadModal}
        qrCodeUrl={qrCodeUrl}
        mobileLink={mobileUploadLink}
        onClose={() => setShowMobileUploadModal(false)}
        onCopyLink={copyLinkToClipboard}
        onShareLink={shareMobileLink}
      />

      {/* Integration with Inbox - Documents automatically appear in inbox after upload */}
      {uploadState === 'complete' && (
        <div className="upload-success-notification">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="success-card"
          >
            <CheckCircle size={24} className="text-green-400" />
            <div>
              <h4>Documents uploaded successfully!</h4>
              <p>Check your inbox to review AI suggestions and add them to family profiles.</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.heic"
        multiple
        style={{ display: 'none' }}
        data-testid="file-input-browse"
      />
    </div>
  );
};

// Family Header Component
const FamilyHeader: React.FC<{ familyId: string }> = ({ familyId }) => (
  <motion.div 
    className="family-header"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="family-info">
      <h1 className="family-name">{familyId.replace('_', ' ')} Family</h1>
      <p className="family-subtitle">Document Upload Center</p>
    </div>
    <div className="family-stats">
      <div className="stat-item">
        <span className="stat-value">🔒</span>
        <span className="stat-label">Secure</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">🤖</span>
        <span className="stat-label">AI Powered</span>
      </div>
    </div>
  </motion.div>
);

// Clean Upload Area with three methods
interface CleanUploadAreaProps {
  uploadState: UploadState;
  processingProgress: number;
  onBrowseFiles: () => void;
  onTakePhoto: () => void;
  onMobileUpload: () => void;
  onFileUpload: (files: FileList) => void;
  error: string | null;
}

const CleanUploadArea: React.FC<CleanUploadAreaProps> = ({ 
  uploadState, 
  processingProgress, 
  onBrowseFiles, 
  onTakePhoto, 
  onMobileUpload,
  onFileUpload,
  error
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragActive(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileUpload(files);
    }
  };

  return (
    <motion.div
      className={`clean-upload-area ${isDragActive ? 'drag-active' : ''} ${uploadState}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      whileHover={uploadState === 'ready' ? { scale: 1.01 } : {}}
    >
      <div className="upload-content">
        {uploadState === 'ready' && (
          <ReadyState 
            onBrowseFiles={onBrowseFiles}
            onTakePhoto={onTakePhoto}
            onMobileUpload={onMobileUpload}
            isDragActive={isDragActive}
            error={error}
          />
        )}
        
        {uploadState === 'uploading' && (
          <UploadingState progress={processingProgress} />
        )}
        
        {uploadState === 'processing' && (
          <ProcessingState progress={processingProgress} />
        )}
        
        {uploadState === 'complete' && (
          <CompleteState />
        )}
      </div>
    </motion.div>
  );
};

// Ready State Component with three upload methods
interface ReadyStateProps {
  onBrowseFiles: () => void;
  onTakePhoto: () => void;
  onMobileUpload: () => void;
  isDragActive: boolean;
  error: string | null;
}

const ReadyState: React.FC<ReadyStateProps> = ({ 
  onBrowseFiles, 
  onTakePhoto, 
  onMobileUpload, 
  isDragActive,
  error 
}) => (
  <motion.div
    className="upload-ready"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="upload-icon">
      {isDragActive ? (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1.2 }}
          className="drag-icon"
        >
          📥
        </motion.div>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )}
    </div>
    
    <h3>Upload Family Documents</h3>
    <p>Add documents and photos to your family vault</p>
    <p className="ai-text">AI will automatically extract key information</p>
    
    {error && (
      <div className="error-message">
        {error}
      </div>
    )}
    
    {/* Three Upload Methods */}
    <div className="upload-button-group">
      <motion.button
        className="upload-method-button browse-files"
        onClick={onBrowseFiles}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-testid="button-browse-files"
      >
        <span className="button-icon">📁</span>
        <span className="button-text">Browse Files</span>
      </motion.button>
      
      <motion.button
        className="upload-method-button take-photo"
        onClick={onTakePhoto}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-testid="button-take-photo"
      >
        <span className="button-icon">📷</span>
        <span className="button-text">Take Photo</span>
      </motion.button>
      
      <motion.button
        className="upload-method-button mobile-upload"
        onClick={onMobileUpload}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-testid="button-mobile-upload"
      >
        <span className="button-icon">📱</span>
        <span className="button-text">Mobile Upload</span>
      </motion.button>
    </div>
    
    <span className="or-text">or drag and drop files here</span>
    
    <div className="file-types">
      <span className="file-type">PDF</span>
      <span className="file-type">DOC</span>
      <span className="file-type">JPG</span>
      <span className="file-type">PNG</span>
      <span className="file-type">HEIC</span>
    </div>
  </motion.div>
);

// State Components
const UploadingState: React.FC<{ progress: number }> = ({ progress }) => (
  <motion.div
    className="uploading-state"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="upload-spinner">
      <Loader2 className="animate-spin" size={64} />
    </div>
    <h3>Uploading Documents...</h3>
    <div className="progress-bar">
      <motion.div 
        className="progress-fill"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
      />
    </div>
    <p>{Math.round(progress)}% complete</p>
  </motion.div>
);

const ProcessingState: React.FC<{ progress: number }> = ({ progress }) => (
  <motion.div
    className="processing-state"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="processing-spinner">
      <Zap className="animate-pulse" size={64} />
    </div>
    <h3>AI Analyzing Documents...</h3>
    <div className="progress-bar">
      <motion.div 
        className="progress-fill"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
      />
    </div>
    <p>Extracting key information and suggestions</p>
  </motion.div>
);

const CompleteState: React.FC = () => (
  <motion.div
    className="complete-state"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <div className="success-icon">
      <CheckCircle size={64} />
    </div>
    <h3>Documents Processed!</h3>
    <p>Check the left sidebar for AI suggestions</p>
  </motion.div>
);

// Camera Modal
interface CameraModalProps {
  isOpen: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onCapture: () => void;
  onClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ 
  isOpen, 
  videoRef, 
  canvasRef, 
  onCapture, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="camera-backdrop">
      <div className="camera-modal">
        <div className="camera-header">
          <h3>Take Document Photo</h3>
          <button 
            className="close-button" 
            onClick={onClose}
            data-testid="button-close-camera"
          >
            <X size={24} />
          </button>
        </div>
        <div className="camera-content">
          <video 
            ref={videoRef} 
            className="camera-video" 
            autoPlay 
            playsInline 
            muted 
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
        <div className="camera-controls">
          <button 
            className="capture-button" 
            onClick={onCapture}
            data-testid="button-capture-photo"
          >
            <Camera size={20} />
            Capture Photo
          </button>
        </div>
      </div>
    </div>
  );
};

// Mobile Upload Modal
interface MobileUploadModalProps {
  isOpen: boolean;
  qrCodeUrl: string;
  mobileLink: string;
  onClose: () => void;
  onCopyLink: () => void;
  onShareLink: () => void;
}

const MobileUploadModal: React.FC<MobileUploadModalProps> = ({ 
  isOpen, 
  qrCodeUrl, 
  mobileLink, 
  onClose, 
  onCopyLink, 
  onShareLink 
}) => {
  if (!isOpen) return null;

  return (
    <div className="mobile-upload-backdrop">
      <div className="mobile-upload-modal">
        <div className="mobile-upload-header">
          <h3>Mobile Upload</h3>
          <button 
            className="close-button" 
            onClick={onClose}
            data-testid="button-close-mobile-upload"
          >
            <X size={24} />
          </button>
        </div>
        <div className="mobile-upload-content">
          <div className="qr-code-section">
            <h4>Scan QR Code</h4>
            <div className="qr-code-container">
              <QRCodeSVG 
                value={qrCodeUrl}
                size={256}
                bgColor="#0F0F0F"
                fgColor="#D4AF37"
              />
            </div>
            <p>Scan with your phone camera to upload documents</p>
          </div>
          
          <div className="link-section">
            <h4>Or Share Link</h4>
            <div className="link-input-group">
              <input 
                type="text" 
                value={mobileLink} 
                readOnly 
                className="link-input"
              />
              <button 
                className="copy-button" 
                onClick={onCopyLink}
                data-testid="button-copy-link"
              >
                <Copy size={16} />
              </button>
            </div>
            <button 
              className="share-button" 
              onClick={onShareLink}
              data-testid="button-share-link"
            >
              <Smartphone size={16} />
              Share Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanUploadCenter;