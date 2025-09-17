// Enhanced Single Upload Center - Professional Design
// Intelligent file type detection: Documents → Sidebar, Photos → Album

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './EnhancedSingleUploadCenter.css';

export interface EnhancedSingleUploadCenterProps {
  onDocumentUpload?: (files: File[]) => Promise<void>;
  onPhotoUpload?: (files: File[]) => Promise<void>;
  onNavigateToAlbum?: () => void;
}

export const EnhancedSingleUploadCenter: React.FC<EnhancedSingleUploadCenterProps> = ({ 
  onDocumentUpload, 
  onPhotoUpload,
  onNavigateToAlbum 
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<string | null>(null); // 'documents', 'photos', or 'mixed'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File type detection
  const detectFileTypes = (files: File[]) => {
    const documents: File[] = [];
    const photos: File[] = [];
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        photos.push(file);
      } else if (
        file.type.includes('pdf') || 
        file.type.includes('document') || 
        file.type.includes('text') ||
        file.name.toLowerCase().match(/\.(doc|docx|pdf|txt)$/)
      ) {
        documents.push(file);
      } else {
        // Default to documents for unknown types
        documents.push(file);
      }
    });

    return { documents, photos };
  };

  // Handle file upload with intelligent routing
  const handleFileUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { documents, photos } = detectFileTypes(files);
      
      // Determine upload type for UI feedback
      if (documents.length > 0 && photos.length > 0) {
        setUploadType('mixed');
        setUploadMessage(`Processing ${documents.length} document${documents.length > 1 ? 's' : ''} and ${photos.length} photo${photos.length > 1 ? 's' : ''}...`);
      } else if (documents.length > 0) {
        setUploadType('documents');
        setUploadMessage(`Processing ${documents.length} document${documents.length > 1 ? 's' : ''}...`);
      } else if (photos.length > 0) {
        setUploadType('photos');
        setUploadMessage(`Adding ${photos.length} photo${photos.length > 1 ? 's' : ''} to Family Album...`);
      }

      // Process documents
      if (documents.length > 0) {
        setUploadProgress(25);
        if (onDocumentUpload) {
          await onDocumentUpload(documents);
        }
        setUploadProgress(50);
      }

      // Process photos
      if (photos.length > 0) {
        setUploadProgress(75);
        if (onPhotoUpload) {
          await onPhotoUpload(photos);
        }
        setUploadProgress(90);
      }

      // Complete
      setUploadProgress(100);
      
      // Show success message
      if (documents.length > 0 && photos.length > 0) {
        setUploadMessage('Documents processed and photos added to album!');
      } else if (documents.length > 0) {
        setUploadMessage('Documents processed successfully!');
      } else if (photos.length > 0) {
        setUploadMessage('Photos added to Family Album!');
        // Auto-navigate to album for photos
        setTimeout(() => {
          if (onNavigateToAlbum) {
            onNavigateToAlbum();
          }
        }, 1500);
      }

      // Reset after delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadType(null);
        setUploadProgress(0);
        setUploadMessage('');
      }, 2000);

    } catch (error) {
      console.error('Upload failed:', error);
      setUploadMessage('Upload failed. Please try again.');
      setTimeout(() => {
        setIsUploading(false);
        setUploadType(null);
        setUploadProgress(0);
        setUploadMessage('');
      }, 3000);
    }
  };

  // Browse button handler
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Drag and drop handlers
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
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  return (
    <div className="enhanced-single-upload-center">
      {/* Main Upload Area - Professional Single Box Design */}
      <motion.div
        className={`main-upload-area ${isDragActive ? 'drag-active' : ''} ${isUploading ? 'uploading' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        whileHover={!isUploading ? { scale: 1.01 } : {}}
        transition={{ type: "spring", stiffness: 300 }}
        data-testid="enhanced-upload-area"
      >
        <div className="upload-content">
          {/* Upload Icon with Smart Animation */}
          <div className="upload-icon-container">
            {isUploading ? (
              <div className="upload-progress-circle">
                <svg className="progress-ring" width="80" height="80">
                  <circle
                    className="progress-ring-background"
                    stroke="var(--border-color)"
                    strokeWidth="4"
                    fill="transparent"
                    r="36"
                    cx="40"
                    cy="40"
                  />
                  <circle
                    className="progress-ring-progress"
                    stroke="var(--primary-gold)"
                    strokeWidth="4"
                    fill="transparent"
                    r="36"
                    cx="40"
                    cy="40"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 36}`,
                      strokeDashoffset: `${2 * Math.PI * 36 * (1 - uploadProgress / 100)}`,
                      transition: 'stroke-dashoffset 0.5s ease'
                    }}
                  />
                </svg>
                <div className="progress-percentage">{uploadProgress}%</div>
              </div>
            ) : (
              <motion.div
                className="upload-icon"
                animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </motion.div>
            )}
          </div>
          
          {/* Dynamic Content Based on State */}
          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div
                key="uploading"
                className="upload-status"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h3 className="upload-title">Processing Files</h3>
                <p className="upload-message">{uploadMessage}</p>
                <div className="upload-type-indicator">
                  {uploadType === 'documents' && (
                    <span className="type-badge documents">Documents → Analysis</span>
                  )}
                  {uploadType === 'photos' && (
                    <span className="type-badge photos">Photos → Family Album</span>
                  )}
                  {uploadType === 'mixed' && (
                    <div className="mixed-badges">
                      <span className="type-badge documents">Documents</span>
                      <span className="type-badge photos">Photos</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="ready"
                className="upload-ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h3>Upload Family Content</h3>
                <p>Drag & drop files here or click to browse</p>
                <p className="ai-text">AI will automatically organize documents and photos</p>
                
                <motion.button
                  className="browse-button"
                  onClick={handleBrowseClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid="button-browse-files"
                >
                  Browse Files
                </motion.button>
                
                <span className="or-text">or drop files</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Smart File Type Indicators */}
          {!isUploading && (
            <div className="file-types-section">
              <div className="file-types-group">
                <span className="group-label">Documents</span>
                <div className="file-types">
                  <span className="file-type documents">PDF</span>
                  <span className="file-type documents">DOC</span>
                  <span className="file-type documents">TXT</span>
                </div>
              </div>
              <div className="file-types-divider">•</div>
              <div className="file-types-group">
                <span className="group-label">Photos</span>
                <div className="file-types">
                  <span className="file-type photos">JPG</span>
                  <span className="file-type photos">PNG</span>
                  <span className="file-type photos">HEIC</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drag Overlay */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              className="drag-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="drag-content">
                <div className="drag-icon">⬇</div>
                <span>Drop files to upload</span>
                <div className="drag-hint">Documents and photos will be organized automatically</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Actions Section */}
      <div className="quick-actions-section">
        <div className="quick-action-item" onClick={onNavigateToAlbum} data-testid="button-view-album">
          <div className="action-icon">📖</div>
          <div className="action-content">
            <span className="action-title">Family Album</span>
            <span className="action-subtitle">View photos and memories</span>
          </div>
        </div>
        
        <div className="quick-action-item" data-testid="button-recent-documents">
          <div className="action-icon">📄</div>
          <div className="action-content">
            <span className="action-title">Recent Documents</span>
            <span className="action-subtitle">Access uploaded files</span>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
        accept="image/*,.pdf,.doc,.docx,.txt"
        multiple
        style={{ display: 'none' }}
        data-testid="input-enhanced-files"
      />
    </div>
  );
};

export default EnhancedSingleUploadCenter;