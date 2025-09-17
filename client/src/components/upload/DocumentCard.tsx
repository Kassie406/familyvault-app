import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Zap,
  Eye,
  Sparkles
} from 'lucide-react';
import { TrustworthyDocument } from '@shared/schema';
import './TrustworthyStyles.css';

type DocumentStatus = 'uploaded' | 'analyzing' | 'analyzed' | 'error';

interface DocumentCardProps {
  document: TrustworthyDocument;
  onClick?: () => void;
  onAnalyze?: (documentId: string) => void;
  onViewDetails?: (document: TrustworthyDocument) => void;
  isSelected?: boolean;
  index?: number;
  showActions?: boolean;
  compact?: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onClick,
  onAnalyze,
  onViewDetails,
  isSelected = false,
  index = 0,
  showActions = true,
  compact = false
}) => {
  // Safe status getter
  const getSafeStatus = (status: string | null | undefined): DocumentStatus => {
    if (!status) return 'uploaded';
    const validStatuses: DocumentStatus[] = ['uploaded', 'analyzing', 'analyzed', 'error'];
    return validStatuses.includes(status as DocumentStatus) ? status as DocumentStatus : 'uploaded';
  };

  const safeStatus = getSafeStatus(document.status);
  const canAnalyze = safeStatus === 'uploaded';
  const canShowDetails = safeStatus === 'analyzed' && document.extractedFields;
  const extractedFieldsCount = document.extractedFields ? 
    (typeof document.extractedFields === 'string' ? 
      (() => {
        try {
          return Object.keys(JSON.parse(document.extractedFields as string || '{}')).length;
        } catch {
          console.warn('Failed to parse extractedFields JSON:', document.extractedFields);
          return 0;
        }
      })() : 
      Object.keys(document.extractedFields).length) : 0;

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
        label: 'Analyzing' 
      },
      analyzed: { 
        icon: CheckCircle, 
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        label: 'Analyzed' 
      },
      error: { 
        icon: AlertCircle, 
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        label: 'Error' 
      }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-medium ${config.color}`}>
        <IconComponent size={12} />
        {config.label}
      </div>
    );
  };

  // Lightning bolt animation for analyzing status
  const LightningAnimation: React.FC = () => (
    <motion.div
      className="absolute -top-1 -right-1 w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Zap size={12} className="text-black" />
      <motion.div
        className="absolute inset-0 bg-[#D4AF37] rounded-full"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 0, 0.4],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3
        }}
      />
    </motion.div>
  );

  // Sparkles animation for analyzed status
  const SparklesAnimation: React.FC = () => (
    <motion.div
      className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center"
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <Sparkles size={12} className="text-black" />
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`
        relative group cursor-pointer rounded-xl p-4 border transition-all duration-200
        ${compact ? 'p-3' : 'p-4'}
        ${isSelected 
          ? 'ring-2 ring-[#D4AF37]/50 bg-[#D4AF37]/5 border-[#D4AF37]/30' 
          : 'border-gray-700 hover:border-[#D4AF37]/40 hover:bg-white/5'
        }
      `}
      style={{
        backgroundColor: isSelected ? 'var(--trustworthy-dark-bg)' : 'var(--trustworthy-card-bg)',
        borderColor: isSelected ? 'var(--trustworthy-primary-gold)' : 'var(--trustworthy-border)'
      } as React.CSSProperties}
      onClick={onClick}
      data-testid={`document-card-${document.id}`}
    >
      {/* Analysis status animations */}
      {safeStatus === 'analyzing' && <LightningAnimation />}
      {safeStatus === 'analyzed' && <SparklesAnimation />}

      {/* Main content */}
      <div className="flex items-start gap-3">
        {/* Document thumbnail */}
        <div className={`flex-shrink-0 bg-[#1a1a1a] rounded-lg border border-[#333] flex items-center justify-center overflow-hidden ${compact ? 'w-12 h-12' : 'w-16 h-16'}`}>
          {document.thumbnailPath ? (
            <img 
              src={document.thumbnailPath} 
              alt={document.filename}
              className="w-full h-full object-cover"
              data-testid={`document-thumbnail-${document.id}`}
            />
          ) : (
            <FileText className={`text-[#D4AF37]/60 ${compact ? 'w-6 h-6' : 'w-8 h-8'}`} />
          )}
        </div>

        {/* Document details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 
                className={`font-medium text-white truncate ${compact ? 'text-sm' : 'text-sm'}`}
                style={{ color: 'var(--trustworthy-text-primary)' }}
                data-testid={`document-filename-${document.id}`}
              >
                {document.filename}
              </h3>
              <p 
                className={`text-gray-400 mt-1 ${compact ? 'text-xs' : 'text-xs'}`}
                data-testid={`document-type-${document.id}`}
              >
                {document.documentType || 'Document'}
              </p>
            </div>
            <StatusBadge status={safeStatus} />
          </div>

          {/* Person identified */}
          {document.personIdentified && (
            <div className="flex items-center gap-1.5 mt-2">
              <User size={12} style={{ color: 'var(--trustworthy-primary-gold)' }} />
              <span 
                className="text-xs"
                style={{ color: 'var(--trustworthy-primary-gold)' }}
                data-testid={`document-person-${document.id}`}
              >
                {document.personIdentified}
              </span>
            </div>
          )}

          {/* Upload time and file size */}
          {!compact && (
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span data-testid={`document-upload-time-${document.id}`}>
                {document.uploadTime ? new Date(document.uploadTime).toLocaleDateString() : 'Unknown'}
              </span>
              <span data-testid={`document-file-size-${document.id}`}>
                {(document.fileSize / 1024).toFixed(1)} KB
              </span>
            </div>
          )}

          {/* AI Confidence */}
          {document.aiConfidence != null && !compact && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">AI Confidence</span>
                <span 
                  className="font-medium"
                  style={{ color: 'var(--trustworthy-primary-gold)' }}
                >
                  {document.aiConfidence}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                <div 
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: 'var(--trustworthy-primary-gold)',
                    width: `${document.aiConfidence}%` 
                  }}
                />
              </div>
            </div>
          )}

          {/* Extracted fields count for analyzed documents */}
          {safeStatus === 'analyzed' && extractedFieldsCount > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <CheckCircle size={12} style={{ color: 'var(--trustworthy-primary-gold)' }} />
              <span 
                className="text-xs font-medium"
                style={{ color: 'var(--trustworthy-primary-gold)' }}
                data-testid={`document-extracted-fields-${document.id}`}
              >
                {extractedFieldsCount} fields extracted
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {showActions && (
        <div className="flex items-center gap-2 mt-3 transition-opacity duration-200">
          {canAnalyze && onAnalyze ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onAnalyze?.(document.id);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors"
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                color: 'var(--trustworthy-primary-gold)',
                borderColor: 'rgba(212, 175, 55, 0.3)'
              } as React.CSSProperties}
              data-testid={`analyze-button-${document.id}`}
            >
              <Zap size={12} />
              Analyze
            </motion.button>
          ) : null}

          {canShowDetails && onViewDetails ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails?.(document);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors"
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                color: 'var(--trustworthy-primary-gold)',
                borderColor: 'rgba(212, 175, 55, 0.3)'
              } as React.CSSProperties}
              data-testid={`details-button-${document.id}`}
            >
              <Eye size={12} />
              Details ({extractedFieldsCount})
            </motion.button>
          ) : null}
        </div>
      )}
    </motion.div>
  );
};

export default DocumentCard;