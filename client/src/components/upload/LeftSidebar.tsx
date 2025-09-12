// LEFT Sidebar Component - Trustworthy Upload Strategy
// Slides in from left with document list and animations

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  X, 
  Search, 
  Filter,
  Upload,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { type TrustworthyDocument } from '@shared/schema';
import './TrustworthyStyles.css';

type DocumentStatus = 'uploaded' | 'analyzing' | 'analyzed' | 'error';

// Type guard for safe status handling
const isDocumentStatus = (status: string): status is DocumentStatus => {
  return ['uploaded', 'analyzing', 'analyzed', 'error'].includes(status);
};

// Safe status getter with fallback
const getSafeStatus = (status: string | undefined | null): DocumentStatus => {
  if (!status || !isDocumentStatus(status)) {
    return 'uploaded'; // Safe fallback
  }
  return status;
};

export interface LeftSidebarProps {
  isVisible: boolean;
  onClose: () => void;
  documents: TrustworthyDocument[];
  onDocumentSelect: (document: TrustworthyDocument) => void;
  onAnalyzeDocument: (documentId: string) => void;
  onShowDetails: (document: TrustworthyDocument) => void;
  selectedDocumentId?: string;
  isLoading?: boolean;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isVisible,
  onClose,
  documents,
  onDocumentSelect,
  onAnalyzeDocument,
  onShowDetails,
  selectedDocumentId,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DocumentStatus>('all');

  // Filter documents based on search and status
  const filteredDocuments = documents.filter(doc => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = doc.filename.toLowerCase().includes(q) ||
                         (doc.personIdentified ?? '').toLowerCase().includes(q) ||
                         (doc.documentType ?? '').toLowerCase().includes(q);
    
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status badge component
  const StatusBadge: React.FC<{ status: DocumentStatus }> = ({ status }) => {
    const statusConfig = {
      uploaded: { 
        icon: Upload, 
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        label: 'Uploaded' 
      },
      analyzing: { 
        icon: Clock, 
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        label: 'Analyzing...' 
      },
      analyzed: { 
        icon: CheckCircle, 
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        label: 'Complete' 
      },
      error: { 
        icon: AlertCircle, 
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        label: 'Error' 
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;

    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-medium ${config.color}`}>
        <IconComponent size={12} />
        {config.label}
      </div>
    );
  };

  // Document card component
  const DocumentCard: React.FC<{ document: TrustworthyDocument; index: number }> = ({ document, index }) => {
    const isSelected = document.id === selectedDocumentId;
    const canAnalyze = document.status === 'uploaded';
    const canShowDetails = document.status === 'analyzed';

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
        className={`
          trustworthy-document-card group cursor-pointer
          ${isSelected ? 'ring-2 ring-[#D4AF37]/50 bg-[#D4AF37]/5' : 'hover:bg-white/5'}
        `}
        onClick={() => onDocumentSelect(document)}
        data-testid={`document-card-${document.id}`}
      >
        {/* Thumbnail and file info */}
        <div className="flex items-start gap-3">
          {/* Document thumbnail */}
          <div className="flex-shrink-0 w-16 h-16 bg-[#1a1a1a] rounded-lg border border-[#333] flex items-center justify-center overflow-hidden">
            {document.thumbnailPath ? (
              <img 
                src={document.thumbnailPath} 
                alt={document.filename}
                className="w-full h-full object-cover"
                data-testid={`document-thumbnail-${document.id}`}
              />
            ) : (
              <FileText className="w-8 h-8 text-[#D4AF37]/60" />
            )}
          </div>

          {/* Document details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white truncate" data-testid={`document-filename-${document.id}`}>
                  {document.filename}
                </h3>
                <p className="text-xs text-gray-400 mt-1" data-testid={`document-type-${document.id}`}>
                  {document.documentType || 'Document'}
                </p>
              </div>
              <StatusBadge status={getSafeStatus(document.status)} />
            </div>

            {/* Person identified */}
            {document.personIdentified && (
              <div className="flex items-center gap-1.5 mt-2">
                <User size={12} className="text-[#D4AF37]" />
                <span className="text-xs text-[#D4AF37]" data-testid={`document-person-${document.id}`}>
                  {document.personIdentified}
                </span>
              </div>
            )}

            {/* Upload time and file size */}
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span data-testid={`document-upload-time-${document.id}`}>
                {document.uploadTime ? new Date(document.uploadTime).toLocaleDateString() : 'Unknown'}
              </span>
              <span data-testid={`document-file-size-${document.id}`}>
                {(document.fileSize / 1024).toFixed(1)} KB
              </span>
            </div>

            {/* AI Confidence */}
            {document.aiConfidence != null && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">AI Confidence</span>
                  <span className="text-[#D4AF37] font-medium">{document.aiConfidence}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-[#D4AF37] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${document.aiConfidence}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {canAnalyze && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onAnalyzeDocument(document.id);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg border border-[#D4AF37]/30 hover:bg-[#D4AF37]/30 transition-colors text-xs font-medium"
              data-testid={`analyze-button-${document.id}`}
            >
              <Zap size={12} />
              Analyze
            </motion.button>
          )}

          {canShowDetails && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onShowDetails(document);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg border border-[#D4AF37]/30 hover:bg-[#D4AF37]/30 transition-colors text-xs font-medium"
              data-testid={`details-button-${document.id}`}
            >
              <Zap size={12} />
              Details {document.extractedFields ? Object.keys(document.extractedFields).length : 0}
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
            data-testid="sidebar-backdrop"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -350, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -350, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="trustworthy-sidebar"
            data-testid="trustworthy-left-sidebar"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#333]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Trustworthy Documents
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="close-sidebar-button"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Search and filter */}
              <div className="mt-4 space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50"
                    data-testid="search-documents-input"
                  />
                </div>

                {/* Status filter */}
                <div className="relative">
                  <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | DocumentStatus)}
                    className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 appearance-none"
                    data-testid="filter-documents-select"
                  >
                    <option value="all">All Documents</option>
                    <option value="uploaded">Uploaded</option>
                    <option value="analyzing">Analyzing</option>
                    <option value="analyzed">Analyzed</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Document count */}
            <div className="px-6 py-3 border-b border-[#333]">
              <p className="text-sm text-gray-400" data-testid="document-count">
                {filteredDocuments.length} of {documents.length} documents
              </p>
            </div>

            {/* Document list */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <FileText size={32} className="mb-2" />
                  <p className="text-sm">No documents found</p>
                  {searchQuery && (
                    <p className="text-xs mt-1">Try adjusting your search</p>
                  )}
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {filteredDocuments.map((document, index) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LeftSidebar;