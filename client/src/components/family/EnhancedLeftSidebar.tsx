import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Upload, Search, Filter, Brain, User, AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react';

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
  onDocumentAnalyze?: (document: Document, analysisResult: EnhancedAnalysisResult) => void;
  onDocumentRoute?: (document: Document, person: EnhancedAnalysisResult['identifiedPerson']) => void;
}

export default function EnhancedLeftSidebar({ 
  isOpen, 
  documents = [], 
  onClose, 
  onDocumentAnalyze,
  onDocumentRoute 
}: EnhancedLeftSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [analyzingDocs, setAnalyzingDocs] = useState<Set<string>>(new Set());
  const [analysisResults, setAnalysisResults] = useState<Map<string, EnhancedAnalysisResult>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'complete' | 'error'>('all');

  // Auto-analyze documents when sidebar opens
  useEffect(() => {
    if (isOpen && documents.length > 0) {
      const pendingDocs = documents.filter(doc => 
        doc.status === 'pending' && !analyzingDocs.has(doc.id) && !analysisResults.has(doc.id)
      );
      
      if (pendingDocs.length > 0) {
        startBatchAnalysis(pendingDocs);
      }
    }
  }, [isOpen, documents]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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

  const startBatchAnalysis = async (docs: Document[]) => {
    // Cancel any existing analysis
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    // Mark documents as analyzing
    setAnalyzingDocs(prev => {
      const newSet = new Set(prev);
      docs.forEach(doc => newSet.add(doc.id));
      return newSet;
    });

    try {
      for (const doc of docs) {
        if (abortControllerRef.current?.signal.aborted) break;
        
        await analyzeDocument(doc);
        
        // Small delay between analyses to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Batch analysis error:', error);
    }
  };

  const analyzeDocument = async (document: Document) => {
    try {
      // Simulate AI analysis (replace with actual API call)
      const mockAnalysis: EnhancedAnalysisResult = {
        documentType: detectDocumentType(document.name),
        confidence: 0.85 + Math.random() * 0.15,
        extractedData: {
          title: document.name,
          dateProcessed: new Date().toISOString(),
          fileSize: document.size,
        },
        identifiedPerson: {
          name: 'Family Member',
          relationship: 'parent'
        },
        suggestedActions: [
          'Review extracted information',
          'Assign to family member',
          'Add to relevant category'
        ],
        routing: {
          category: 'documents',
          subcategory: 'general',
          priority: 'medium'
        }
      };

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      if (!abortControllerRef.current?.signal.aborted) {
        setAnalysisResults(prev => new Map(prev).set(document.id, mockAnalysis));
        setAnalyzingDocs(prev => {
          const newSet = new Set(prev);
          newSet.delete(document.id);
          return newSet;
        });

        // Notify parent component
        if (onDocumentAnalyze) {
          onDocumentAnalyze(document, mockAnalysis);
        }
      }
    } catch (error) {
      console.error('Document analysis error:', error);
      setAnalyzingDocs(prev => {
        const newSet = new Set(prev);
        newSet.delete(document.id);
        return newSet;
      });
    }
  };

  const detectDocumentType = (filename: string): string => {
    const ext = filename.toLowerCase().split('.').pop();
    const name = filename.toLowerCase();
    
    if (name.includes('medical') || name.includes('health')) return 'Medical Record';
    if (name.includes('insurance')) return 'Insurance Document';
    if (name.includes('tax') || name.includes('1040')) return 'Tax Document';
    if (name.includes('legal') || name.includes('contract')) return 'Legal Document';
    if (ext === 'pdf') return 'PDF Document';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return 'Image';
    return 'General Document';
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleRouteDocument = (document: Document) => {
    const analysis = analysisResults.get(document.id);
    if (analysis && onDocumentRoute) {
      onDocumentRoute(document, analysis.identifiedPerson);
    }
  };

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
                  <Brain className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">AI Document Inbox</h2>
                  <p className="text-sm text-gray-400">Smart analysis & routing</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors text-gray-400 hover:text-white"
                data-testid="close-enhanced-left-sidebar"
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {(['all', 'pending', 'complete', 'error'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterType(filter)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filterType === filter
                        ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]'
                        : 'bg-[#1A1A1A] border border-[#2A2A33] text-gray-300 hover:bg-[#2A2A33]'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Document List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 rounded-full bg-[#1A1A1A] w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No documents found</h3>
                  <p className="text-gray-400 text-sm">
                    {searchQuery ? 'Try adjusting your search or filter' : 'Upload documents to see AI analysis'}
                  </p>
                </div>
              ) : (
                filteredDocuments.map((doc) => {
                  const isAnalyzing = analyzingDocs.has(doc.id);
                  const analysis = analysisResults.get(doc.id);
                  
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-[#1A1A1A] border border-[#2A2A33] rounded-lg hover:bg-[#2A2A33] transition-colors cursor-pointer"
                      onClick={() => handleRouteDocument(doc)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white truncate flex-1 mr-2">{doc.name}</h4>
                        <div className="flex items-center gap-2">
                          {isAnalyzing && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-yellow-400 animate-spin" />
                              <span className="text-xs text-yellow-400">Analyzing</span>
                            </div>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            doc.status === 'complete' ? 'bg-green-500/10 text-green-400' :
                            doc.status === 'processing' ? 'bg-yellow-500/10 text-yellow-400' :
                            doc.status === 'error' ? 'bg-red-500/10 text-red-400' :
                            'bg-gray-500/10 text-gray-400'
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                      </div>
                      
                      {analysis && (
                        <div className="mb-3 p-3 bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-4 w-4 text-[#D4AF37]" />
                            <span className="text-sm font-medium text-[#D4AF37]">AI Analysis</span>
                            <span className="text-xs text-gray-400">
                              {Math.round(analysis.confidence * 100)}% confidence
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">
                            Type: <span className="text-white">{analysis.documentType}</span>
                          </p>
                          {analysis.identifiedPerson && (
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <User className="h-3 w-3" />
                              <span>{analysis.identifiedPerson.name} ({analysis.identifiedPerson.relationship})</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>{detectDocumentType(doc.name)}</span>
                        <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#2A2A33]">
              <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                <Brain className="h-4 w-4 text-[#D4AF37]" />
                <span>AI-powered document analysis</span>
              </div>
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
