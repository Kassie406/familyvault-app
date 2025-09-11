import { useState, useRef } from "react";
import { Upload, Zap, Copy, Edit } from "lucide-react";

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

interface UploadedItem {
  id: number;
  name: string;
  file: File;
  status: "pending" | "analyzing" | "complete" | "error";
  mode: string;
  analyzed: boolean;
  result?: {
    extractedData?: Record<string, any>;
    extractedText?: string;
  };
  error?: string;
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
  const [uploaded, setUploaded] = useState<UploadedItem[]>([]);
  const [selected, setSelected] = useState<UploadedItem | null>(null);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"auto" | "id" | "forms" | "tables">("auto");
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
    // Get API URL from environment and add /analyze endpoint
    const BASE_API_URL = import.meta?.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
    const API_URL = BASE_API_URL ? `${BASE_API_URL}/analyze` : null;
    
    if (!API_URL) {
      console.warn('No VITE_API_URL configured, falling back to proxy endpoint');
      // Fallback to proxy endpoint if no direct Lambda URL
      const fileContent = await fileToBase64(file);
      const r = await fetch("/api/inbox/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, fileContent, mode })
      });
      if (!r.ok) throw new Error("Analysis failed");
      return r.json();
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

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileContent,
        filename: file.name || "upload.jpg",
        documentType
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
      setUploaded((prev) => [...prev, { 
        id: Date.now() + Math.random(), 
        name: f.name, 
        file: f, 
        status: "pending" as const, 
        mode: mode, // Store the analysis mode
        analyzed: false 
      }]);
    }
  };

  const analyze = async (item: UploadedItem) => {
    setUploaded(prev => 
      prev.map(i => i.id === item.id ? { ...i, status: "analyzing" as const, analyzed: true } : i)
    );

    try {
      const result = await analyzeDocument(item.file, item.mode);
      
      setUploaded(prev => 
        prev.map(i => i.id === item.id ? { 
          ...i, 
          status: "complete" as const, 
          result,
          analyzed: true 
        } : i)
      );
    } catch (err) {
      console.error("Analysis error:", err);
      setUploaded(prev => 
        prev.map(i => i.id === item.id ? { 
          ...i, 
          status: "error" as const, 
          error: (err as Error).message,
          analyzed: true 
        } : i)
      );
    }
  };

  const remove = (id: number) => {
    setUploaded(prev => prev.filter(i => i.id !== id));
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

  const pending = uploaded.filter(u => !u.analyzed);
  const processed = uploaded.filter(u => u.analyzed);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Trustworthy</h1>
              <p className="text-gray-400 mt-1">Document Analysis Inbox</p>
            </div>
            
            {/* Analysis Mode Selector */}
            <div className="flex gap-2">
              {(["auto", "id", "forms", "tables"] as const).map((m) => (
                <Button
                  key={m}
                  variant={mode === m ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode(m)}
                  className={mode === m ? "bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90" : "border-gray-600 text-white hover:bg-gray-800"}
                >
                  {m}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column - Upload and Pending */}
        <div className="space-y-6">
          
          {/* Upload Area */}
          <Card className="p-8 bg-gray-900 border-gray-700">
            <div 
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-[#D4AF37] transition-colors cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Upload Documents</h3>
              <p className="text-gray-400 mb-4">Drop files here or click to browse</p>
              <p className="text-xs text-gray-500">Mode: {mode}</p>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={upload}
                className="hidden"
              />
            </div>
          </Card>

          {/* Pending Analysis */}
          {pending.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">
                Pending Analysis ({pending.length})
              </h2>
              <div className="space-y-3">
                {pending.map((item) => (
                  <Card key={item.id} className="p-4 bg-gray-900 border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-gray-400">Mode: {item.mode}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => analyze(item)}
                          className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Analyze
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => remove(item.id)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Processed Documents */}
        <div>
          {processed.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">
                Processed Documents ({processed.length})
              </h2>
              <div className="space-y-3">
                {processed.map((item) => (
                  <Card key={item.id} className="p-4 bg-gray-900 border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-gray-400">Mode: {item.mode}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === "complete" ? "bg-green-900 text-green-300" :
                          item.status === "analyzing" ? "bg-yellow-900 text-yellow-300" :
                          item.status === "error" ? "bg-red-900 text-red-300" :
                          "bg-gray-700 text-gray-300"
                        }`}>
                          {item.status === "analyzing" ? "Processing..." : item.status}
                        </span>
                      </div>
                    </div>
                    
                    {item.status === "complete" && item.result && (
                      <div className="mt-3 space-y-2">
                        {/* Details count with golden styling */}
                        <div className="flex items-center justify-between">
                          <span className="text-[#D4AF37] font-medium flex items-center">
                            <Zap className="h-4 w-4 mr-1" />
                            ⚡ Details {Object.keys(item.result.extractedData || {}).length}
                          </span>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => showDetails(item)}>
                            <Edit className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          {item.result.extractedText && (
                            <Button variant="outline" size="sm" onClick={() => copyText(item)}>
                              <Copy className="h-4 w-4 mr-1" />
                              Copy Text
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => remove(item.id)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {item.status === "error" && (
                      <div className="mt-3">
                        <p className="text-red-400 text-sm">
                          Error: {item.error}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" onClick={() => analyze(item)}>
                            Retry
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => remove(item.id)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
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