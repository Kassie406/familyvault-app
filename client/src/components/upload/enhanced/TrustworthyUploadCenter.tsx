// Complete Trustworthy Upload Center - Based on video analysis and comprehensive implementation
// Uses callback-based state transitions (no polling loops) + connects to enhanced upload API

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { enhancedUploadWorkflow, validateFile, formatFileSize, type AnalysisResult, type WorkflowResult } from '@/utils/uploadApiIntegration';

// Trustworthy Upload States (same workflow from video)
const TRUSTWORTHY_STATES = {
  BROWSE: 'browse',           // Initial state with browse button
  UPLOADING: 'uploading',     // File upload in progress
  INBOX_OPEN: 'inbox_open',   // Sidebar opens with uploaded document
  ANALYZING: 'analyzing',     // AI analysis in progress
  DETAILS_READY: 'details_ready', // Lightning bolt with field count
  MODAL_OPEN: 'modal_open'    // Details modal showing extracted data
} as const;

type TrustworthyState = typeof TRUSTWORTHY_STATES[keyof typeof TRUSTWORTHY_STATES];

interface DocumentData {
  id: string;
  filename: string;
  uploadTime: Date;
  thumbnail: string;
  size: number;
  type: string;
}

// Main Trustworthy Upload Center Component
export const TrustworthyUploadCenter = () => {
  // State management based on video workflow
  const [uploadState, setUploadState] = useState<TrustworthyState>(TRUSTWORTHY_STATES.BROWSE);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedDocument, setUploadedDocument] = useState<DocumentData | null>(null);
  const [extractedData, setExtractedData] = useState<AnalysisResult | null>(null);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isFilenameModalOpen, setIsFilenameModalOpen] = useState(false);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<any>(null);
  const [suggestedFilename, setSuggestedFilename] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 1: Handle Browse button click (from video)
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Generate thumbnail for document (placeholder implementation)
  const generateThumbnail = async (file: File): Promise<string> => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    // Return document icon for non-images
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzFFMjAyNCIvPgo8cGF0aCBkPSJNMjAgMTZINDBWMjBIMjBWMTZaIiBmaWxsPSIjRDRBRjM3Ii8+CjxwYXRoIGQ9Ik0yMCAyNEg0NFYyOEgyMFYyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+IDwvcGF0aD4KPC9zdmc+';
  };

  // Generate unique document ID
  const generateDocumentId = (): string => {
    return `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Step 2: Handle file upload (exact video workflow)
  const handleFileUpload = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    try {
      setError(null);
      setUploadState(TRUSTWORTHY_STATES.UPLOADING);
      setUploadProgress(0);

      // Use existing enhanced upload workflow
      const workflowResult = await enhancedUploadWorkflow(
        file,
        setUploadProgress,
        (state: string) => {
          // Map enhanced upload states to trustworthy states
          if (state === 'uploading') {
            setUploadState(TRUSTWORTHY_STATES.UPLOADING);
          } else if (state === 'processing') {
            setUploadState(TRUSTWORTHY_STATES.ANALYZING);
          } else if (state === 'complete') {
            setUploadState(TRUSTWORTHY_STATES.DETAILS_READY);
          }
        }
      );

      // Create document data for LEFT sidebar display
      const documentData: DocumentData = {
        id: generateDocumentId(),
        filename: file.name,
        uploadTime: new Date(),
        thumbnail: await generateThumbnail(file),
        size: file.size,
        type: file.type
      };

      setUploadedDocument(documentData);
      setExtractedData(workflowResult.analysis);
      setIsLeftSidebarOpen(true);
      setUploadState(TRUSTWORTHY_STATES.DETAILS_READY);

      // Generate smart filename suggestion
      const smartFilename = workflowResult.analysis?.extractedFields?.length > 0 
        ? `${workflowResult.analysis.documentType || 'Document'} ${new Date().toLocaleDateString()}`
        : file.name;
      setSuggestedFilename(smartFilename);

    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      setUploadState(TRUSTWORTHY_STATES.BROWSE);
    }
  }, []);

  // Step 3: Handle lightning bolt click (from video)
  const handleDetailsClick = () => {
    setUploadState(TRUSTWORTHY_STATES.MODAL_OPEN);
    setIsFilenameModalOpen(true);
  };

  // Step 4: Handle filename acceptance (from video)
  const handleFilenameAccept = async () => {
    try {
      // In a real implementation, update filename in backend
      console.log('Filename accepted:', suggestedFilename);
      
      setIsFilenameModalOpen(false);
      setUploadState(TRUSTWORTHY_STATES.DETAILS_READY);
      
      // Could route to family member profile here
      // setSelectedFamilyMember(extractedData?.identifiedPerson);
    } catch (error) {
      console.error('Filename update failed:', error);
    }
  };

  // Step 5: Handle filename dismissal
  const handleFilenameDismiss = () => {
    setIsFilenameModalOpen(false);
    setUploadState(TRUSTWORTHY_STATES.DETAILS_READY);
  };

  // Reset to initial state
  const handleReset = () => {
    setUploadState(TRUSTWORTHY_STATES.BROWSE);
    setUploadProgress(0);
    setUploadedDocument(null);
    setExtractedData(null);
    setIsLeftSidebarOpen(false);
    setIsFilenameModalOpen(false);
    setSelectedFamilyMember(null);
    setSuggestedFilename('');
    setError(null);
  };

  return (
    <div className="trustworthy-upload-center">
      {/* Main upload area */}
      <MainUploadArea
        uploadState={uploadState}
        uploadProgress={uploadProgress}
        error={error}
        onBrowseClick={handleBrowseClick}
        onReset={handleReset}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        style={{ display: 'none' }}
        data-testid="file-input"
      />

      {/* LEFT sidebar - key correction from video */}
      <LeftSidebar
        isOpen={isLeftSidebarOpen}
        document={uploadedDocument}
        extractedData={extractedData}
        analysisState={uploadState}
        onDetailsClick={handleDetailsClick}
        onClose={() => setIsLeftSidebarOpen(false)}
      />

      {/* Filename suggestion modal - from video */}
      <FilenameModal
        isOpen={isFilenameModalOpen}
        document={uploadedDocument}
        extractedData={extractedData}
        suggestedFilename={suggestedFilename}
        onAccept={handleFilenameAccept}
        onDismiss={handleFilenameDismiss}
        onClose={() => setIsFilenameModalOpen(false)}
      />
    </div>
  );
};

// Main Upload Area Component
const MainUploadArea = ({ uploadState, uploadProgress, error, onBrowseClick, onReset }: {
  uploadState: TrustworthyState;
  uploadProgress: number;
  error: string | null;
  onBrowseClick: () => void;
  onReset: () => void;
}) => {
  return (
    <div className="main-upload-area">
      {/* Family header - from video */}
      <div className="family-header">
        <h2 className="family-title">FamilyVault</h2>
        <div className="user-avatars">
          <div className="avatar">KC</div>
          <div className="avatar">AQ</div>
        </div>
      </div>

      {/* Upload zone based on state */}
      <AnimatePresence mode="wait">
        {uploadState === TRUSTWORTHY_STATES.BROWSE && (
          <BrowseState onBrowseClick={onBrowseClick} error={error} />
        )}

        {uploadState === TRUSTWORTHY_STATES.UPLOADING && (
          <UploadingState progress={uploadProgress} />
        )}

        {(uploadState === TRUSTWORTHY_STATES.ANALYZING || 
          uploadState === TRUSTWORTHY_STATES.DETAILS_READY || 
          uploadState === TRUSTWORTHY_STATES.MODAL_OPEN) && (
          <UploadCompleteState onReset={onReset} />
        )}
      </AnimatePresence>
    </div>
  );
};

// Browse State - exact video layout
const BrowseState = ({ onBrowseClick, error }: { onBrowseClick: () => void; error: string | null }) => (
  <motion.div
    key="browse"
    className="browse-state"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <div className="upload-area">
      <div className="upload-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <h3>Upload Family Documents</h3>
      <p>Drag & drop files here or click to browse</p>
      <p>AI will automatically extract key information</p>
      
      <button className="browse-button" onClick={onBrowseClick} data-testid="browse-button">
        Browse
      </button>
      
      <span className="or-text">or drop files</span>
      
      {error && (
        <div className="error-message" data-testid="error-message">
          {error}
        </div>
      )}
    </div>
  </motion.div>
);

// Uploading State
const UploadingState = ({ progress }: { progress: number }) => (
  <motion.div
    key="uploading"
    className="uploading-state"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="progress-container">
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      <span data-testid="upload-progress">Uploading... {Math.round(progress)}%</span>
    </div>
  </motion.div>
);

// Upload Complete State
const UploadCompleteState = ({ onReset }: { onReset: () => void }) => (
  <motion.div
    key="complete"
    className="upload-complete-state"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="success-icon">✓</div>
    <p>Document uploaded successfully</p>
    <button className="upload-another-btn" onClick={onReset} data-testid="upload-another-btn">
      Upload Another Document
    </button>
  </motion.div>
);

// LEFT Sidebar - key correction from video analysis
const LeftSidebar = ({ 
  isOpen, 
  document, 
  extractedData, 
  analysisState, 
  onDetailsClick, 
  onClose 
}: {
  isOpen: boolean;
  document: DocumentData | null;
  extractedData: AnalysisResult | null;
  analysisState: TrustworthyState;
  onDetailsClick: () => void;
  onClose: () => void;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`left-sidebar ${isOpen ? 'open' : ''}`}
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="sidebar-header">
            <h3>Inbox +</h3>
            <button className="close-btn" onClick={onClose} data-testid="close-inbox">×</button>
          </div>

          <div className="sidebar-content">
            {/* Mini upload zone - from video */}
            <div className="upload-zone-mini">
              <div className="upload-icon-mini">📁</div>
              <span>Drop files here or Browse files</span>
            </div>

            {/* Document item */}
            {document && (
              <div className="document-item">
                <div className="document-thumbnail">
                  <img src={document.thumbnail} alt={document.filename} />
                  
                  {/* Lightning bolt button - exact video positioning */}
                  {analysisState === TRUSTWORTHY_STATES.DETAILS_READY && extractedData && (
                    <button className="lightning-bolt-button" onClick={onDetailsClick} data-testid="details-button">
                      <span className="lightning-icon">⚡</span>
                      <span>Details {extractedData.extractedFields?.length || 2}</span>
                    </button>
                  )}
                </div>

                <div className="document-info">
                  <div className="document-name">{document.filename}</div>
                  
                  {/* Analysis indicator */}
                  {analysisState === TRUSTWORTHY_STATES.ANALYZING && (
                    <div className="analyzing-indicator">
                      <div className="spinner"></div>
                      <span>Analyzing...</span>
                    </div>
                  )}
                </div>

                {/* Suggested destination - from video */}
                {extractedData && (
                  <div className="suggested-destination">
                    <span className="suggestion-label">Suggested destination</span>
                    <div className="suggestion-item">
                      <span className="suggestion-name">{extractedData.documentType || 'Family Member'}</span>
                      <span className="suggestion-category">Family IDs › Documents</span>
                    </div>
                    <button className="open-btn" data-testid="open-suggested">Open</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Filename Modal - exact video style
const FilenameModal = ({ 
  isOpen, 
  document, 
  extractedData, 
  suggestedFilename, 
  onAccept, 
  onDismiss, 
  onClose 
}: {
  isOpen: boolean;
  document: DocumentData | null;
  extractedData: AnalysisResult | null;
  suggestedFilename: string;
  onAccept: () => void;
  onDismiss: () => void;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="filename-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>{document?.filename}</h3>
            <button className="modal-close-btn" onClick={onClose} data-testid="modal-close">×</button>
          </div>

          <div className="modal-content">
            {/* Suggested filename - from video */}
            <div className="filename-suggestion">
              <span className="suggestion-label">Suggested filename</span>
              <div className="filename-display">{suggestedFilename}</div>
              <div className="filename-actions">
                <button className="dismiss-btn" onClick={onDismiss} data-testid="dismiss-filename">Dismiss</button>
                <button className="accept-btn" onClick={onAccept} data-testid="accept-filename">Accept</button>
              </div>
            </div>

            {/* Details section - from video */}
            <div className="details-section">
              <h4>Details</h4>
              <div className="extracted-fields">
                {extractedData?.extractedFields?.map((field: any, index: number) => (
                  <div key={index} className="field-item">
                    <div className="field-key">{field.label || field.key}</div>
                    <div className="field-value">{field.value}</div>
                  </div>
                )) || (
                  <div className="field-item">
                    <div className="field-key">Document Type</div>
                    <div className="field-value">{extractedData?.documentType || 'Unknown'}</div>
                  </div>
                )}
              </div>
              <button className="copy-all-btn" data-testid="copy-all">📋 Copy all</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrustworthyUploadCenter;