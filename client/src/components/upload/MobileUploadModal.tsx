import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Smartphone, Clock, CheckCircle, X } from "lucide-react";
import { useFileStatus } from "@/hooks/useFileStatus";
import { io, Socket } from "socket.io-client";

interface Session {
  id: string;
  url: string;
  expiresAt: string;
  purpose: "photos" | "documents";
}

interface MobileUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purpose: "photos" | "documents";
  familyId?: string;
}

export default function MobileUploadModal({ 
  open, 
  onOpenChange, 
  purpose,
  familyId = "family-1" 
}: MobileUploadModalProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [filesUploaded, setFilesUploaded] = useState<number>(0);
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();

  // Create session when modal opens
  useEffect(() => {
    if (!open) {
      setSession(null);
      setFilesUploaded(0);
      setCompleted(false);
      return;
    }

    const createSession = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/mobile-upload/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ purpose, familyId }),
        });

        if (!response.ok) {
          throw new Error("Failed to create session");
        }

        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error("Session creation error:", error);
        toast({
          title: "Error",
          description: "Failed to create upload session. Please try again.",
          variant: "destructive",
        });
        onOpenChange(false);
      } finally {
        setLoading(false);
      }
    };

    createSession();
  }, [open, purpose, familyId, toast, onOpenChange]);

  // Listen for uploads via WebSocket
  useEffect(() => {
    if (!session) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;
    
    const socket = io(wsUrl, {
      transports: ['websocket'],
      upgrade: false,
    });

    socket.on("connect", () => {
      console.log("[mobile-modal] Connected to WebSocket");
    });

    socket.on("file:update", (update: any) => {
      if (update.type === "session-complete" && update.sessionId === session.id) {
        setFilesUploaded(update.filesUploaded || 0);
        setCompleted(true);
        
        toast({
          title: "Upload complete!",
          description: `${update.filesUploaded} file(s) uploaded from mobile device.`,
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [session, toast]);

  const timeRemaining = session ? Math.max(0, Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000 / 60)) : 0;

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleDone = () => {
    onOpenChange(false);
    // Trigger refresh of file lists
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-[#D4AF37]" />
            Mobile Upload
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
              <p className="text-gray-400">Creating upload session...</p>
            </div>
          ) : completed ? (
            <Card className="bg-green-900/20 border-green-700/30">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-400 mb-2">Upload Complete!</h3>
                <p className="text-gray-300 mb-4">
                  {filesUploaded} file{filesUploaded !== 1 ? 's' : ''} uploaded successfully from your mobile device.
                </p>
                <Button 
                  onClick={handleDone}
                  className="bg-[#D4AF37] text-black hover:bg-[#B8941F] font-medium"
                >
                  Done
                </Button>
              </CardContent>
            </Card>
          ) : session ? (
            <>
              <div className="text-center">
                <p className="text-gray-300 mb-4">
                  Scan this QR code with your phone to upload {purpose}:
                </p>
                
                <div className="bg-white p-4 rounded-lg inline-block">
                  <QRCodeSVG 
                    value={session.url} 
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                </div>
                
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-400">
                    Or visit this link on your phone:
                  </p>
                  <p className="text-xs text-[#D4AF37] break-all font-mono bg-gray-800 p-2 rounded">
                    {session.url}
                  </p>
                </div>
              </div>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="h-4 w-4" />
                      Session expires in {timeRemaining} minutes
                    </div>
                    <div className="text-gray-500">
                      Waiting for files...
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => window.open(session.url, '_blank')}
                  className="flex-1 bg-[#D4AF37] text-black hover:bg-[#B8941F] font-medium"
                >
                  Open Mobile Page
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <X className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-gray-400">Failed to create upload session</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}