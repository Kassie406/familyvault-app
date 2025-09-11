import { useState, useRef } from "react";
import { Upload, Zap, Copy, Edit, FileText, Image } from "lucide-react";
import { useUploadStore, type UploadedItem } from "@/stores/uploadStore";

// Define types for the components
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "link" | "ghost";
  size?: "default" | "sm";
  className?: string;
  [key: string]: any;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}


// Basic button component for the Trustworthy inbox
const Button = ({ children, onClick, variant = "default", size = "default", className = "", ...p }: ButtonProps) => {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50";
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    link: "underline-offset-4 hover:underline text-blue-600",
    ghost: "hover:bg-gray-100"
  };
  const sizes: Record<string, string> = { default: "h-10 py-2 px-4", sm: "h-8 px-3 text-sm" };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} {...p}>{children}</button>;
};

const Card = ({ children, className = "" }: CardProps) => <div className={`rounded-lg border bg-white shadow-sm ${className}`}>{children}</div>;

function TrustworthyInbox() {
  const { uploads, addUpload, updateUpload, removeUpload } = useUploadStore();
  const [selected, setSelected] = useState<UploadedItem | null>(null);
  const [show, setShow] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);


  // Helper: file -> base64 (NO data: prefix)
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => {
        const result = r.result as string;
        resolve(result.split(",")[1]); // strip "data:...;base64,"
      };
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  async function analyzeDocument(file: File, mode: string = "auto") {
    // Get API URL from environment - this should be your AWS Lambda URL
    const BASE_API_URL = import.meta?.env?.VITE_API_URL;
    const API_URL = BASE_API_URL ? `${BASE_API_URL}/analyze` : null;
    
    console.log("[DEBUG] Environment check:", {
      VITE_API_URL: import.meta?.env?.VITE_API_URL,
      API_URL: API_URL,
      hasApiUrl: !!API_URL
    });
    
    if (!API_URL) {
      console.error('❌ VITE_API_URL not configured - please set this to your AWS Lambda URL');
      throw new Error("AWS Lambda URL not configured. Please set VITE_API_URL environment variable.");
    }

    // Map analysis modes to document types for Lambda
    const docTypeMap: Record<string, string> = {
      'auto': 'auto',
      'id': 'identity', 
      'forms': 'form',
      'tables': 'form' // Use form for tables as well
    };
    
    const documentType = docTypeMap[mode] || 'auto';
    
    // Call your Lambda through API Gateway
    const fileContent = await fileToBase64(file);

    // DEBUG: Add diagnostic logging
    console.log("[ANALYZE] sending", {
      filename: file.name,
      size: file.size,
      base64Head: fileContent.slice(0, 40),
      base64Len: fileContent.length,
    });

    // Put a simple correlation id in the payload
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileContent,
        filename: file.name || "upload.jpg",
        documentType,
        requestId,
      })
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Analysis failed: ${error}`);
    }

    return res.json();
  }

  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const f of files) {
      addUpload({ 
        id: Date.now() + Math.random(), 
        name: f.name, 
        file: f, 
        status: "pending" as const, 
        mode: "auto", // Always use auto mode for simplicity
        analyzed: false,
        uploadedAt: new Date()
      });
    }
  };


  const remove = (id: number) => {
    removeUpload(id);
    if (selected?.id === id) {
      setSelected(null);
      setShow(false);
    }
  };

  const showDetails = (item: UploadedItem) => {
    setSelected(item);
    setShow(true);
  };

  // Copy extracted text to clipboard
  const copyText = async (item: UploadedItem) => {
    if (!item.result?.extractedText) return;
    try {
      await navigator.clipboard.writeText(item.result.extractedText);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  // Get files with thumbnail preview
  const getFileIcon = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
      return <Image className="h-5 w-5 text-blue-400" />;
    }
    return <FileText className="h-5 w-5 text-blue-400" />;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Clean Header - No confusing mode selectors */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Family Vault</h1>
            <p className="text-gray-400">Upload documents and we'll analyze them automatically</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* Simple Upload Area - Like Trustworthy */}
        <Card className="p-12 bg-gray-900 border-gray-700">
          <div 
            className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center hover:border-[#D4AF37] transition-colors cursor-pointer group"
            onClick={() => fileRef.current?.click()}
            data-testid="upload-dropzone"
          >
            <Upload className="mx-auto h-16 w-16 text-gray-400 mb-6 group-hover:text-[#D4AF37] transition-colors" />
            <h3 className="text-xl font-semibold text-white mb-3">Browse or drop files</h3>
            <p className="text-gray-400 text-lg mb-4">Drop your documents here to get started</p>
            <p className="text-sm text-gray-500">Supports IDs, passports, driver licenses, birth certificates, PDFs, and images</p>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={upload}
              className="hidden"
              data-testid="file-input"
            />
          </div>
        </Card>

        {/* Uploaded Documents - Clean grid like Trustworthy */}
        {uploads.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Your Documents ({uploads.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploads.map((item) => (
                <Card key={item.id} className="p-4 bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors" data-testid={`document-${item.id}`}>
                  <div className="flex items-start gap-4">
                    {/* File icon/thumbnail */}
                    <div className="p-3 bg-gray-800 rounded-lg">
                      {getFileIcon(item.name)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{item.name}</p>
                      
                      {/* Status indicator */}
                      <div className="mt-2">
                        {item.status === "analyzing" && (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                            <span className="text-sm text-yellow-400">Analyzing...</span>
                          </div>
                        )}
                        
                        {item.status === "complete" && item.result && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                              <span className="text-sm text-green-400">Complete</span>
                            </div>
                            
                            {/* Clean Details button - Only appears after analysis */}
                            <Button 
                              size="sm" 
                              onClick={() => showDetails(item)}
                              className="bg-[#D4AF37] text-black hover:bg-[#c6a02e] flex items-center gap-2"
                              data-testid={`details-button-${item.id}`}
                            >
                              <Zap className="h-4 w-4" />
                              ⚡ Details {Object.keys(item.result.extractedData || {}).length}
                            </Button>
                          </div>
                        )}
                        
                        {item.status === "error" && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                              <span className="text-sm text-red-400">Analysis failed</span>
                            </div>
                            <p className="text-xs text-red-300">{item.error}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Remove button */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => remove(item.id)}
                      className="text-gray-400 hover:text-red-400"
                      data-testid={`remove-button-${item.id}`}
                    >
                      ×
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {show && selected && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Analysis Results: {selected.name}</h2>
                <Button variant="outline" onClick={() => setShow(false)}>Close</Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
              {/* Extracted Data */}
              {selected.result?.extractedData && Object.keys(selected.result.extractedData).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#D4AF37] mb-3 flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    ⚡ Details {Object.keys(selected.result.extractedData).length}
                  </h3>
                  <div className="grid gap-3">
                    {Object.entries(selected.result.extractedData).map(([key, value], idx) => (
                      <div key={idx} className="bg-gray-800 p-3 rounded border border-gray-700">
                        <div className="text-sm font-medium text-[#D4AF37] mb-1">{key}</div>
                        <div className="text-white">{String(value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Extracted Text */}
              {selected.result?.extractedText && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Raw Text</h3>
                  <div className="bg-gray-800 p-4 rounded border border-gray-700">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap break-words">
                      {selected.result.extractedText}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrustworthyInbox;