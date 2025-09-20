import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image, Video, Music, Archive, File, X, Check, AlertCircle, Brain, Camera, Smartphone, QrCode, Mail, MessageSquare } from 'lucide-react';
import { useUploadStore } from '@/stores/uploadStore';

interface EnhancedSingleUploadCenterProps {
  onFileUpload?: (files: File[]) => void;
  onAnalysisComplete?: (fileId: number, analysis: any) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  className?: string;
}

export default function EnhancedSingleUploadCenter({
  onFileUpload,
  onAnalysisComplete,
  maxFiles = 10,
  acceptedTypes = ['*'],
  className = ''
}: EnhancedSingleUploadCenterProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [showMobileUploadModal, setShowMobileUploadModal] = useState(false);
  const [mobileUploadUrl, setMobileUploadUrl] = useState('');
  const [recent, setRecent] = useState<Array<{name: string; status: 'Uploading'|'Analyzing'|'Filed'; progress?: number}>>([]);
  
  const { uploads, addUpload, updateUpload } = useUploadStore();

  const getFileIcon = (file: File) => {
    const type = file.type.toLowerCase();
    if (type.startsWith('image/')) return <Image className="h-8 w-8 text-blue-400" />;
    if (type.startsWith('video/')) return <Video className="h-8 w-8 text-purple-400" />;
    if (type.startsWith('audio/')) return <Music className="h-8 w-8 text-green-400" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="h-8 w-8 text-red-400" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="h-8 w-8 text-yellow-400" />;
    return <File className="h-8 w-8 text-gray-400" />;
  };

  const getFileTypeIndicator = (file: File) => {
    const type = file.type.toLowerCase();
    if (type.startsWith('image/')) return { label: 'Image', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    if (type.startsWith('video/')) return { label: 'Video', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    if (type.startsWith('audio/')) return { label: 'Audio', color: 'bg-green-500/10 text-green-400 border-green-500/20' };
    if (type.includes('pdf')) return { label: 'PDF', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
    if (type.includes('document')) return { label: 'Document', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
    return { label: 'File', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
  };

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleTakePhoto = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  const handleMobileUpload = useCallback(async () => {
    try {
      // Generate signed upload URL with 15-minute TTL
      const response = await fetch('/api/uploads/generate-mobile-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ttl: 900 }) // 15 minutes
      });
      
      if (!response.ok) throw new Error('Failed to generate upload URL');
      
      const data = await response.json();
      setMobileUploadUrl(data.uploadUrl);
      setShowMobileUploadModal(true);
    } catch (error) {
      console.error('Error generating mobile upload URL:', error);
      alert('Failed to generate mobile upload link. Please try again.');
    }
  }, []);

  const handleSendLink = useCallback(async (method: 'email' | 'sms') => {
    try {
      const response = await fetch('/api/uploads/send-mobile-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          uploadUrl: mobileUploadUrl,
          method 
        })
      });
      
      if (!response.ok) throw new Error('Failed to send link');
      
      alert(`Upload link sent via ${method}!`);
      setShowMobileUploadModal(false);
    } catch (error) {
      console.error('Error sending mobile link:', error);
      alert(`Failed to send link via ${method}. Please try again.`);
    }
  }, [mobileUploadUrl]);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).slice(0, maxFiles);
    setIsUploading(true);

    try {
      // Add files to store and start upload process
      const uploadIds: number[] = [];
      
      for (const file of fileArray) {
        const uploadId = addUpload(file, 'browse');
        uploadIds.push(uploadId);
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[uploadId.toString()] || 0;
            const newProgress = Math.min(currentProgress + Math.random() * 20, 100);
            
            if (newProgress >= 100) {
              clearInterval(progressInterval);
              // Mark as complete and start AI analysis
              updateUpload(uploadId, { status: 'analyzing' });
              startAIAnalysis(uploadId, file);
            }
            
            return { ...prev, [uploadId.toString()]: newProgress };
          });
        }, 200);
      }

      // Show success toast
      showSuccessToast(fileArray.length);

      // Notify parent component
      if (onFileUpload) {
        onFileUpload(fileArray);
      }

    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [addUpload, updateUpload, maxFiles, onFileUpload]);

  const showSuccessToast = (fileCount: number) => {
    // Create and show toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
    toast.innerHTML = `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
      </svg>
      Uploaded ${fileCount} file${fileCount > 1 ? 's' : ''}. Analyzing...
    `;
    document.body.appendChild(toast);
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 5000);
  };

  const startAIAnalysis = async (uploadId: number, file: File) => {
    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      
      // Mock analysis result
      const analysisResult = {
        documentType: detectDocumentType(file.name),
        extractedText: `Extracted content from ${file.name}`,
        confidence: 0.85 + Math.random() * 0.15,
        suggestedCategory: 'documents',
        identifiedPerson: 'Family Member'
      };

      updateUpload(uploadId, { 
        status: 'complete', 
        analyzed: true,
        result: {
          extractedData: analysisResult,
          extractedText: analysisResult.extractedText
        }
      });

      // Auto-open AI Inbox when analysis completes
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openAIInbox'));
      }, 1000);

      if (onAnalysisComplete) {
        onAnalysisComplete(uploadId, analysisResult);
      }

    } catch (error) {
      console.error('AI analysis error:', error);
      updateUpload(uploadId, { status: 'error' });
    }
  };

  const detectDocumentType = (filename: string): string => {
    const name = filename.toLowerCase();
    if (name.includes('medical') || name.includes('health')) return 'Medical Record';
    if (name.includes('insurance')) return 'Insurance Document';
    if (name.includes('tax')) return 'Tax Document';
    if (name.includes('legal')) return 'Legal Document';
    return 'General Document';
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const recentUploads = uploads.slice(-3);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
          isDragOver
            ? 'border-[#c5a000] bg-[#c5a000]/5 scale-[1.02]'
            : 'border-[#25252b] hover:border-[#25252b]/80'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <motion.div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isDragOver ? 'bg-[#c5a000]/20' : 'bg-[#121217]'
            }`}
            animate={{ scale: isDragOver ? 1.1 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Upload className={`h-8 w-8 ${isDragOver ? 'text-[#c5a000]' : 'text-zinc-400'}`} />
          </motion.div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            {isDragOver ? 'Drop to upload' : 'Upload Documents & Photos'}
          </h3>
          
          <p className="text-zinc-400 mb-6">
            Drag and drop files here, or use the buttons below
          </p>

          {/* 3-Button Action Tray */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
            {/* Browse Files Button */}
            <motion.button
              className="w-full md:w-auto min-w-[180px] h-12 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#c5a000] text-black font-medium rounded-xl hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#c5a000] focus:ring-offset-2 focus:ring-offset-[#121217] transition-all"
              onClick={handleBrowseClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-browse-files"
              disabled={isUploading}
            >
              <FileText className="h-5 w-5" />
              Browse Files
            </motion.button>

            {/* Take Photo Button */}
            <motion.button
              className="w-full md:w-auto min-w-[180px] h-12 inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#c5a000] focus:ring-offset-2 focus:ring-offset-[#121217] transition-all"
              onClick={handleTakePhoto}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-take-photo"
              disabled={isUploading}
            >
              <Camera className="h-5 w-5" />
              Take Photo
            </motion.button>

            {/* Mobile Upload Button */}
            <motion.button
              className="w-full md:w-auto min-w-[180px] h-12 inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#c5a000] focus:ring-offset-2 focus:ring-offset-[#121217] transition-all"
              onClick={handleMobileUpload}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-mobile-upload"
              disabled={isUploading}
            >
              <Smartphone className="h-5 w-5" />
              Mobile Upload
            </motion.button>
          </div>

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept="application/pdf,image/jpeg,image/png,image/heic,.doc,.docx"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          
          <input
            ref={cameraInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {/* Upload Progress Overlay */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#c5a000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white font-medium">Uploading files...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent uploads (max 3) list below buttons with aria-live for screen readers */}
      {recent.length > 0 && (
        <div role="status" aria-live="polite" className="mt-4">
          <ul className="text-left max-w-xl mx-auto space-y-2">
            {recent.slice(0, 3).map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span 
                  className="inline-block w-2 h-2 rounded-full"
                  style={{
                    background: f.status === 'Filed' ? '#059669' : 
                               f.status === 'Analyzing' ? '#c5a000' : '#6366f1'
                  }}
                />
                <span className="truncate">{f.name}</span>
                <span className="ml-auto opacity-75">{f.status}</span>
                {/* Progress bar per file while uploading */}
                {f.status === 'Uploading' && f.progress !== undefined && (
                  <div className="h-1 bg-[#1f1f26] rounded-full w-24 overflow-hidden">
                    <div 
                      className="h-full bg-[#6366f1]" 
                      style={{ width: f.progress + '%' }} 
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
          {recent.length > 3 && (
            <div className="mt-2 text-center">
              <button className="text-xs text-[#c5a000] hover:text-[#c5a000]/80 transition-colors">
                View all ({recent.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick links under list */}
      <div className="mt-3 text-xs opacity-75">
        <a href="/documents" className="hover:text-[#c5a000]">View All Documents</a>
        <span className="mx-2">•</span>
        <a href="/folders" className="hover:text-[#c5a000]">Manage Folders</a>
      </div>

      {/* File Type Support Info */}
      <div className="text-center text-sm text-zinc-500">
        <p>Supports: PDF, Images (JPG, PNG, HEIC), Documents (DOC, DOCX), and more</p>
        <p>Maximum file size: 50MB per file</p>
      </div>

      {/* Mobile Upload Modal */}
      <AnimatePresence>
        {showMobileUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowMobileUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#121217] border border-[#25252b] rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Mobile Upload</h3>
                <button
                  onClick={() => setShowMobileUploadModal(false)}
                  className="p-2 hover:bg-[#25252b] rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-zinc-400" />
                </button>
              </div>

              <div className="text-center space-y-4">
                {/* QR Code Placeholder */}
                <div className="mx-auto w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                  <QrCode className="h-24 w-24 text-black" />
                </div>

                <p className="text-zinc-400 text-sm">
                  Scan this QR code with your mobile device to upload files directly
                </p>

                <div className="text-xs text-zinc-500 bg-[#25252b] rounded-lg p-3">
                  Link expires in 15 minutes
                </div>

                {/* Send Link Options */}
                <div className="space-y-2">
                  <p className="text-white font-medium">Or send me a link:</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSendLink('email')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </button>
                    <button
                      onClick={() => handleSendLink('sms')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      SMS
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
