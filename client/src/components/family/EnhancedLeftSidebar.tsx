import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Smartphone, FolderOpen, Shield, Mail, Eye, ShieldAlert, Edit3 } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: number;
  status: 'pending' | 'processing' | 'complete' | 'error';
}

interface EnhancedAnalysisResult {
  documentType: string;
  confidence: number;
  extractedData: Record<string, any>;
  identifiedPerson?: {
    name: string;
    relationship: string;
  };
  suggestedActions: string[];
  routing: {
    category: string;
    subcategory: string;
    priority: 'low' | 'medium' | 'high';
  };
}

interface EnhancedLeftSidebarProps {
  isOpen: boolean;
  documents: Document[];
  onClose: () => void;
  mainMenuWidth?: number;
  onDocumentAnalyze?: (document: Document, analysisResult: EnhancedAnalysisResult) => void;
  onDocumentRoute?: (document: Document, person: EnhancedAnalysisResult['identifiedPerson']) => void;
}

export default function EnhancedLeftSidebar({ 
  isOpen, 
  documents = [], 
  onClose, 
  mainMenuWidth = 256,
  onDocumentAnalyze,
  onDocumentRoute 
}: EnhancedLeftSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileUpload = (files: File[]) => {
    // Handle file upload logic here
    console.log('Files to upload:', files);
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
  };

  const handleTakePhoto = () => {
    // Handle camera capture logic
    console.log('Take photo clicked');
  };

  const handleMobileUpload = () => {
    // Handle mobile upload logic
    console.log('Mobile upload clicked');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop positioned to not cover main sidebar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            style={{ left: `${mainMenuWidth}px` }}
            onClick={onClose}
          />

          {/* Sidebar positioned next to main menu */}
          <motion.aside
            ref={sidebarRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="inbox-sidebar fixed top-0 h-full w-96 bg-[#0A0A0A] border-r border-[#2A2A33] z-50 shadow-2xl"
            style={{ left: `${mainMenuWidth}px` }}
          >
            {/* Header */}
            <header className="flex items-center justify-between p-6 border-b border-[#2A2A33]">
              <div>
                <h2 className="text-xl font-bold text-white">Inbox</h2>
                <p className="text-sm text-gray-400">Drop files, forward emails, or browse to add documents to your family vault</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors text-gray-400 hover:text-white"
                data-testid="close-enhanced-left-sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* Content */}
            <div className="documents-list flex-1 overflow-y-auto p-6 space-y-6">
              {/* Top Buttons Section */}
              <div className="grid grid-cols-3 gap-3">
                <motion.button
                  onClick={handleBrowseFiles}
                  className="upload-method-button browse-files flex flex-col items-center justify-center p-4 rounded-xl relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
                    color: '#0F0F0F',
                    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div className="shimmer-overlay" />
                  <FolderOpen className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Browse Files</span>
                </motion.button>
                <motion.button
                  onClick={handleTakePhoto}
                  className="upload-method-button take-photo flex flex-col items-center justify-center p-4 rounded-xl relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div className="shimmer-overlay" />
                  <Camera className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Take Photo</span>
                </motion.button>
                <motion.button
                  onClick={handleMobileUpload}
                  className="upload-method-button mobile-upload flex flex-col items-center justify-center p-4 rounded-xl relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div className="shimmer-overlay" />
                  <Smartphone className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Mobile Upload</span>
                </motion.button>
              </div>

              {/* Drag & Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragOver 
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                    : 'border-[#2A2A33] bg-[#1A1A1A]'
                }`}
              >
                <Upload className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Drag & drop files here</h3>
                <p className="text-gray-400 mb-4">or browse to choose files</p>
                <p className="text-sm text-gray-500">Supports PDF, Word docs, images, and more</p>
              </div>

              {/* Autofill Suggestions Section */}
              <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#2A2A33]">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                  Autofill suggestions
                </h4>
                <p className="text-gray-400 text-sm mb-4">We'll detect file type, extract key details, and suggest a destination</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Encrypted at rest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    <span>Mobile capture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email to Inbox</span>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h5 className="text-white font-medium">Add your files to Inbox</h5>
                    <p className="text-gray-400 text-sm">Drag & drop, browse, or forward by email</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h5 className="text-white font-medium">We automatically find insights</h5>
                    <p className="text-gray-400 text-sm">Extract details, summarize, and categorize</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h5 className="text-white font-medium">Organize with one click</h5>
                    <p className="text-gray-400 text-sm">Accept suggestions to file docs in the right place</p>
                  </div>
                </div>
              </div>

              {/* Suggestions List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold">Suggestions</h4>
                  <button className="text-[#D4AF37] text-sm hover:underline">View all</button>
                </div>
                
                {/* Example suggestion */}
                <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#2A2A33] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2A2A33] rounded-lg flex items-center justify-center">
                      <Upload className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h5 className="text-white font-medium">scan-397.pdf</h5>
                      <p className="text-gray-400 text-sm">Suggested: Insurance → Life Policy</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8860B] transition-colors text-sm font-medium">
                    Open
                  </button>
                </div>
              </div>
            </div>

            {/* ICE Bar */}
            <div className="ice-bar relative p-4 border-t border-[#2A2A33] bg-[#0A0A0A]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-medium text-white">In Case of Emergency (ICE)</span>
                </div>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-[#D4AF37] text-black text-sm font-medium rounded-lg hover:bg-[#B8860B] transition-colors">
                  <Edit3 className="h-3 w-3" />
                  Edit
                </button>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
