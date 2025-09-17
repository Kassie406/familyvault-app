// Dual Upload Center - Documents & Photos
// Left: Upload Family Documents | Right: Upload Photos

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DualUploadCenterProps {
  onDocumentUpload?: (files: File[]) => Promise<void>;
  onPhotoUpload?: (files: File[]) => Promise<void>;
  onNavigateToAlbum?: () => void;
}

export const DualUploadCenter: React.FC<DualUploadCenterProps> = ({ 
  onDocumentUpload, 
  onPhotoUpload,
  onNavigateToAlbum 
}) => {
  const [documentDragActive, setDocumentDragActive] = useState(false);
  const [photoDragActive, setPhotoDragActive] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: number; type: string; message: string }>>([]);

  const documentInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Utility function to generate unique IDs
  const generateId = () => Date.now() + Math.random();

  // Notification management
  const addNotification = (type: string, message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Document Upload Handlers
  const handleDocumentBrowse = () => {
    console.log('Document browse clicked, ref:', documentInputRef.current);
    if (documentInputRef.current) {
      documentInputRef.current.click();
      console.log('File input clicked successfully');
    } else {
      console.error('Document input ref is null');
    }
  };

  const handleDocumentDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDocumentDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    const documentFiles = files.filter(file => 
      file.type.includes('pdf') || 
      file.type.includes('document') || 
      file.type.includes('text') ||
      file.name.toLowerCase().includes('.doc')
    );
    if (documentFiles.length > 0) {
      handleDocumentUpload(documentFiles);
    }
  };

  const handleDocumentUpload = async (files: File[]) => {
    setUploadingDocuments(true);
    try {
      if (onDocumentUpload) {
        await onDocumentUpload(files);
        addNotification('document', `${files.length} document${files.length > 1 ? 's' : ''} uploaded successfully`);
      }
    } catch (error) {
      console.error('Document upload failed:', error);
      addNotification('document', 'Document upload failed');
    } finally {
      setUploadingDocuments(false);
    }
  };

  // Photo Upload Handlers
  const handlePhotoBrowse = () => {
    console.log('Photo browse clicked, ref:', photoInputRef.current);
    if (photoInputRef.current) {
      photoInputRef.current.click();
      console.log('Photo file input clicked successfully');
    } else {
      console.error('Photo input ref is null');
    }
  };

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setPhotoDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      handlePhotoUpload(imageFiles);
    }
  };

  const handlePhotoUpload = async (files: File[]) => {
    setUploadingPhotos(true);
    try {
      if (onPhotoUpload) {
        await onPhotoUpload(files);
        addNotification('photo', `${files.length} photo${files.length > 1 ? 's' : ''} added to Family Album`);
        
        // Auto-navigate to Family Album after upload
        setTimeout(() => {
          if (onNavigateToAlbum) {
            onNavigateToAlbum();
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Photo upload failed:', error);
      addNotification('photo', 'Photo upload failed');
    } finally {
      setUploadingPhotos(false);
    }
  };

  // Drag handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDocumentDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDocumentDragActive(true);
  };

  const handleDocumentDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDocumentDragActive(false);
    }
  };

  const handlePhotoDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setPhotoDragActive(true);
  };

  const handlePhotoDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setPhotoDragActive(false);
    }
  };

  return (
    <div className="dual-upload-center">
      {/* Family Header */}
      <div className="family-header">
        <h2 className="family-title">camacho Family</h2>
        <div className="user-avatars">
          <div className="avatar">KC</div>
          <div className="avatar">AQ</div>
        </div>
      </div>

      {/* Dual Upload Boxes */}
      <div className="upload-boxes-container">
        
        {/* LEFT BOX: Upload Family Documents */}
        <motion.div
          className={`upload-box document-upload ${documentDragActive ? 'drag-active' : ''} ${uploadingDocuments ? 'uploading' : ''}`}
          onDrop={handleDocumentDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDocumentDragEnter}
          onDragLeave={handleDocumentDragLeave}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          data-testid="upload-documents"
        >
          <div className="upload-content">
            <h3>Upload Family Documents</h3>
            
            <motion.button
              className="browse-button primary"
              onClick={handleDocumentBrowse}
              disabled={uploadingDocuments}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="button-browse-documents"
            >
              {uploadingDocuments ? 'Uploading...' : 'Browse'}
            </motion.button>
            
            {/* Document File Types */}
            <div className="file-types">
              <span className="file-type">PDF</span>
              <span className="file-type">DOC</span>
              <span className="file-type">TXT</span>
            </div>
          </div>

          {/* Upload Progress Overlay */}
          {uploadingDocuments && (
            <div className="upload-overlay">
              <div className="upload-progress">
                <div className="progress-bar"></div>
                <span>Processing documents...</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* RIGHT BOX: Upload Photos */}
        <motion.div
          className={`upload-box photo-upload ${photoDragActive ? 'drag-active' : ''} ${uploadingPhotos ? 'uploading' : ''}`}
          onDrop={handlePhotoDrop}
          onDragOver={handleDragOver}
          onDragEnter={handlePhotoDragEnter}
          onDragLeave={handlePhotoDragLeave}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          data-testid="upload-photos"
        >
          <div className="upload-content">
            <h3>Upload Photos</h3>
            
            <motion.button
              className="browse-button secondary"
              onClick={handlePhotoBrowse}
              disabled={uploadingPhotos}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="button-browse-photos"
            >
              {uploadingPhotos ? 'Uploading...' : 'Browse Photos'}
            </motion.button>
            
            {/* Photo File Types */}
            <div className="file-types">
              <span className="file-type">JPG</span>
              <span className="file-type">PNG</span>
              <span className="file-type">HEIC</span>
            </div>
            
            {/* View Family Album Button */}
            <button 
              className="view-album-btn"
              onClick={onNavigateToAlbum}
              data-testid="button-view-album"
            >
              View Family Album
            </button>
          </div>

          {/* Upload Progress Overlay */}
          {uploadingPhotos && (
            <div className="upload-overlay">
              <div className="upload-progress">
                <div className="progress-bar photo-progress"></div>
                <span>Adding to Family Album...</span>
              </div>
            </div>
          )}

        </motion.div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={documentInputRef}
        type="file"
        onChange={(e) => handleDocumentUpload(Array.from(e.target.files || []))}
        accept=".pdf,.doc,.docx,.txt"
        multiple
        style={{ display: 'none' }}
        data-testid="input-document-files"
      />
      
      <input
        ref={photoInputRef}
        type="file"
        onChange={(e) => handlePhotoUpload(Array.from(e.target.files || []))}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        data-testid="input-photo-files"
      />

      {/* Upload Success Notifications */}
      <div className="upload-notifications">
        <AnimatePresence>
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              className={`notification ${notification.type}`}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
              data-testid={`notification-${notification.type}`}
            >
              <div className="notification-content">
                <span>{notification.message}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Hook for managing dual uploads
export const useDualUpload = () => {
  const [documentUploads, setDocumentUploads] = useState<any[]>([]);
  const [photoUploads, setPhotoUploads] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadDocuments = async (files: File[]) => {
    setIsUploading(true);
    try {
      // Process document files
      const processedDocs = await Promise.all(
        files.map(async (file) => ({
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          type: 'document' as const,
          uploadTime: new Date().toISOString(),
          status: 'processing' as const
        }))
      );
      
      setDocumentUploads(prev => [...processedDocs, ...prev]);
      return processedDocs;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadPhotos = async (files: File[]) => {
    setIsUploading(true);
    try {
      // Process photo files
      const processedPhotos = await Promise.all(
        files.map(async (file) => ({
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          type: 'photo' as const,
          uploadTime: new Date().toISOString(),
          status: 'processing' as const,
          thumbnail: await generateThumbnail(file)
        }))
      );
      
      setPhotoUploads(prev => [...processedPhotos, ...prev]);
      return processedPhotos;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    documentUploads,
    photoUploads,
    uploadDocuments,
    uploadPhotos,
    isUploading
  };
};

// Utility functions
const generateId = () => Date.now() + Math.random();

const generateThumbnail = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set thumbnail size
        const maxSize = 150;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw resized image
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export default DualUploadCenter;