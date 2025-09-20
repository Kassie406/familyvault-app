import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Camera, Smartphone, Brain, Zap, CheckCircle2, AlertTriangle, X, QrCode, Mail, MessageSquare } from 'lucide-react';
import { useUploadStore } from '@/stores/uploadStore';
import { UploadCenterAIActions, type AIResult } from './UploadCenterAIActions';

// State-driven workflow matching video analysis
const TRUSTWORTHY_STATES = {
  BROWSE: 'browse',           // Initial browse button
  UPLOADING: 'uploading',     // File upload progress
  INBOX_OPEN: 'inbox_open',   // Left sidebar opens
  ANALYZING: 'analyzing',     // AI analysis in progress
  DETAILS_READY: 'details_ready', // Lightning bolt appears
  MODAL_OPEN: 'modal_open'    // Details modal showing extracted data
} as const;

type TrustworthyState = typeof TRUSTWORTHY_STATES[keyof typeof TRUSTWORTHY_STATES];

interface ExtractedField {
  key: string;
  value: string;
  confidence: number;
  pii?: boolean;
  path?: string;
}

interface TrustworthyUploadCenterProps {
  onFileUpload?: (files: File[]) => void;
  onAnalysisComplete?: (fileId: number, analysis: any) => void;
  onLeftSidebarOpen?: () => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  className?: string;
}

