import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Upload, Search, Filter } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: number;
  status: 'pending' | 'processing' | 'complete' | 'error';
}

interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  documents?: Document[];
}

export default function LeftSidebar({ isOpen, onClose, documents = [] }: LeftSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            ref={sidebarRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-96 bg-[#0A0A0A] border-r border-[#2A2A33] z-[80] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#2A2A33]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10">
                  <FileText className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Document Inbox</h2>
                  <p className="text-sm text-gray-400">Recent uploads and analysis</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors text-gray-400 hover:text-white"
                data-testid="close-left-sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search and Filter */}
            <div className="p-4 border-b border-[#2A2A33]">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-sm text-gray-300 hover:bg-[#2A2A33] transition-colors">
                  <Filter className="h-4 w-4" />
                  All Types
                </button>
                <button className="px-3 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg text-sm text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors">
                  Recent
                </button>
              </div>
            </div>

            {/* Document List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 rounded-full bg-[#1A1A1A] w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No documents yet</h3>
                  <p className="text-gray-400 text-sm">
                    Upload documents to see them appear here with AI analysis
                  </p>
                </div>
              ) : (
                documents.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg hover:bg-[#2A2A33] transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white truncate flex-1 mr-2">{doc.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'complete' ? 'bg-green-500/10 text-green-400' :
                        doc.status === 'processing' ? 'bg-yellow-500/10 text-yellow-400' :
                        doc.status === 'error' ? 'bg-red-500/10 text-red-400' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{doc.type}</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#2A2A33]">
              <button className="w-full py-2 px-4 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#B8860B] transition-colors">
                Upload New Document
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
