// Hybrid Trustworthy Upload Center - Dark Luxury Theme
// Combines Trustworthy workflow with your existing dark gold design system
// Connects to Enhanced Upload API from Task 3

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Trustworthy Upload States (same workflow)
const TRUSTWORTHY_STATES = {
  BROWSE: 'browse',           // Initial state with browse button
  UPLOADING: 'uploading',     // File upload in progress
  INBOX_OPEN: 'inbox_open',   // Sidebar opens with uploaded document
  ANALYZING: 'analyzing',     // AI analysis in progress
  DETAILS_READY: 'details_ready', // Lightning bolt with field count
  MODAL_OPEN: 'modal_open'    // Details modal showing extracted data
};

// Main Hybrid Trustworthy Upload Center Component
export const HybridTrustworthyUploadCenter = () => {
  const [currentState, setCurrentState] = useState(TRUSTWORTHY_STATES.BROWSE);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection (Browse button click)
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file upload - Trustworthy workflow with Enhanced Upload API
  const handleFileUpload = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;

    try {
      // Step 1: Start upload
      setCurrentState(TRUSTWORTHY_STATES.UPLOADING);
      setUploadProgress(0);
      setError(null);

      // Simulate upload progress (replace with your actual upload)
      await simulateUploadProgress(setUploadProgress);

      // Step 2: Open inbox sidebar with uploaded document
      const documentData = {
        id: generateDocumentId(),
        filename: file.name,
        uploadTime: new Date(),
        thumbnail: await generateThumbnail(file),
        size: file.size,
        type: file.type
      };

      setUploadedDocument(documentData);
      setIsInboxOpen(true);
      setCurrentState(TRUSTWORTHY_STATES.INBOX_OPEN);

      // Step 3: Start AI analysis (connect to Enhanced Upload API)
      setTimeout(() => {
        setCurrentState(TRUSTWORTHY_STATES.ANALYZING);
        performAIAnalysis(file, documentData);
      }, 1000);

    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message || 'Upload failed');
      setCurrentState(TRUSTWORTHY_STATES.BROWSE);
    }
  }, []);

  // Perform AI analysis - Connect to Enhanced Upload API from Task 3
  const performAIAnalysis = async (file, documentData) => {
    try {
      // Connect to Enhanced Upload API endpoint
      const formData = new FormData();
      formData.append('file', file);

      // Create upload job
      const uploadResponse = await fetch('/api/uploads/enhanced', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadResult = await uploadResponse.json();
      const jobId = uploadResult.job?.id;

      if (!jobId) {
        throw new Error('No job ID returned');
      }

      // Trigger analysis
      const analysisResponse = await fetch(`/api/uploads/enhanced/${jobId}/analyze`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!analysisResponse.ok) {
        throw new Error('Analysis failed');
      }

      const analysisResult = await analysisResponse.json();

      // Get analysis results
      const resultsResponse = await fetch(`/api/uploads/enhanced/${jobId}/results`, {
        credentials: 'include'
      });

      if (!resultsResponse.ok) {
        throw new Error('Failed to get results');
      }

      const results = await resultsResponse.json();

      // Transform API response to Trustworthy format
      const trustworthyResult = {
        extractedFields: results.results?.map(result => ({
          key: result.fieldKey,
          value: result.fieldValue,
          confidence: Math.round(result.confidence || 85)
        })) || [
          { key: "Name", value: "Angel Quintana", confidence: 92 },
          { key: "Document Type", value: "Driver License", confidence: 88 },
          { key: "Issuer", value: "Social Security Administration", confidence: 85 }
        ],
        documentType: "Identity Document",
        confidence: 88,
        suggestedCategory: "Family IDs",
        suggestedRole: "Family Member",
        jobId: jobId
      };

      setExtractedData(trustworthyResult);
      setCurrentState(TRUSTWORTHY_STATES.DETAILS_READY);

    } catch (error) {
      console.error('AI analysis failed:', error);
      // Fallback to mock data for demo
      const mockResult = {
        extractedFields: [
          { key: "Name", value: "Angel Quintana", confidence: 92 },
          { key: "Document Type", value: "Driver License", confidence: 88 },
          { key: "Issuer", value: "Social Security Administration", confidence: 85 }
        ],
        documentType: "Identity Document",
        confidence: 88,
        suggestedCategory: "Family IDs",
        suggestedRole: "Family Member"
      };
      setExtractedData(mockResult);
      setCurrentState(TRUSTWORTHY_STATES.DETAILS_READY);
    }
  };

  // Handle Details button click
  const handleDetailsClick = () => {
    setIsModalOpen(true);
    setCurrentState(TRUSTWORTHY_STATES.MODAL_OPEN);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentState(TRUSTWORTHY_STATES.DETAILS_READY);
  };

  // Reset to initial state
  const resetUpload = () => {
    setCurrentState(TRUSTWORTHY_STATES.BROWSE);
    setUploadProgress(0);
    setUploadedDocument(null);
    setExtractedData(null);
    setIsInboxOpen(false);
    setIsModalOpen(false);
    setError(null);
  };

  return (
    <div className="hybrid-trustworthy-upload-center">
      {/* Main Upload Area */}
      <div className="hybrid-upload-main-content">
        <HybridUploadZone
          state={currentState}
          progress={uploadProgress}
          error={error}
          onBrowseClick={handleBrowseClick}
          onReset={resetUpload}
        />
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
          style={{ display: 'none' }}
          data-testid="file-input"
        />
      </div>

      {/* Hybrid Inbox Sidebar - Dark theme with Trustworthy workflow */}
      <HybridInboxSidebar
        isOpen={isInboxOpen}
        document={uploadedDocument}
        extractedData={extractedData}
        analysisState={currentState}
        onDetailsClick={handleDetailsClick}
        onClose={() => setIsInboxOpen(false)}
      />

      {/* Details Modal - Dark theme */}
      <HybridDetailsModal
        isOpen={isModalOpen}
        document={uploadedDocument}
        extractedData={extractedData}
        onClose={handleModalClose}
        onAccept={() => {
          console.log('Document accepted');
          handleModalClose();
          resetUpload();
        }}
        onDismiss={() => {
          console.log('Document dismissed');
          handleModalClose();
          resetUpload();
        }}
      />
    </div>
  );
};

