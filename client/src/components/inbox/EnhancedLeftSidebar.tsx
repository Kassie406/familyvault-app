// Enhanced LEFT Sidebar - Trustworthy Workflow Integration
// Enhances your existing Inbox sidebar with steps 4-9

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type AnalysisResult, type ExtractedField } from '@/utils/uploadApiIntegration';

// Document interface for the enhanced sidebar
interface Document {
  id: string;
  filename: string;
  uploadTime: string;
  thumbnail: string;
  size: number;
  type?: string;
  status: 'uploaded' | 'analyzing' | 'complete';
}

// Analysis result with additional person identification
interface EnhancedAnalysisResult extends AnalysisResult {
  suggestedFilename?: string;
  identifiedPerson?: {
    id: string;
    name: string;
    category: string;
    subcategory: string;
  };
}

// Component prop interfaces
interface EnhancedLeftSidebarProps {
  isOpen: boolean;
  documents: Document[];
  onClose: () => void;
  onDocumentAnalyze?: (document: Document, analysisResult: EnhancedAnalysisResult) => void;
  onDocumentRoute?: (document: Document, person: EnhancedAnalysisResult['identifiedPerson']) => void;
}

interface EnhancedDocumentItemProps {
  document: Document;
  isAnalyzing: boolean;
  analysisResult?: EnhancedAnalysisResult;
  onDetailsClick: () => void;
  onDocumentRoute?: (document: Document, person: EnhancedAnalysisResult['identifiedPerson']) => void;
}

interface FilenameModalProps {
  isOpen: boolean;
  document: Document | null;
  analysisResult: EnhancedAnalysisResult | null;
  onAccept: (filename: string) => void;
  onDismiss: () => void;
  onClose: () => void;
}

interface ProfileRoutingIndicatorProps {
  isVisible: boolean;
}