export default function TrustworthyUploadCenter({
  onFileUpload,
  onAnalysisComplete,
  onLeftSidebarOpen,
  maxFiles = 10,
  acceptedTypes = ['*'],
  className = ''
}: TrustworthyUploadCenterProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  // State management
  const [uploadState, setUploadState] = useState<TrustworthyState>(TRUSTWORTHY_STATES.BROWSE);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [extractedData, setExtractedData] = useState<ExtractedField[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AIResult | null>(null);
  const [showMobileUploadModal, setShowMobileUploadModal] = useState(false);
  const [mobileUploadUrl, setMobileUploadUrl] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const { uploads, addUpload, updateUpload } = useUploadStore();

  // Enhanced upload workflow with AI integration
  const enhancedUploadWorkflow = async (
    file: File,
    progressCallback: (progress: number) => void,
    stateCallback: (state: string) => void
  ) => {
    try {
      // Phase 1: Upload to S3
      stateCallback('uploading');
      const uploadId = addUpload(file, 'browse');
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        progressCallback(progress);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Phase 2: Register with backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadId', uploadId.toString());
      
      const registerResponse = await fetch('/api/inbox/register', {
        method: 'POST',
        body: formData
      });
      
      if (!registerResponse.ok) throw new Error('Failed to register upload');
      const { id: backendId } = await registerResponse.json();
      
      // Phase 3: Start AI analysis
      stateCallback('processing');
      updateUpload(uploadId, { status: 'analyzing', backendId });
      
      const analysisResponse = await fetch(`/api/inbox/${backendId}/analyze`, {
        method: 'POST'
      });
      
      if (!analysisResponse.ok) throw new Error('AI analysis failed');
      const analysisData = await analysisResponse.json();
      
      // Phase 4: Complete
      stateCallback('complete');
      updateUpload(uploadId, { 
        status: 'complete',
        analyzed: true,
        result: analysisData
      });
      
      return {
        uploadId,
        backendId,
        analysis: analysisData.suggestions || analysisData.result
      };
      
    } catch (error) {
      console.error('Enhanced upload workflow error:', error);
      throw error;
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0]; // Handle single file for now
    setCurrentFile(file);
    setUploadState(TRUSTWORTHY_STATES.UPLOADING);
    
    try {
      const workflowResult = await enhancedUploadWorkflow(
        file,
        (progress) => {
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
        },
        (state: string) => {
          // Map states to UI updates
          if (state === 'processing') {
            setUploadState(TRUSTWORTHY_STATES.ANALYZING);
          } else if (state === 'complete') {
            setUploadState(TRUSTWORTHY_STATES.DETAILS_READY);
            // Auto-open left sidebar after analysis
            setTimeout(() => {
              setUploadState(TRUSTWORTHY_STATES.INBOX_OPEN);
              if (onLeftSidebarOpen) {
                onLeftSidebarOpen();
              }
            }, 1000);
          }
        }
      );

      setExtractedData(workflowResult.analysis?.fields || []);
      setAnalysisResult(workflowResult.analysis);

      // Show success toast
      showSuccessToast(files.length);

      // Notify parent component
      if (onFileUpload) {
        onFileUpload(files);
      }

      if (onAnalysisComplete) {
        onAnalysisComplete(workflowResult.uploadId, workflowResult.analysis);
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadState(TRUSTWORTHY_STATES.BROWSE);
      showErrorToast('Upload failed. Please try again.');
    }
  };

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleTakePhoto = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  const handleMobileUpload = useCallback(async () => {
    try {
      const response = await fetch('/api/uploads/generate-mobile-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ttl: 900 })
      });
      
      if (!response.ok) throw new Error('Failed to generate upload URL');
      
      const data = await response.json();
      setMobileUploadUrl(data.uploadUrl);
      setShowMobileUploadModal(true);
    } catch (error) {
      console.error('Error generating mobile upload URL:', error);
      showErrorToast('Failed to generate mobile upload link. Please try again.');
    }
  }, []);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files).slice(0, maxFiles);
    await handleFileUpload(fileArray);
  }, [maxFiles]);

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

  const showSuccessToast = (fileCount: number) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
    toast.innerHTML = `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
      </svg>
      Uploaded ${fileCount} file${fileCount > 1 ? 's' : ''}. AI analysis complete!
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 5000);
  };

  const showErrorToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
    toast.innerHTML = `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
      </svg>
      ${message}
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 5000);
  };

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
      
      showSuccessToast(1);
      setShowMobileUploadModal(false);
    } catch (error) {
      console.error('Error sending mobile link:', error);
      showErrorToast(`Failed to send link via ${method}. Please try again.`);
    }
  }, [mobileUploadUrl]);

  const detectDocumentType = (fields: ExtractedField[], fileName: string): string => {
    const fieldTexts = fields.map(f => `${f.key} ${f.value}`).join(' ').toLowerCase();
    const name = fileName.toLowerCase();

    if (fieldTexts.includes('driver') || fieldTexts.includes('license') || name.includes('license')) return 'Driver License';
    if (fieldTexts.includes('social security') || fieldTexts.includes('ssa') || name.includes('ssn')) return 'Social Security Document';
    if (fieldTexts.includes('passport') || name.includes('passport')) return 'Passport';
    if (fieldTexts.includes('insurance') || name.includes('insurance')) return 'Insurance Document';
    if (fieldTexts.includes('medical') || fieldTexts.includes('health') || name.includes('medical')) return 'Medical Record';
    if (fieldTexts.includes('tax') || name.includes('tax') || name.includes('1040')) return 'Tax Document';
    if (fieldTexts.includes('legal') || fieldTexts.includes('contract') || name.includes('legal')) return 'Legal Document';

    return 'Identity Document';
  };

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
            {uploadState === TRUSTWORTHY_STATES.ANALYZING ? (
              <Brain className="h-8 w-8 text-[#c5a000] animate-pulse" />
            ) : uploadState === TRUSTWORTHY_STATES.DETAILS_READY ? (
              <Zap className="h-8 w-8 text-[#c5a000]" />
            ) : (
              <Upload className={`h-8 w-8 ${isDragOver ? 'text-[#c5a000]' : 'text-zinc-400'}`} />
            )}
          </motion.div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            {uploadState === TRUSTWORTHY_STATES.UPLOADING ? 'Uploading...' :
             uploadState === TRUSTWORTHY_STATES.ANALYZING ? 'AI Analyzing Document...' :
             uploadState === TRUSTWORTHY_STATES.DETAILS_READY ? 'Analysis Complete!' :
             isDragOver ? 'Drop to upload' : 'Upload Documents & Photos'}
          </h3>
          
          <p className="text-zinc-400 mb-6">
            {uploadState === TRUSTWORTHY_STATES.ANALYZING ? 'Using AWS Textract + OpenAI Vision for smart extraction' :
             uploadState === TRUSTWORTHY_STATES.DETAILS_READY ? 'Click the lightning bolt to view extracted data' :
             'Drag and drop files here, or use the buttons below'}
          </p>

          {/* 3-Button Action Tray */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
            {/* Browse Files Button */}
            <motion.button
              className="w-full md:w-auto min-w-[180px] h-12 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#c5a000] text-black font-medium rounded-xl hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#c5a000] focus:ring-offset-2 focus:ring-offset-[#121217] transition-all disabled:opacity-50"
              onClick={handleBrowseClick}
              whileHover={{ scale: uploadState === TRUSTWORTHY_STATES.BROWSE ? 1.02 : 1 }}
              whileTap={{ scale: uploadState === TRUSTWORTHY_STATES.BROWSE ? 0.98 : 1 }}
              data-testid="button-browse-files"
              disabled={uploadState !== TRUSTWORTHY_STATES.BROWSE}
            >
              <FileText className="h-5 w-5" />
              Browse Files
            </motion.button>

            {/* Take Photo Button */}
            <motion.button
              className="w-full md:w-auto min-w-[180px] h-12 inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#c5a000] focus:ring-offset-2 focus:ring-offset-[#121217] transition-all disabled:opacity-50"
              onClick={handleTakePhoto}
              whileHover={{ scale: uploadState === TRUSTWORTHY_STATES.BROWSE ? 1.02 : 1 }}
              whileTap={{ scale: uploadState === TRUSTWORTHY_STATES.BROWSE ? 0.98 : 1 }}
              data-testid="button-take-photo"
              disabled={uploadState !== TRUSTWORTHY_STATES.BROWSE}
            >
              <Camera className="h-5 w-5" />
              Take Photo
            </motion.button>

            {/* Mobile Upload Button */}
            <motion.button
              className="w-full md:w-auto min-w-[180px] h-12 inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#c5a000] focus:ring-offset-2 focus:ring-offset-[#121217] transition-all disabled:opacity-50"
              onClick={handleMobileUpload}
              whileHover={{ scale: uploadState === TRUSTWORTHY_STATES.BROWSE ? 1.02 : 1 }}
              whileTap={{ scale: uploadState === TRUSTWORTHY_STATES.BROWSE ? 0.98 : 1 }}
              data-testid="button-mobile-upload"
              disabled={uploadState !== TRUSTWORTHY_STATES.BROWSE}
            >
              <Smartphone className="h-5 w-5" />
              Mobile Upload
            </motion.button>
          </div>

          {/* Lightning Bolt for Details */}
          <AnimatePresence>
            {uploadState === TRUSTWORTHY_STATES.DETAILS_READY && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#c5a000] text-black font-medium rounded-lg hover:brightness-110 transition-all"
                onClick={() => setShowDetailsModal(true)}
                data-testid="button-view-details"
              >
                <Zap className="h-4 w-4" />
                View Extracted Data
              </motion.button>
            )}
          </AnimatePresence>

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
          {uploadState === TRUSTWORTHY_STATES.UPLOADING && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#c5a000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white font-medium">Uploading to secure storage...</p>
                {currentFile && (
                  <p className="text-zinc-400 text-sm mt-2">
                    {Math.round(uploadProgress[currentFile.name] || 0)}% complete
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Actions Component */}
      {currentFile && uploadState === TRUSTWORTHY_STATES.BROWSE && (
        <UploadCenterAIActions
          file={currentFile}
          onApply={(fields) => {
            setExtractedData(fields);
            setShowDetailsModal(true);
          }}
        />
      )}

      {/* Recent Uploads Strip */}
      {recentUploads.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-[#c5a000]" />
            Recent Uploads
            <span className="text-sm text-zinc-400 font-normal">
              ({recentUploads.length} item{recentUploads.length !== 1 ? 's' : ''})
            </span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentUploads.map((upload) => {
              const progress = uploadProgress[upload.id.toString()] || 0;
              
              return (
                <motion.div
                  key={upload.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-[#121217] border border-[#25252b] rounded-lg hover:border-[#c5a000]/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-[#c5a000]" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate text-sm">{upload.file.name}</p>
                      <p className="text-xs text-zinc-400">{formatFileSize(upload.file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {upload.status === 'analyzing' && (
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Brain className="h-3 w-3 animate-pulse" />
                        <span className="text-xs">AI Analyzing...</span>
                      </div>
                    )}
                    
                    {upload.status === 'complete' && (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle2 className="h-3 w-3" />
                        <span className="text-xs">Complete</span>
                      </div>
                    )}
                    
                    {upload.status === 'error' && (
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="text-xs">Error</span>
                      </div>
                    )}

                    {upload.analyzed && (
                      <button className="text-xs text-[#c5a000] hover:underline">
                        View Details
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* File Type Support Info */}
      <div className="text-center text-sm text-zinc-500">
        <p>Supports: PDF, Images (JPG, PNG, HEIC), Documents (DOC, DOCX), and more</p>
        <p>Maximum file size: 50MB per file • AI-powered extraction with AWS Textract + OpenAI Vision</p>
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
                <div className="mx-auto w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                  <QrCode className="h-24 w-24 text-black" />
                </div>

                <p className="text-zinc-400 text-sm">
                  Scan this QR code with your mobile device to upload files directly
                </p>

                <div className="text-xs text-zinc-500 bg-[#25252b] rounded-lg p-3">
                  Link expires in 15 minutes
                </div>

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

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && extractedData.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#121217] border border-[#25252b] rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#c5a000]" />
                  <h3 className="text-lg font-semibold text-white">AI Extracted Data</h3>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-[#25252b] rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-zinc-400" />
                </button>
              </div>

              {currentFile && (
                <div className="mb-4 p-3 bg-[#25252b] rounded-lg">
                  <p className="text-sm text-zinc-400">Document Type</p>
                  <p className="text-white font-medium">{detectDocumentType(extractedData, currentFile.name)}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {extractedData.map((field, index) => (
                  <div key={index} className="p-3 bg-[#25252b] rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-zinc-400">
                        {field.key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                      <div className="flex items-center gap-2">
                        {field.pii && (
                          <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">PII</span>
                        )}
                        <span className="px-2 py-1 bg-[#c5a000]/20 text-[#c5a000] text-xs rounded">
                          {Math.round(field.confidence)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-sm font-mono break-words text-white">
                      {field.value || "—"}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-[#25252b] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Apply extracted data to form or save
                    console.log('Applying extracted data:', extractedData);
                    setShowDetailsModal(false);
                  }}
                  className="px-4 py-2 bg-[#c5a000] text-black rounded-lg hover:brightness-110 transition-all"
                >
                  Apply Data
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
