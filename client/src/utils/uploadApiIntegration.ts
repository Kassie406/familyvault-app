// API Integration for Enhanced Upload Center
// Enhanced by Manus (Design & UX Lead) via MCP Server

// Types
type ProgressCallback = (progress: number) => void;
type StateChangeCallback = (state: 'uploading' | 'processing' | 'complete' | 'error') => void;

// API Response Types
interface APIAnalysisResponse {
  extractedFields?: ExtractedField[];
  fields?: ExtractedField[];
  [key: string]: any;
}

export interface ExtractedField {
  key?: string;
  label?: string;
  value: string;
  confidence?: number;
}

export interface AnalysisResult {
  extractedFields: ExtractedField[];
  documentType: string;
  confidence: number;
  suggestions: {
    category: string;
    familyMembers: Array<{
      name: string;
      confidence: number;
      suggestedRole: string;
      source: string;
    }>;
    tags: string[];
  };
  metadata: {
    fileName: string;
    fileSize: number;
    fileType: string;
    analysisDate: string;
  };
}

export interface UploadResult {
  fileId: string;
  success: boolean;
}

export interface WorkflowResult {
  upload: UploadResult;
  analysis: AnalysisResult;
  success: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const UPLOAD_ENDPOINT = `${API_BASE_URL}/upload`;
const ANALYZE_ENDPOINT = `${API_BASE_URL}/ai-inbox/analyze`;

/**
 * Upload file with progress tracking
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise} Upload response
 */
export const uploadFileWithProgress = (file: File, onProgress: ProgressCallback): Promise<any> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    
    // Add file to form data
    formData.append('file', file);
    formData.append('timestamp', Date.now().toString());
    formData.append('source', 'enhanced-upload-center');
    
    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });
    
    // Handle successful upload
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new Error('Invalid response format'));
        }
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });
    
    // Handle upload errors
    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });
    
    // Handle upload timeout
    xhr.addEventListener('timeout', () => {
      reject(new Error('Upload timeout'));
    });
    
    // Configure and send request
    xhr.timeout = 60000; // 60 second timeout
    xhr.open('POST', UPLOAD_ENDPOINT);
    xhr.send(formData);
  });
};

/**
 * Analyze document using existing AWS Textract integration
 * @param {string} fileId - The uploaded file ID
 * @param {File} file - Original file object for metadata
 * @returns {Promise} Analysis results
 */
export const analyzeDocumentWithAI = async (fileId: string, file: File): Promise<AnalysisResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(ANALYZE_ENDPOINT, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Analysis failed with status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Transform result to UI format
    return transformAnalysisResult(result, file);
    
  } catch (error) {
    console.error('Document analysis failed:', error);
    throw error;
  }
};

/**
 * Transform analysis result to UI-friendly format
 * @param {Object} result - Analysis result
 * @param {File} file - Original file object
 * @returns {Object} Transformed result for UI
 */
const transformAnalysisResult = (result: APIAnalysisResponse, file: File): AnalysisResult => {
  // Handle both new and existing result formats
  const extractedFields = result.extractedFields || result.fields || [];
  
  return {
    extractedFields: extractedFields.slice(0, 10), // Limit to top 10 fields
    documentType: detectDocumentType(extractedFields, file.name),
    confidence: calculateOverallConfidence(extractedFields),
    suggestions: {
      category: suggestCategory(extractedFields, file.name),
      familyMembers: suggestFamilyMembers(extractedFields),
      tags: suggestTags(extractedFields, file.name)
    },
    metadata: {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      analysisDate: new Date().toISOString()
    }
  };
};

/**
 * Detect document type based on extracted fields and filename
 */
const detectDocumentType = (fields: ExtractedField[], fileName: string): string => {
  const fieldTexts = fields.map((f: ExtractedField) => `${f.key || f.label || ''} ${f.value || ''}`).join(' ').toLowerCase();
  const fileNameLower = fileName.toLowerCase();
  
  if (fieldTexts.includes('driver') || fieldTexts.includes('license') || fileNameLower.includes('license')) {
    return 'Driver License';
  }
  
  if (fieldTexts.includes('social security') || fieldTexts.includes('ssa')) {
    return 'Social Security Document';
  }
  
  if (fieldTexts.includes('birth certificate') || fieldTexts.includes('born')) {
    return 'Birth Certificate';
  }
  
  if (fieldTexts.includes('passport')) {
    return 'Passport';
  }
  
  if (fieldTexts.includes('insurance') || fieldTexts.includes('policy')) {
    return 'Insurance Document';
  }
  
  if (fieldTexts.includes('medical') || fieldTexts.includes('health')) {
    return 'Medical Record';
  }
  
  return 'Identity Document';
};