// Enhanced LEFT Sidebar Component
export const EnhancedLeftSidebar: React.FC<EnhancedLeftSidebarProps> = ({ 
  isOpen, 
  documents = [], 
  onClose,
  onDocumentAnalyze,
  onDocumentRoute 
}) => {
  const [analyzingDocuments, setAnalyzingDocuments] = useState<Set<string>>(new Set());
  const [analysisResults, setAnalysisResults] = useState<Map<string, EnhancedAnalysisResult>>(new Map());
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isFilenameModalOpen, setIsFilenameModalOpen] = useState<boolean>(false);
  const [isProfileRouting, setIsProfileRouting] = useState<boolean>(false);

  // Idempotency guard to prevent duplicate analysis starts
  const startedAnalysisIds = useRef<Set<string>>(new Set());
  // In-flight request deduplication
  const inFlight = useRef<Map<string, Promise<void>>>(new Map());
  const controllers = useRef<Map<string, AbortController>>(new Map());

  // Auto-start analysis when new documents are added (only when sidebar is open)
  useEffect(() => {
    if (!isOpen) return; // Gate by isOpen to prevent background work
    
    for (const doc of documents) {
      if (doc.status === 'uploaded' && !startedAnalysisIds.current.has(doc.id)) {
        startedAnalysisIds.current.add(doc.id);
        void startDocumentAnalysis(doc);
      }
    }
  }, [documents, isOpen]); // Removed reactive dependencies to prevent loops

  // Cleanup: Abort in-flight requests on unmount
  useEffect(() => {
    return () => {
      controllers.current.forEach(controller => controller.abort());
      controllers.current.clear();
      inFlight.current.clear();
    };
  }, []);

  // Step 4: Start AI Analysis with in-flight deduplication
  const startDocumentAnalysis = async (document: Document) => {
    // Check if already in-flight or completed
    if (inFlight.current.has(document.id) || analysisResults.has(document.id)) {
      return;
    }
    
    // Create AbortController for this request
    const controller = new AbortController();
    controllers.current.set(document.id, controller);
    
    setAnalyzingDocuments(prev => new Set([...Array.from(prev), document.id]));

    // Create and store the promise to prevent duplicate requests
    const analysisPromise = (async () => {
      try {
        // Call your existing analysis API
        const response = await fetch('/api/analyze-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileId: document.id }),
          signal: controller.signal, // Add abort signal
        });

        const result = await response.json();

        if (result.success) {
          // Step 5: Analysis complete - show lightning bolt
          setAnalysisResults(prev => new Map([...Array.from(prev), [document.id, result.data]]));
          setAnalyzingDocuments(prev => {
            const newSet = new Set(prev);
            newSet.delete(document.id);
            return newSet;
          });

          // Trigger callback if provided
          if (onDocumentAnalyze) {
            onDocumentAnalyze(document, result.data);
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Analysis failed:', error);
        }
        setAnalyzingDocuments(prev => {
          const newSet = new Set(prev);
          newSet.delete(document.id);
          return newSet;
        });
      } finally {
        // Cleanup
        inFlight.current.delete(document.id);
        controllers.current.delete(document.id);
      }
    })();

    inFlight.current.set(document.id, analysisPromise);
    return analysisPromise;
  };

  // Step 6: Handle Details (Lightning Bolt) Click
  const handleDetailsClick = (document: Document) => {
    setSelectedDocument(document);
    setIsFilenameModalOpen(true);
  };

  // Step 7: Handle Filename Accept
  const handleFilenameAccept = async (document: Document, suggestedFilename: string) => {
    try {
      // Update filename in backend
      await fetch(`/api/documents/${document.id}/filename`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: suggestedFilename })
      });

      setIsFilenameModalOpen(false);
      
      // Step 8: Route to family member profile
      const analysisResult = analysisResults.get(document.id);
      if (analysisResult?.identifiedPerson) {
        setIsProfileRouting(true);
        
        // Delay for smooth transition
        setTimeout(() => {
          if (onDocumentRoute) {
            onDocumentRoute(document, analysisResult.identifiedPerson);
          }
          setIsProfileRouting(false);
        }, 500);
      }
    } catch (error) {
      console.error('Filename update failed:', error);
    }
  };

  // Step 7: Handle Filename Dismiss
  const handleFilenameDismiss = () => {
    setIsFilenameModalOpen(false);
    setSelectedDocument(null);
  };

  return (
    <>
      {/* Enhanced LEFT Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="enhanced-left-sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="sidebar-header">
              <h3>Inbox +</h3>
              <div className="sidebar-actions">
                <span className="document-count">{documents.length}</span>
                <button className="close-btn" onClick={onClose} data-testid="button-close-sidebar">×</button>
              </div>
            </div>

            <div className="sidebar-content">
              {/* Mini upload zone */}
              <div className="upload-zone-mini" data-testid="zone-upload-mini">
                <div className="upload-icon-mini">📁</div>
                <span>Drop files here or Browse files</span>
              </div>

              {/* Document list with enhanced workflow */}
              <div className="documents-list">
                {documents.map(document => (
                  <EnhancedDocumentItem
                    key={document.id}
                    document={document}
                    isAnalyzing={analyzingDocuments.has(document.id)}
                    analysisResult={analysisResults.get(document.id)}
                    onDetailsClick={() => handleDetailsClick(document)}
                    onDocumentRoute={onDocumentRoute}
                  />
                ))}

                {documents.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">📄</div>
                    <p>No documents uploaded yet</p>
                    <span>Upload your first document to get started</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 6-7: Filename Suggestion Modal */}
      <FilenameModal
        isOpen={isFilenameModalOpen}
        document={selectedDocument}
        analysisResult={selectedDocument ? analysisResults.get(selectedDocument.id) || null : null}
        onAccept={(suggestedFilename) => selectedDocument && handleFilenameAccept(selectedDocument, suggestedFilename)}
        onDismiss={handleFilenameDismiss}
        onClose={handleFilenameDismiss}
      />

      {/* Step 8: Profile Routing Indicator */}
      <ProfileRoutingIndicator isVisible={isProfileRouting} />
    </>
  );
};