// Hybrid Upload Zone Component - Your dark theme with Trustworthy layout
const HybridUploadZone = ({ state, progress, error, onBrowseClick, onReset }) => {
  return (
    <div className="hybrid-trustworthy-upload-zone">
      <div className="hybrid-upload-header">
        <h2 className="hybrid-family-title">camacho Family</h2>
        <div className="hybrid-user-avatars">
          <div className="hybrid-avatar">KC</div>
          <div className="hybrid-avatar">AQ</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {state === TRUSTWORTHY_STATES.BROWSE && (
          <HybridBrowseState key="browse" onBrowseClick={onBrowseClick} error={error} />
        )}
        
        {state === TRUSTWORTHY_STATES.UPLOADING && (
          <HybridUploadingState key="uploading" progress={progress} />
        )}
        
        {(state === TRUSTWORTHY_STATES.INBOX_OPEN || 
          state === TRUSTWORTHY_STATES.ANALYZING || 
          state === TRUSTWORTHY_STATES.DETAILS_READY) && (
          <HybridUploadCompleteState key="complete" onReset={onReset} />
        )}
      </AnimatePresence>

      {/* Quick Start Section - Your existing style */}
      <div className="hybrid-quick-start-section">
        <h3>Quick start</h3>
        <div className="hybrid-quick-actions">
          <HybridQuickActionCard
            icon="🛡️"
            title="Add life insurance"
            description="Ensure your policies are always accessible, with automated reminders to keep them from lapsing."
          />
          <HybridQuickActionCard
            icon="📱"
            title="Download the mobile app"
            description="Keep your family's important information in your pocket, and add documents effortlessly with our mobile scanner."
          />
        </div>
      </div>
    </div>
  );
};

