import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "wouter";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Camera, FileText, X, RotateCcw } from "lucide-react";

type UploadItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  status: "queued" | "uploading" | "scanning" | "processing" | "ready" | "error";
  progress: number;
  serverId?: string;
  errorMsg?: string;
};

type SessionInfo = {
  id: string;
  purpose: "photos" | "documents";
  expiresAt: string;
  used: boolean;
};

const MAX_MB = 25;
const ACCEPT_DOCS = ".pdf,.doc,.docx,.txt,image/*";

export default function MobileUpload() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [items, setItems] = useState<UploadItem[]>([]);
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const { toast } = useToast();

  // Fetch session info
  useEffect(() => {
    if (!sessionId) return;
    
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/mobile-upload/${sessionId}`);
        if (!res.ok) {
          if (res.status === 404) {
            toast({
              title: "Session not found",
              description: "This upload session doesn't exist or has expired.",
              variant: "destructive",
            });
          } else if (res.status === 410) {
            toast({
              title: "Session expired",
              description: "This upload session has expired. Please create a new one.",
              variant: "destructive",
            });
          }
          return;
        }
        const data = await res.json();
        setSessionInfo(data);
      } catch (error) {
        console.error("Failed to fetch session:", error);
        toast({
          title: "Connection error", 
          description: "Could not connect to the server.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
  }, [sessionId, toast]);

  // WebSocket connection
  useEffect(() => {
    if (!sessionId) return;
    
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;
    
    const socket = io(wsUrl, {
      transports: ['websocket'],
      upgrade: false,
    });
    
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      console.log("[mobile-upload] Connected to server");
    });
    
    socket.on("disconnect", () => {
      setConnected(false);
      console.log("[mobile-upload] Disconnected from server");
    });

    socket.on("file:update", (update: any) => {
      console.log("[mobile-upload] File update:", update);
      setItems(prev => prev.map(item => {
        if (item.serverId === update.fileId) {
          return {
            ...item,
            status: update.ready ? "ready" : update.processing ? "processing" : item.status,
            progress: update.ready ? 100 : item.progress,
          };
        }
        return item;
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  const onPick = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    
    const newItems: UploadItem[] = [];
    Array.from(files).forEach((file) => {
      const mb = file.size / (1024 * 1024);
      if (mb > MAX_MB) {
        toast({
          title: "File too large",
          description: `${file.name} is ${mb.toFixed(1)}MB. Maximum size is ${MAX_MB}MB.`,
          variant: "destructive",
        });
        return;
      }
      
      const id = crypto.randomUUID();
      const item: UploadItem = {
        id,
        file,
        name: file.name || (file.type.includes("image/") ? "Photo.jpg" : "Document"),
        size: file.size,
        type: file.type,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        progress: 0,
        status: "queued",
      };
      newItems.push(item);
    });
    
    setItems(prev => [...newItems, ...prev]);
  }, [toast]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleOpenPicker = () => inputRef.current?.click();

  const handleUpload = useCallback(async () => {
    if (!sessionId || !items.some(i => i.status === "queued" || i.status === "error")) return;
    
    setSending(true);
    try {
      for (const item of items) {
        if (!(item.status === "queued" || item.status === "error")) continue;

        setItems(prev => prev.map(p => p.id === item.id ? { ...p, status: "uploading", progress: 0 } : p));

        const formData = new FormData();
        formData.append("files", item.file);
        formData.append("clientId", item.id);

        const res = await fetch(`/api/mobile-upload/${sessionId}/files`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorText = await res.text();
          setItems(prev => prev.map(p => p.id === item.id ? { 
            ...p, 
            status: "error", 
            errorMsg: errorText || "Upload failed" 
          } : p));
          continue;
        }

        const result = await res.json();
        const fileId = result.files?.[0]?.fileId;
        
        setItems(prev => prev.map(p => p.id === item.id ? { 
          ...p, 
          status: "scanning", 
          serverId: fileId, 
          progress: 100 
        } : p));
      }
      
      toast({
        title: "Upload complete",
        description: "Your files have been uploaded and are being processed.",
      });
      
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  }, [items, sessionId, toast]);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(p => p.id !== id));
  }, []);

  const retryItem = useCallback((id: string) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, status: "queued", errorMsg: undefined } : p));
  }, []);

  const hasQueuedOrError = useMemo(
    () => items.some(i => i.status === "queued" || i.status === "error"),
    [items]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0f12] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!sessionInfo) {
    return (
      <div className="min-h-screen bg-[#0e0f12] text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900/50 border-gray-700">
          <CardContent className="p-6 text-center">
            <X className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Session Not Found</h1>
            <p className="text-gray-400 mb-4">
              This upload session has expired or doesn't exist. Please create a new one from your desktop.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0e0f12] text-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-black/60 border-b border-gray-700/50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
              {sessionInfo.purpose === "photos" ? (
                <Camera className="h-5 w-5 text-[#D4AF37]" />
              ) : (
                <FileText className="h-5 w-5 text-[#D4AF37]" />
              )}
            </div>
            <div>
              <h1 className="font-semibold">Mobile Upload</h1>
              <p className="text-xs text-gray-400 flex items-center gap-2">
                {connected ? (
                  <>
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Connected
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    Reconnecting...
                  </>
                )}
              </p>
            </div>
          </div>
          <Button
            onClick={handleOpenPicker}
            className="bg-[#D4AF37] text-black hover:bg-[#B8941F] font-medium"
          >
            <Upload className="h-4 w-4 mr-2" />
            Add Files
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Capture Section */}
        <Card className="mb-6 bg-gray-900/30 border-gray-700/50">
          <CardContent className="p-6">
            <p className="text-gray-300 mb-4 text-center">
              Capture {sessionInfo.purpose === "photos" ? "photos" : "documents"} or choose files from your device
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleOpenPicker}
                className="h-12 border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 text-white"
              >
                <Camera className="h-5 w-5 mr-2" />
                Take Photo
              </Button>
              <label className="h-12 rounded-md border border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center cursor-pointer transition-colors text-white">
                <FileText className="h-5 w-5 mr-2" />
                Choose Files
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept={ACCEPT_DOCS}
                  onChange={(e) => onPick(e.target.files)}
                />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Files List */}
        <div className="space-y-3">
          {items.length === 0 ? (
            <Card className="bg-gray-900/20 border-gray-700/30">
              <CardContent className="p-8 text-center">
                <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No files selected yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Tap "Add Files" or "Take Photo" to begin
                </p>
              </CardContent>
            </Card>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="bg-gray-900/30 border-gray-700/50">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Preview */}
                    <div className="w-16 h-16 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.previewUrl ? (
                        <img src={item.previewUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="h-6 w-6 text-gray-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-sm text-gray-400">
                            {(item.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {(item.status === "error" || item.status === "queued") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => retryItem(item.id)}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className={`${
                            item.status === "ready" ? "text-green-400" :
                            item.status === "error" ? "text-red-400" :
                            item.status === "uploading" || item.status === "scanning" || item.status === "processing" ? "text-[#D4AF37]" :
                            "text-gray-400"
                          }`}>
                            {item.status === "queued" && "Queued"}
                            {item.status === "uploading" && "Uploading..."}
                            {item.status === "scanning" && "Scanning..."}
                            {item.status === "processing" && "Processing..."}
                            {item.status === "ready" && "Ready ✓"}
                            {item.status === "error" && `Error: ${item.errorMsg || "Upload failed"}`}
                          </span>
                          <span className="text-gray-500">{item.progress}%</span>
                        </div>
                        <Progress 
                          value={item.progress} 
                          className="h-1.5 bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Bottom Upload Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 p-4 bg-black/80 backdrop-blur-md border-t border-gray-700/50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="text-sm text-gray-300">
              {items.filter(i => i.status === "ready").length} of {items.length} ready
            </div>
            <Button
              disabled={!hasQueuedOrError || sending}
              onClick={handleUpload}
              className="bg-[#D4AF37] text-black hover:bg-[#B8941F] disabled:opacity-50 font-medium"
            >
              {sending ? "Uploading..." : "Upload Files"}
            </Button>
          </div>
        </div>
      )}

      {/* Hidden file input for primary picker */}
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept={ACCEPT_DOCS}
        multiple
        capture="environment"
        onChange={(e) => onPick(e.target.files)}
      />
    </main>
  );
}