/**
 * Calculate overall confidence score
 */
const calculateOverallConfidence = (fields: ExtractedField[]): number => {
  if (fields.length === 0) return 0;
  
  const totalConfidence = fields.reduce((sum: number, field: ExtractedField) => sum + (field.confidence || 85), 0);
  return Math.round(totalConfidence / fields.length);
};

/**
 * Suggest document category
 */
const suggestCategory = (fields: ExtractedField[], fileName: string): string => {
  const fieldTexts = fields.map((f: ExtractedField) => `${f.key || f.label || ''} ${f.value || ''}`).join(' ').toLowerCase();
  
  if (fieldTexts.includes('license') || fieldTexts.includes('certificate') || fieldTexts.includes('passport')) {
    return 'Legal';
  }
  
  if (fieldTexts.includes('insurance') || fieldTexts.includes('financial') || fieldTexts.includes('bank')) {
    return 'Financial';
  }
  
  if (fieldTexts.includes('medical') || fieldTexts.includes('health')) {
    return 'Medical';
  }
  
  return 'Personal';
};

/**
 * Suggest family members based on extracted names
 */
const suggestFamilyMembers = (fields: ExtractedField[]): Array<{name: string; confidence: number; suggestedRole: string; source: string}> => {
  const nameFields = fields.filter((field: ExtractedField) => {
    const key = (field.key || field.label || '').toLowerCase();
    const value = field.value || '';
    return key.includes('name') && value.length > 2 && !value.toLowerCase().includes('organization');
  });
  
  return nameFields.map((field: ExtractedField) => ({
    name: field.value,
    confidence: field.confidence || 85,
    suggestedRole: 'Family Member',
    source: field.key || field.label || 'unknown'
  }));
};

/**
 * Suggest tags based on content
 */
const suggestTags = (fields: ExtractedField[], fileName: string): string[] => {
  const tags = new Set<string>();
  
  // Add document type tags
  fields.forEach((field: ExtractedField) => {
    const key = (field.key || field.label || '').toLowerCase();
    const value = (field.value || '').toLowerCase();
    
    if (key.includes('license') || value.includes('license')) {
      tags.add('License');
    }
    if (key.includes('medical') || value.includes('medical')) {
      tags.add('Medical');
    }
    if (key.includes('insurance') || value.includes('insurance')) {
      tags.add('Insurance');
    }
  });
  
  // Add year tags
  const yearMatch = fileName.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    tags.add(yearMatch[0]);
  }
  
  return Array.from(tags);
};

/**
 * Enhanced upload workflow combining upload and analysis
 * @param {File} file - File to upload and analyze
 * @param {Function} onProgress - Progress callback
 * @param {Function} onStateChange - State change callback
 * @returns {Promise} Complete workflow result
 */
export const enhancedUploadWorkflow = async (file: File, onProgress: ProgressCallback, onStateChange: StateChangeCallback): Promise<WorkflowResult> => {
  try {
    // Phase 1: Upload file (simulated for now)
    onStateChange('uploading');
    await simulateUploadProgress(onProgress);
    
    // Phase 2: Start AI analysis
    onStateChange('processing');
    const analysisResult = await analyzeDocumentWithAI('temp-id', file);
    
    // Phase 3: Complete
    onStateChange('complete');
    
    return {
      upload: { fileId: 'temp-id', success: true },
      analysis: analysisResult,
      success: true
    };
    
  } catch (error) {
    onStateChange('error');
    throw error;
  }
};

/**
 * Simulate upload progress for demo
 */
const simulateUploadProgress = (onProgress: ProgressCallback): Promise<void> => {
  return new Promise<void>((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        onProgress(100);
        setTimeout(resolve, 200);
      } else {
        onProgress(Math.min(progress, 95));
      }
    }, 200);
  });
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export const validateFile = (file: File | null): ValidationResult => {
  const maxSize = 25 * 1024 * 1024; // 25MB (matching existing system)
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  const errors: string[] = [];
  
  if (!file) {
    errors.push('No file selected');
  } else {
    if (file.size > maxSize) {
      errors.push('File size must be less than 25MB');
    }
    
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not supported. Please use PDF, JPG, PNG, DOC, or TXT files.');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format file size helper
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Export all functions
export default {
  uploadFileWithProgress,
  analyzeDocumentWithAI,
  enhancedUploadWorkflow,
  validateFile,
  formatFileSize
};