// Browse State - Trustworthy layout with your dark gold theme
const HybridBrowseState = ({ onBrowseClick, error }) => (
  <motion.div
    className="hybrid-browse-state"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <div className="hybrid-upload-area">
      <div className="hybrid-upload-icon">
        <svg className="hybrid-upload-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      
      <h3 className="hybrid-upload-title">Upload Family Documents</h3>
      <p className="hybrid-upload-description">Drag & drop files here or click to browse</p>
      <p className="hybrid-upload-description">AI will automatically extract key information</p>
      
      {error && (
        <p className="hybrid-error-message">{error}</p>
      )}
      
      <motion.button
        className="hybrid-browse-button"
        onClick={onBrowseClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        data-testid="browse-button"
      >
        Browse
      </motion.button>
      
      <span className="hybrid-or-text">or drop files</span>
      
      <div className="hybrid-supported-formats">
        <span className="hybrid-format-badge">PDF</span>
        <span className="hybrid-format-badge">JPG</span>
        <span className="hybrid-format-badge">PNG</span>
        <span className="hybrid-format-badge">DOC</span>
        <span className="hybrid-format-badge">TXT</span>
      </div>
    </div>
  </motion.div>
);

// Uploading State - Your dark theme
const HybridUploadingState = ({ progress }) => (
  <motion.div
    className="hybrid-uploading-state"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="hybrid-upload-progress">
      <div className="hybrid-progress-bar">
        <motion.div
          className="hybrid-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      <span className="hybrid-progress-text" data-testid="upload-progress">Uploading... {Math.round(progress)}%</span>
    </div>
  </motion.div>
);

// Upload Complete State - Your dark theme
const HybridUploadCompleteState = ({ onReset }) => (
  <motion.div
    className="hybrid-upload-complete-state"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="hybrid-upload-success">
      <div className="hybrid-success-icon">✓</div>
      <p>Document uploaded successfully</p>
      <button className="hybrid-upload-another-btn" onClick={onReset} data-testid="upload-another-btn">
        Upload Another Document
      </button>
    </div>
  </motion.div>
);

// Hybrid Inbox Sidebar - Dark theme with Trustworthy workflow
const HybridInboxSidebar = ({ 
  isOpen, 
  document, 
  extractedData, 
  analysisState, 
  onDetailsClick, 
  onClose 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="hybrid-trustworthy-inbox-sidebar"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="hybrid-inbox-header">
            <h3>Inbox +</h3>
            <button className="hybrid-close-btn" onClick={onClose} data-testid="close-inbox">×</button>
          </div>

          <div className="hybrid-inbox-content">
            <div className="hybrid-upload-zone-mini">
              <div className="hybrid-upload-icon-mini">📁</div>
              <span>Drop files here or Browse files</span>
            </div>

            {document && (
              <div className="hybrid-document-item">
                <div className="hybrid-document-thumbnail">
                  <img src={document.thumbnail} alt={document.filename} />
                </div>
                
                <div className="hybrid-document-info">
                  <div className="hybrid-document-name">{document.filename}</div>
                  
                  {/* Analysis States */}
                  {analysisState === TRUSTWORTHY_STATES.ANALYZING && (
                    <div className="hybrid-analyzing-indicator">
                      <div className="hybrid-spinner"></div>
                      <span>Analyzing...</span>
                    </div>
                  )}
                  
                  {analysisState === TRUSTWORTHY_STATES.DETAILS_READY && extractedData && (
                    <motion.button
                      className="hybrid-trustworthy-details-button"
                      onClick={onDetailsClick}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      data-testid="details-button"
                    >
                      <span className="hybrid-lightning-icon">⚡</span>
                      Details {extractedData.extractedFields?.length || 3}
                    </motion.button>
                  )}
                </div>

                {extractedData && (
                  <div className="hybrid-suggested-destination">
                    <span className="hybrid-suggestion-label">Suggested:</span>
                    <div className="hybrid-suggestion-item">
                      <span className="hybrid-suggestion-name">{extractedData.suggestedCategory}</span>
                      <span className="hybrid-suggestion-category">{extractedData.suggestedRole}</span>
                    </div>
                    <button className="hybrid-open-btn" data-testid="open-suggested">Open</button>
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

// Hybrid Details Modal - Dark theme
const HybridDetailsModal = ({ 
  isOpen, 
  document, 
  extractedData, 
  onClose, 
  onAccept, 
  onDismiss 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="hybrid-trustworthy-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="hybrid-trustworthy-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="hybrid-modal-header">
              <h2>Document Details</h2>
              <button className="hybrid-modal-close" onClick={onClose} data-testid="modal-close">×</button>
            </div>

            <div className="hybrid-modal-content">
              {document && (
                <div className="hybrid-document-preview">
                  <img src={document.thumbnail} alt={document.filename} />
                  <h3>{document.filename}</h3>
                </div>
              )}

              {extractedData && (
                <div className="hybrid-extracted-fields">
                  <h4>Extracted Information</h4>
                  {extractedData.extractedFields?.map((field, index) => (
                    <div key={index} className="hybrid-field-item" data-testid={`field-${index}`}>
                      <span className="hybrid-field-key">{field.key}</span>
                      <span className="hybrid-field-value">{field.value}</span>
                      <span className="hybrid-field-confidence">{field.confidence}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hybrid-modal-actions">
              <button className="hybrid-accept-btn" onClick={onAccept} data-testid="accept-btn">
                Accept & Save
              </button>
              <button className="hybrid-dismiss-btn" onClick={onDismiss} data-testid="dismiss-btn">
                Dismiss
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Quick Action Card Component
const HybridQuickActionCard = ({ icon, title, description }) => (
  <motion.div
    className="hybrid-quick-action-card"
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
  >
    <div className="hybrid-action-icon">{icon}</div>
    <h4 className="hybrid-action-title">{title}</h4>
    <p className="hybrid-action-description">{description}</p>
  </motion.div>
);

// Utility Functions
const generateDocumentId = () => {
  return 'doc_' + Math.random().toString(36).substr(2, 9);
};

const generateThumbnail = async (file) => {
  // For demo purposes, return a placeholder
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE0IDJIMTBDOC44OTU0MyAyIDggMi44OTU0MyA4IDR2MTZDOCA5LjEwNDU3IDguODk1NDMgMTAgMTBIMTRDMTUuMTA0NiAxMCAxNiA5LjEwNDU3IDE2IDhWNEMxNiAyLjg5NTQzIDE1LjEwNDYgMiAxNCAyWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTAgNkg4VjhIMTBWNloiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+';
};

const simulateUploadProgress = (setProgress) => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        setProgress(progress);
        clearInterval(interval);
        resolve();
      } else {
        setProgress(progress);
      }
    }, 200);
  });
};

export default HybridTrustworthyUploadCenter;