// Enhanced Document Item with Trustworthy Workflow
const EnhancedDocumentItem: React.FC<EnhancedDocumentItemProps> = ({ 
  document, 
  isAnalyzing, 
  analysisResult, 
  onDetailsClick,
  onDocumentRoute 
}) => {
  return (
    <motion.div
      className="enhanced-document-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-testid={`card-document-${document.id}`}
    >
      <div className="document-thumbnail">
        <img src={document.thumbnail || '/default-document.png'} alt={document.filename} />
        
        {/* Step 4: Analyzing Spinner */}
        {isAnalyzing && (
          <div className="analyzing-overlay" data-testid="overlay-analyzing">
            <div className="analyzing-spinner"></div>
            <span className="analyzing-text">Analyzing...</span>
          </div>
        )}

        {/* Step 5: Lightning Bolt with Details Count */}
        {analysisResult && !isAnalyzing && (
          <motion.button
            className="lightning-bolt-button"
            onClick={onDetailsClick}
            data-testid={`button-lightning-${document.id}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="lightning-icon"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              ⚡
            </motion.span>
            <span className="details-text">
              Details {analysisResult.extractedFields?.length || 0}
            </span>
          </motion.button>
        )}
      </div>

      <div className="document-info">
        <div className="document-name" data-testid={`text-filename-${document.id}`}>{document.filename}</div>
        <div className="document-meta">
          <span className="upload-time">
            {new Date(document.uploadTime).toLocaleTimeString()}
          </span>
          <span className="file-size">
            {formatFileSize(document.size)}
          </span>
        </div>

        {/* Analysis Status */}
        {isAnalyzing && (
          <div className="analysis-status">
            <div className="status-indicator analyzing"></div>
            <span>AI is analyzing document...</span>
          </div>
        )}

        {analysisResult && (
          <div className="analysis-complete">
            <div className="status-indicator complete"></div>
            <span>Analysis complete • {analysisResult.confidence}% confidence</span>
          </div>
        )}
      </div>

      {/* Suggested Destination */}
      {analysisResult?.identifiedPerson && (
        <div className="suggested-destination">
          <span className="suggestion-label">Suggested destination</span>
          <div className="suggestion-item">
            <div className="person-avatar">
              {analysisResult.identifiedPerson.name.charAt(0)}
            </div>
            <div className="person-info">
              <span className="person-name">{analysisResult.identifiedPerson.name}</span>
              <span className="person-category">
                {analysisResult.identifiedPerson.category} › {analysisResult.identifiedPerson.subcategory}
              </span>
            </div>
          </div>
          <button 
            className="open-profile-btn"
            data-testid={`button-open-profile-${document.id}`}
            onClick={() => analysisResult?.identifiedPerson && onDocumentRoute?.(document, analysisResult.identifiedPerson)}
          >
            Open Profile
          </button>
        </div>
      )}
    </motion.div>
  );
};

// Step 6-7: Filename Suggestion Modal
const FilenameModal: React.FC<FilenameModalProps> = ({ 
  isOpen, 
  document, 
  analysisResult, 
  onAccept, 
  onDismiss, 
  onClose 
}) => {
  const [customFilename, setCustomFilename] = useState('');

  useEffect(() => {
    if (analysisResult?.suggestedFilename) {
      setCustomFilename(analysisResult.suggestedFilename);
    }
  }, [analysisResult]);

  if (!isOpen || !document || !analysisResult) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="filename-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        data-testid="modal-filename-overlay"
      >
        <motion.div
          className="filename-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          data-testid="modal-filename"
        >
          <div className="modal-header">
            <h3>{document.filename}</h3>
            <button className="modal-close-btn" onClick={onClose} data-testid="button-close-modal">×</button>
          </div>

          <div className="modal-content">
            {/* Document Preview */}
            <div className="document-preview">
              <img src={document.thumbnail} alt={document.filename} />
              <div className="document-type">
                {analysisResult.documentType || 'Document'}
              </div>
            </div>

            {/* Filename Suggestion */}
            <div className="filename-suggestion">
              <label className="suggestion-label">Suggested filename</label>
              <input
                type="text"
                className="filename-input"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                placeholder="Enter filename..."
                data-testid="input-filename"
              />
              <div className="filename-actions">
                <button 
                  className="dismiss-btn" 
                  onClick={onDismiss}
                  data-testid="button-dismiss-filename"
                >
                  Dismiss
                </button>
                <button 
                  className="accept-btn" 
                  onClick={() => onAccept(customFilename)}
                  disabled={!customFilename.trim()}
                  data-testid="button-accept-filename"
                >
                  Accept
                </button>
              </div>
            </div>

            {/* Extracted Details */}
            <div className="details-section">
              <h4>Extracted Details</h4>
              <div className="extracted-fields">
                {analysisResult.extractedFields?.map((field, index) => (
                  <div key={index} className="field-item" data-testid={`field-${index}`}>
                    <div className="field-key">{field.key}</div>
                    <div className="field-value">{field.value}</div>
                    <div className="field-confidence">{field.confidence}%</div>
                  </div>
                ))}
              </div>
              
              {analysisResult.extractedFields?.length > 0 && (
                <button className="copy-all-btn" data-testid="button-copy-all">
                  📋 Copy all details
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Step 8: Profile Routing Indicator
const ProfileRoutingIndicator: React.FC<ProfileRoutingIndicatorProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="profile-routing-indicator"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          data-testid="indicator-routing"
        >
          <div className="routing-content">
            <div className="routing-spinner"></div>
            <span>Routing to family member profile...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Utility Functions
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Hook for managing sidebar state
export const useEnhancedSidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  const addDocument = (document: Document) => {
    setDocuments(prev => [document, ...prev]);
    setIsOpen(true); // Auto-open sidebar when document is added
  };

  const removeDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const updateDocument = (documentId: string, updates: Partial<Document>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? { ...doc, ...updates } : doc
    ));
  };

  return {
    isOpen,
    setIsOpen,
    documents,
    addDocument,
    removeDocument,
    updateDocument
  };
};

export default EnhancedLeftSidebar;