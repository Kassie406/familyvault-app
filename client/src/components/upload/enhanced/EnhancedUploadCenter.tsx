// Enhanced Upload Center Component - Trustworthy Style Implementation
// Enhanced by Manus (Design & UX Lead) via MCP Server

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { enhancedUploadWorkflow, validateFile, formatFileSize } from '@/utils/uploadApiIntegration';

// Upload States
const UPLOAD_STATES = {
  EMPTY: 'empty',
  DRAGOVER: 'dragover',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
  ERROR: 'error'
} as const;

type UploadState = typeof UPLOAD_STATES[keyof typeof UPLOAD_STATES];

interface AnalysisResult {
  extractedFields: Array<{
    key: string;
    value: string;
    confidence: number;
  }>;
  documentType: string;
  confidence: number;
}

// Main Upload Center Component
export const EnhancedUploadCenter = () => {
  const [uploadState, setUploadState] = useState<UploadState>(UPLOAD_STATES.EMPTY);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload handler
  const handleFileUpload = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      setUploadState(UPLOAD_STATES.ERROR);
      return;
    }

    setCurrentFile(file);
    setError(null);
    setUploadState(UPLOAD_STATES.UPLOADING);
    setUploadProgress(0);

    try {
      const result = await enhancedUploadWorkflow(
        file,
        setUploadProgress,
        setUploadState
      );
      
      setAnalysisResults(result.analysis);
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      setUploadState(UPLOAD_STATES.ERROR);
    }
  }, []);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
    if (uploadState === UPLOAD_STATES.EMPTY) {
      setUploadState(UPLOAD_STATES.DRAGOVER);
    }
  }, [uploadState]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (uploadState === UPLOAD_STATES.DRAGOVER) {
      setUploadState(UPLOAD_STATES.EMPTY);
    }
  }, [uploadState]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  // File input click handler
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  // Reset upload state
  const resetUpload = () => {
    setUploadState(UPLOAD_STATES.EMPTY);
    setUploadProgress(0);
    setAnalysisResults(null);
    setCurrentFile(null);
    setError(null);
  };

  return (
    <div className="enhanced-upload-center">
      <div className="upload-main-area">
        <motion.div
          className={`upload-zone ${uploadState} ${isDragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={uploadState === UPLOAD_STATES.EMPTY ? handleFileInputClick : undefined}
          whileHover={uploadState === UPLOAD_STATES.EMPTY ? { y: -2 } : {}}
          transition={{ duration: 0.2 }}
          data-testid="upload-zone"
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInputChange}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
            style={{ display: 'none' }}
            data-testid="file-input"
          />
          
          <StateRenderer
            state={uploadState}
            progress={uploadProgress}
            file={currentFile}
            results={analysisResults}
            error={error}
            onReset={resetUpload}
          />
        </motion.div>
      </div>

      <div className="upload-sidebar">
        <RecentUploads />
        <QuickActions />
      </div>
    </div>
  );
};

// State Renderer Component
interface StateRendererProps {
  state: UploadState;
  progress: number;
  file: File | null;
  results: AnalysisResult | null;
  error: string | null;
  onReset: () => void;
}

const StateRenderer = ({ state, progress, file, results, error, onReset }: StateRendererProps) => {
  return (
    <AnimatePresence mode="wait">
      {state === UPLOAD_STATES.EMPTY && <EmptyState key="empty" />}
      {state === UPLOAD_STATES.DRAGOVER && <DragOverState key="dragover" />}
      {state === UPLOAD_STATES.UPLOADING && <UploadingState key="uploading" progress={progress} file={file} />}
      {state === UPLOAD_STATES.PROCESSING && <ProcessingState key="processing" file={file} />}
      {state === UPLOAD_STATES.COMPLETE && <CompleteState key="complete" results={results} onReset={onReset} />}
      {state === UPLOAD_STATES.ERROR && <ErrorState key="error" error={error} onReset={onReset} />}
    </AnimatePresence>
  );
};

// Empty State Component
const EmptyState = () => (
  <motion.div
    className="upload-state upload-empty-state"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <div className="upload-icon">
      <motion.svg
        className="w-16 h-16 text-gold"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </motion.svg>
    </div>
    
    <h3 className="upload-title" data-testid="upload-title">Upload Family Documents</h3>
    <p className="upload-description">
      Drag & drop files here or click to browse
    </p>
    <p className="upload-subtitle">
      AI will automatically extract key information
    </p>
    
    <div className="supported-formats">
      <span className="format-badge">PDF</span>
      <span className="format-badge">JPG</span>
      <span className="format-badge">PNG</span>
      <span className="format-badge">DOC</span>
      <span className="format-badge">TXT</span>
    </div>
  </motion.div>
);

// Drag Over State Component
const DragOverState = () => (
  <motion.div
    className="upload-state upload-dragover-state"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.2 }}
  >
    <motion.div
      className="drop-indicator"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <div className="drop-icon">📄</div>
      <h3 className="drop-title">Drop your document here</h3>
      <p className="drop-description">Release to start AI analysis</p>
    </motion.div>
  </motion.div>
);

// Uploading State Component
interface UploadingStateProps {
  progress: number;
  file: File | null;
}

const UploadingState = ({ progress, file }: UploadingStateProps) => (
  <motion.div
    className="upload-state upload-uploading-state"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="file-preview">
      <div className="file-icon">📄</div>
      <div className="file-info">
        <h4 className="file-name">{file?.name}</h4>
        <p className="file-size">{file ? formatFileSize(file.size) : ''}</p>
      </div>
    </div>
    
    <div className="progress-container">
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <span className="progress-text" data-testid="upload-progress">{Math.round(progress)}% uploaded</span>
    </div>
  </motion.div>
);

// Processing State Component (AI Analysis)
interface ProcessingStateProps {
  file: File | null;
}

const ProcessingState = ({ file }: ProcessingStateProps) => (
  <motion.div
    className="upload-state upload-processing-state"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="ai-analysis-container">
      <motion.div
        className="ai-brain-icon"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🧠
      </motion.div>
      
      <h3 className="processing-title" data-testid="processing-title">AI Analyzing Document...</h3>
      <p className="processing-description">
        Extracting key information from {file?.name}
      </p>
      
      <div className="processing-steps">
        <ProcessingStep label="Reading document" completed />
        <ProcessingStep label="Extracting data" active />
        <ProcessingStep label="Categorizing content" />
        <ProcessingStep label="Identifying family members" />
      </div>
    </div>
  </motion.div>
);

// Complete State Component (Trustworthy Style Results)
interface CompleteStateProps {
  results: AnalysisResult | null;
  onReset: () => void;
}

const CompleteState = ({ results, onReset }: CompleteStateProps) => (
  <motion.div
    className="upload-state upload-complete-state"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.4 }}
  >
    <div className="results-header">
      <motion.div
        className="lightning-icon"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 0.5 }}
      >
        ⚡
      </motion.div>
      <h3 className="results-title" data-testid="results-title">
        {results?.extractedFields?.length || 0} details extracted
      </h3>
    </div>
    
    <div className="extracted-preview">
      {results?.extractedFields?.slice(0, 2).map((field, index) => (
        <motion.div
          key={index}
          className="field-preview"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          data-testid={`field-preview-${index}`}
        >
          <span className="field-label">{field.key}:</span>
          <span className="field-value">{field.value}</span>
          <span className="confidence-badge">{field.confidence}%</span>
        </motion.div>
      ))}
      
      {results?.extractedFields && results.extractedFields.length > 2 && (
        <div className="more-fields">
          +{results.extractedFields.length - 2} more fields
        </div>
      )}
    </div>
    
    <div className="action-buttons">
      <motion.button
        className="view-details-btn primary"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        data-testid="view-details-btn"
      >
        View All Details
      </motion.button>
      
      <motion.button
        className="upload-another-btn secondary"
        onClick={onReset}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        data-testid="upload-another-btn"
      >
        Upload Another
      </motion.button>
    </div>
  </motion.div>
);

// Error State Component
interface ErrorStateProps {
  error: string | null;
  onReset: () => void;
}

const ErrorState = ({ error, onReset }: ErrorStateProps) => (
  <motion.div
    className="upload-state upload-error-state"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="error-icon">❌</div>
    <h3 className="error-title" data-testid="error-title">Upload Failed</h3>
    <p className="error-description" data-testid="error-message">
      {error || 'Something went wrong. Please try again.'}
    </p>
    
    <motion.button
      className="retry-btn"
      onClick={onReset}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      data-testid="retry-btn"
    >
      Try Again
    </motion.button>
  </motion.div>
);

// Processing Step Component
interface ProcessingStepProps {
  label: string;
  completed?: boolean;
  active?: boolean;
}

const ProcessingStep = ({ label, completed = false, active = false }: ProcessingStepProps) => (
  <motion.div
    className={`processing-step ${completed ? 'completed' : ''} ${active ? 'active' : ''}`}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="step-indicator">
      {completed ? '✓' : active ? '⟳' : '○'}
    </div>
    <span className="step-label">{label}</span>
  </motion.div>
);

// Recent Uploads Sidebar Component
const RecentUploads = () => (
  <div className="recent-uploads">
    <h4 className="sidebar-title">Recent Uploads</h4>
    <div className="upload-list">
      <div className="upload-item">
        <div className="upload-thumbnail">📄</div>
        <div className="upload-details">
          <span className="upload-name">Driver License</span>
          <span className="upload-time">2 hours ago</span>
        </div>
      </div>
      <div className="upload-item">
        <div className="upload-thumbnail">📄</div>
        <div className="upload-details">
          <span className="upload-name">Insurance Card</span>
          <span className="upload-time">1 day ago</span>
        </div>
      </div>
    </div>
  </div>
);

// Quick Actions Sidebar Component
const QuickActions = () => (
  <div className="quick-actions">
    <h4 className="sidebar-title">Quick Actions</h4>
    <div className="action-list">
      <button className="action-item" data-testid="quick-camera">
        <span className="action-icon">📸</span>
        <span className="action-label">Take Photo</span>
      </button>
      <button className="action-item" data-testid="quick-scan">
        <span className="action-icon">📱</span>
        <span className="action-label">Mobile Scan</span>
      </button>
      <button className="action-item" data-testid="quick-family">
        <span className="action-icon">👥</span>
        <span className="action-label">Family Docs</span>
      </button>
    </div>
  </div>
);

export default EnhancedUploadCenter;