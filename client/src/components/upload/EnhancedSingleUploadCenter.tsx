import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image, Video, Music, Archive, File, X, Check, AlertCircle, Brain } from 'lucide-react';
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
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  
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
            ? 'border-[#D4AF37] bg-[#D4AF37]/5 scale-[1.02]'
            : 'border-zinc-700 hover:border-zinc-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <motion.div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isDragOver ? 'bg-[#D4AF37]/20' : 'bg-zinc-800'
            }`}
            animate={{ scale: isDragOver ? 1.1 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Upload className={`h-8 w-8 ${isDragOver ? 'text-[#D4AF37]' : 'text-zinc-400'}`} />
          </motion.div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            {isDragOver ? 'Drop files here' : 'Upload Documents & Photos'}
          </h3>
          
          <p className="text-zinc-400 mb-6">
            Drag and drop files here, or click browse to select files
          </p>

          {/* Browse Button */}
          <motion.button
            className="browse-button inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#B8860B] transition-colors"
            onClick={handleBrowseClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-testid="button-browse-files"
            disabled={isUploading}
          >
            <FileText className="h-5 w-5" />
            Browse Files
          </motion.button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept={acceptedTypes.join(',')}
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
                <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white font-medium">Uploading files...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Uploads */}
      {recentUploads.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-[#D4AF37]" />
            Recent Uploads
          </h4>
          
          <div className="space-y-2">
            {recentUploads.map((upload) => {
              const typeInfo = getFileTypeIndicator(upload.file);
              const progress = uploadProgress[upload.id.toString()] || 0;
              
              return (
                <motion.div
                  key={upload.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(upload.file)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-white truncate">{upload.file.name}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <span>{formatFileSize(upload.file.size)}</span>
                      
                      {upload.status === 'pending' && progress < 100 && (
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-zinc-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-[#D4AF37]"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <span>{Math.round(progress)}%</span>
                        </div>
                      )}
                      
                      {upload.status === 'analyzing' && (
                        <div className="flex items-center gap-2 text-yellow-400">
                          <Brain className="h-4 w-4 animate-pulse" />
                          <span>AI Analyzing...</span>
                        </div>
                      )}
                      
                      {upload.status === 'complete' && (
                        <div className="flex items-center gap-2 text-green-400">
                          <Check className="h-4 w-4" />
                          <span>Complete</span>
                        </div>
                      )}
                      
                      {upload.status === 'error' && (
                        <div className="flex items-center gap-2 text-red-400">
                          <AlertCircle className="h-4 w-4" />
                          <span>Error</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* File Type Support Info */}
      <div className="text-center text-sm text-zinc-500">
        <p>Supports: PDF, Images (JPG, PNG), Documents (DOC, DOCX), and more</p>
        <p>Maximum file size: 50MB per file</p>
      </div>
    </div>
  );
}
