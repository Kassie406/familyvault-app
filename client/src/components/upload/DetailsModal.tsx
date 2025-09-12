import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Edit3, 
  Check, 
  FileText, 
  Zap,
  UserCheck,
  Save,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { TrustworthyDocument, FamilyMember } from '@shared/schema';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import './TrustworthyStyles.css';

interface DetailsModalProps {
  document: TrustworthyDocument;
  isVisible: boolean;
  onClose: () => void;
  onRouteToProfile?: (memberId: string) => void;
  onUpdateDocument?: (updates: Partial<TrustworthyDocument>) => void;
}

interface ExtractedField {
  key: string;
  value: string;
  confidence: number;
  fieldType: 'text' | 'date' | 'number' | 'email' | 'phone' | 'address';
  label: string;
  isEditing: boolean;
  editValue: string;
}

// Safe status getter with fallback
const getSafeStatus = (status: string | undefined | null): string => {
  if (!status) return 'uploaded';
  return status;
};

// Format confidence as percentage
const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence)}%`;
};

// Get confidence color based on value
const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 80) return 'var(--trustworthy-success)';
  if (confidence >= 60) return 'var(--trustworthy-warning)';
  return 'var(--trustworthy-error)';
};

const DetailsModal: React.FC<DetailsModalProps> = ({
  document,
  isVisible,
  onClose,
  onRouteToProfile,
  onUpdateDocument
}) => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const modalRef = useRef<HTMLDivElement>(null);
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [isRouting, setIsRouting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Query for family members
  const { data: familyMembers = [], isLoading: loadingMembers } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family/members'],
    enabled: isVisible
  });

  // Parse extracted fields from document (AWS Lambda + OpenAI format)
  useEffect(() => {
    if (document.extractedFields) {
      try {
        const fields = typeof document.extractedFields === 'string' 
          ? JSON.parse(document.extractedFields)
          : document.extractedFields;
        
        let parsedFields: ExtractedField[] = [];
        
        // Handle AWS Lambda + OpenAI format
        if (fields?.keyValuePairs && Array.isArray(fields.keyValuePairs)) {
          parsedFields = fields.keyValuePairs.map((pair: any) => ({
            key: pair.key || 'Unknown',
            value: String(pair.value || ''),
            confidence: Number(pair.confidence || 0),
            fieldType: 'text',
            label: (pair.key || 'Unknown').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            isEditing: false,
            editValue: String(pair.value || '')
          }));
        } else if (fields && typeof fields === 'object') {
          // Fallback to legacy format
          parsedFields = Object.entries(fields || {}).map(([key, value]: [string, any]) => ({
            key,
            value: String(value?.value || value || ''),
            confidence: Number(value?.confidence || document.aiConfidence || 0),
            fieldType: value?.fieldType || 'text',
            label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            isEditing: false,
            editValue: String(value?.value || value || '')
          }));
        }
        
        setExtractedFields(parsedFields);
      } catch (error) {
        console.error('Error parsing extracted fields:', error);
        setExtractedFields([]);
      }
    }
  }, [document]);

  // Handle escape key and focus management
  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Focus the modal when it opens
    if (modalRef.current) {
      modalRef.current.focus();
    }

    window.document.addEventListener('keydown', handleEscape);
    return () => {
      window.document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  // Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: async (updates: Partial<TrustworthyDocument>) => {
      return apiRequest('PATCH', `/api/trustworthy/documents/${document.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trustworthy/documents'] });
      toast({
        title: 'Document Updated',
        description: 'Document details have been saved successfully.'
      });
    },
    onError: (error) => {
      console.error('Error updating document:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update document. Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Route to profile mutation
  const routeToProfileMutation = useMutation({
    mutationFn: async (memberId: string) => {
      return apiRequest('POST', `/api/trustworthy/documents/${document.id}/route`, { memberId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trustworthy/documents'] });
      toast({
        title: 'Document Routed',
        description: 'Document has been successfully assigned to family member.'
      });
      onRouteToProfile?.(selectedMemberId);
    },
    onError: (error) => {
      console.error('Error routing document:', error);
      toast({
        title: 'Routing Failed',
        description: 'Failed to route document. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleEditField = (index: number) => {
    setExtractedFields(prev => prev.map((field, i) => 
      i === index 
        ? { ...field, isEditing: true, editValue: field.value }
        : field
    ));
  };

  const handleSaveField = (index: number) => {
    setExtractedFields(prev => prev.map((field, i) => 
      i === index 
        ? { ...field, isEditing: false, value: field.editValue }
        : field
    ));
    setHasUnsavedChanges(true);
  };

  const handleCancelEdit = (index: number) => {
    setExtractedFields(prev => prev.map((field, i) => 
      i === index 
        ? { ...field, isEditing: false, editValue: field.value }
        : field
    ));
  };

  const handleSaveAllChanges = async () => {
    setIsSaving(true);
    try {
      // First, commit any in-progress edits
      const finalFields = extractedFields.map(field => ({
        ...field,
        value: field.isEditing ? field.editValue : field.value,
        isEditing: false
      }));
      
      setExtractedFields(finalFields);
      
      const updatedFields = finalFields.reduce((acc, field) => {
        acc[field.key] = {
          value: field.value,
          confidence: field.confidence,
          fieldType: field.fieldType
        };
        return acc;
      }, {} as Record<string, any>);

      await updateDocumentMutation.mutateAsync({
        extractedFields: updatedFields
      });
      
      onUpdateDocument?.({
        ...document,
        extractedFields: updatedFields
      });
      
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRouteToProfile = async () => {
    if (!selectedMemberId) {
      toast({
        title: 'No Member Selected',
        description: 'Please select a family member to route this document to.',
        variant: 'destructive'
      });
      return;
    }

    setIsRouting(true);
    try {
      await routeToProfileMutation.mutateAsync(selectedMemberId);
    } finally {
      setIsRouting(false);
    }
  };

  const handleCopyField = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: 'Copied',
      description: 'Field value copied to clipboard.'
    });
  };

  const selectedMember = familyMembers.find((member) => member.id === selectedMemberId);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
            data-testid="details-modal-backdrop"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 rounded-2xl flex flex-col z-50 max-w-4xl mx-auto"
            style={{
              backgroundColor: 'var(--trustworthy-dark-bg)',
              border: '1px solid var(--trustworthy-border)'
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="details-modal-title"
            tabIndex={-1}
            data-testid="details-modal"
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: 'var(--trustworthy-border)' }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="p-3 rounded-xl"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--trustworthy-primary-gold) 20%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--trustworthy-primary-gold) 30%, transparent)'
                  }}
                >
                  <FileText size={24} style={{ color: 'var(--trustworthy-primary-gold)' }} />
                </div>
                <div>
                  <h2 
                    id="details-modal-title"
                    className="text-xl font-semibold"
                    style={{ color: 'var(--trustworthy-text-primary)' }}
                    data-testid="document-details-title"
                  >
                    Document Details
                  </h2>
                  <p 
                    className="text-sm mt-1"
                    style={{ color: 'var(--trustworthy-text-secondary)' }}
                    data-testid="document-filename"
                  >
                    {document.filename}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Lightning Bolt Indicator */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ color: 'var(--trustworthy-primary-gold)' }}
                  data-testid="lightning-indicator"
                >
                  <Zap size={20} />
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="close-details-modal"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
              {/* Left: AI Analysis Results */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* AWS Lambda + OpenAI Summary */}
                {document.extractedFields && (() => {
                  try {
                    const fields = typeof document.extractedFields === 'string' 
                      ? JSON.parse(document.extractedFields)
                      : document.extractedFields;
                    return fields?.summary ? (
                      <div className="mb-6">
                        <h3 
                          className="text-lg font-semibold mb-3"
                          style={{ color: 'var(--trustworthy-text-primary)' }}
                        >
                          🤖 AI Analysis Summary
                        </h3>
                        <div 
                          className="p-4 rounded-xl border"
                          style={{
                            backgroundColor: 'color-mix(in srgb, var(--trustworthy-primary-gold) 10%, transparent)',
                            borderColor: 'color-mix(in srgb, var(--trustworthy-primary-gold) 30%, transparent)'
                          }}
                        >
                          <p 
                            className="text-sm leading-relaxed"
                            style={{ color: 'var(--trustworthy-text-secondary)' }}
                            data-testid="ai-summary"
                          >
                            {fields.summary}
                          </p>
                        </div>
                      </div>
                    ) : null;
                  } catch {
                    return null;
                  }
                })()}

                {/* Extracted Key-Value Pairs */}
                <div className="mb-6">
                  <h3 
                    className="text-lg font-semibold mb-4"
                    style={{ color: 'var(--trustworthy-text-primary)' }}
                  >
                    ⚡ Extracted Information
                  </h3>

                {extractedFields.length === 0 ? (
                  <div 
                    className="text-center py-12"
                    style={{ color: 'var(--trustworthy-text-muted)' }}
                  >
                    <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No extracted fields available</p>
                    <p className="text-sm mt-2">Try analyzing the document first</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {extractedFields.map((field, index) => (
                      <motion.div
                        key={field.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl border"
                        style={{
                          backgroundColor: 'var(--trustworthy-card-bg)',
                          borderColor: 'var(--trustworthy-border)'
                        }}
                        data-testid={`extracted-field-${field.key}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span 
                                className="text-sm font-medium"
                                style={{ color: 'var(--trustworthy-text-primary)' }}
                              >
                                {field.label}
                              </span>
                              <div 
                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: 'color-mix(in srgb, ' + getConfidenceColor(field.confidence) + ' 20%, transparent)',
                                  color: getConfidenceColor(field.confidence)
                                }}
                              >
                                {formatConfidence(field.confidence)}
                              </div>
                            </div>

                            {field.isEditing ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={field.editValue}
                                  onChange={(e) => setExtractedFields(prev => 
                                    prev.map((f, i) => 
                                      i === index ? { ...f, editValue: e.target.value } : f
                                    )
                                  )}
                                  className="flex-1 bg-transparent border-gray-600 text-white"
                                  data-testid={`edit-field-${field.key}`}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveField(index)}
                                  className="p-2"
                                  data-testid={`save-field-${field.key}`}
                                >
                                  <Check size={14} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCancelEdit(index)}
                                  className="p-2"
                                  data-testid={`cancel-field-${field.key}`}
                                >
                                  <X size={14} />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span 
                                  className="flex-1 text-sm"
                                  style={{ color: 'var(--trustworthy-text-secondary)' }}
                                  data-testid={`field-value-${field.key}`}
                                >
                                  {field.value || 'No value'}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleCopyField(field.value)}
                                  className="p-1 text-gray-400 hover:text-white"
                                  data-testid={`copy-field-${field.key}`}
                                >
                                  <Copy size={14} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditField(index)}
                                  className="p-1 text-gray-400 hover:text-white"
                                  data-testid={`edit-field-${field.key}`}
                                >
                                  <Edit3 size={14} />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                </div>

                {/* Extracted Text Preview */}
                {document.extractedFields && (() => {
                  try {
                    const fields = typeof document.extractedFields === 'string' 
                      ? JSON.parse(document.extractedFields)
                      : document.extractedFields;
                    return fields?.extractedText ? (
                      <div className="mb-6">
                        <h3 
                          className="text-lg font-semibold mb-3"
                          style={{ color: 'var(--trustworthy-text-primary)' }}
                        >
                          📄 Extracted Text Preview
                        </h3>
                        <div 
                          className="p-4 rounded-xl border max-h-48 overflow-y-auto"
                          style={{
                            backgroundColor: 'var(--trustworthy-card-bg)',
                            borderColor: 'var(--trustworthy-border)'
                          }}
                        >
                          <pre 
                            className="text-xs font-mono whitespace-pre-wrap leading-relaxed"
                            style={{ color: 'var(--trustworthy-text-secondary)' }}
                            data-testid="extracted-text-preview"
                          >
                            {fields.extractedText.length > 500 
                              ? `${fields.extractedText.substring(0, 500)}...` 
                              : fields.extractedText}
                          </pre>
                          {fields.extractedText.length > 500 && (
                            <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--trustworthy-border)' }}>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCopyField(fields.extractedText)}
                                className="text-xs"
                                data-testid="copy-full-text"
                              >
                                <Copy size={12} className="mr-1" />
                                Copy Full Text
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null;
                  } catch {
                    return null;
                  }
                })()}

              </div>

              {/* Right: Profile Routing */}
              <div 
                className="w-full lg:w-80 p-6 border-t lg:border-t-0 lg:border-l"
                style={{ borderColor: 'var(--trustworthy-border)' }}
              >
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{ color: 'var(--trustworthy-text-primary)' }}
                >
                  Route to Profile
                </h3>

                <div className="space-y-4">
                  {/* Document Info */}
                  <div 
                    className="p-4 rounded-xl"
                    style={{
                      backgroundColor: 'var(--trustworthy-card-bg)',
                      border: '1px solid var(--trustworthy-border)'
                    }}
                  >
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--trustworthy-text-muted)' }}>Type:</span>
                        <span style={{ color: 'var(--trustworthy-text-secondary)' }}>
                          {document.documentType || 'Document'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--trustworthy-text-muted)' }}>Status:</span>
                        <span style={{ color: 'var(--trustworthy-text-secondary)' }}>
                          {getSafeStatus(document.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--trustworthy-text-muted)' }}>AI Confidence:</span>
                        <span style={{ color: 'var(--trustworthy-primary-gold)' }}>
                          {document.aiConfidence || 0}%
                        </span>
                      </div>
                      {document.personIdentified && (
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--trustworthy-text-muted)' }}>Identified:</span>
                          <span style={{ color: 'var(--trustworthy-primary-gold)' }}>
                            {document.personIdentified}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Family Member Selection */}
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--trustworthy-text-primary)' }}
                    >
                      Assign to Family Member
                    </label>
                    <Select 
                      value={selectedMemberId} 
                      onValueChange={setSelectedMemberId}
                      disabled={loadingMembers}
                    >
                      <SelectTrigger 
                        className="w-full"
                        data-testid="select-family-member"
                      >
                        <SelectValue placeholder="Select family member..." />
                      </SelectTrigger>
                      <SelectContent>
                        {familyMembers.map((member) => (
                          <SelectItem 
                            key={member.id} 
                            value={member.id}
                            data-testid={`member-option-${member.id}`}
                          >
                            <div className="flex items-center gap-2">
                              <User size={16} />
                              <span>{member.name}</span>
                              {member.relationshipToFamily && (
                                <span className="text-xs text-gray-400">
                                  ({member.relationshipToFamily})
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Member Preview */}
                  {selectedMember && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 rounded-xl"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--trustworthy-primary-gold) 10%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--trustworthy-primary-gold) 30%, transparent)'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor: 'var(--trustworthy-primary-gold)',
                            color: 'var(--trustworthy-dark-bg)'
                          }}
                        >
                          <User size={16} />
                        </div>
                        <div>
                          <p 
                            className="font-medium"
                            style={{ color: 'var(--trustworthy-text-primary)' }}
                          >
                            {selectedMember.name}
                          </p>
                          {selectedMember.relationshipToFamily && (
                            <p 
                              className="text-sm"
                              style={{ color: 'var(--trustworthy-text-secondary)' }}
                            >
                              {selectedMember.relationshipToFamily}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                </div>
              </div>
            </div>

            {/* Footer: Accept/Dismiss Actions (PDF Specification) */}
            <div 
              className="p-6 border-t"
              style={{ borderColor: 'var(--trustworthy-border)' }}
            >
              <div className="flex items-center justify-end gap-4">
                {/* Dismiss Button */}
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  data-testid="dismiss-document-button"
                >
                  Dismiss
                </Button>

                {/* Accept Button */}
                <Button
                  onClick={async () => {
                    try {
                      // First save any field edits
                      if (hasUnsavedChanges || extractedFields.some(field => field.isEditing)) {
                        await handleSaveAllChanges();
                      }
                      
                      // Then route to profile if member is selected
                      if (selectedMemberId) {
                        await handleRouteToProfile();
                        
                        // Navigate to profile after successful routing
                        setLocation(`/family/members/${selectedMemberId}`);
                      }
                      
                      // Close the modal
                      onClose();
                    } catch (error) {
                      console.error('Accept action failed:', error);
                      toast({
                        title: 'Action Failed',
                        description: 'Failed to accept document. Please try again.',
                        variant: 'destructive'
                      });
                    }
                  }}
                  disabled={!selectedMemberId || isRouting || isSaving}
                  className="px-6 py-2"
                  style={{
                    backgroundColor: selectedMemberId 
                      ? 'var(--trustworthy-primary-gold)' 
                      : 'var(--trustworthy-border)',
                    color: selectedMemberId 
                      ? 'var(--trustworthy-dark-bg)' 
                      : 'var(--trustworthy-text-muted)',
                    borderColor: selectedMemberId 
                      ? 'var(--trustworthy-primary-gold)' 
                      : 'var(--trustworthy-border)'
                  }}
                  data-testid="accept-document-button"
                >
                  {(isRouting || isSaving) ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <UserCheck size={16} className="mr-2" />
                  )}
                  Accept & Route
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DetailsModal;