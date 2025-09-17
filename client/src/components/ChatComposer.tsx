import React, { useRef, useState } from "react";
import { Send, Paperclip, X, Loader2 } from "lucide-react";

type UploadedFile = {
  id: string;
  name: string;
  mime: string;
  size: number;
  url: string;
  width?: number;
  height?: number;
};

interface ChatComposerProps {
  onSend: (text: string, files: UploadedFile[]) => Promise<void>;
  disabled?: boolean;
}

export default function ChatComposer({ onSend, disabled = false }: ChatComposerProps) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(fileList).forEach(f => formData.append("files", f));
      
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) throw new Error("Upload failed");
      
      const result = await response.json();
      const newFiles: UploadedFile[] = result.files || [];
      setFiles(prev => [...prev, ...newFiles]);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (sending || disabled) return;
    
    const body = text.trim();
    if (!body && files.length === 0) return;
    
    setSending(true);
    try {
      await onSend(body, files);
      setText("");
      setFiles([]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }

  const canSubmit = !sending && !disabled && (text.trim() || files.length > 0);

  return (
    <div className="border-t border-white/10 p-3">
      {/* File Previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {files.map((file, i) => (
            <div key={file.id || i} className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1">
              {file.mime.startsWith("image/") ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-8 h-8 object-cover rounded"
                />
              ) : (
                <div className="w-8 h-8 bg-[#D4AF37]/20 rounded grid place-items-center">
                  <span className="text-xs text-[#D4AF37]">📎</span>
                </div>
              )}
              <span className="text-xs text-white/70 truncate max-w-[100px]">
                {file.name}
              </span>
              <button
                onClick={() => removeFile(i)}
                className="text-white/50 hover:text-white/80 transition-colors"
                disabled={uploading || sending}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className="flex items-center gap-2"
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("bg-white/5");
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove("bg-white/5");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("bg-white/5");
          handleFiles(e.dataTransfer.files);
        }}
        onPaste={(e) => {
          const clipboardFiles = e.clipboardData?.files;
          if (clipboardFiles && clipboardFiles.length > 0) {
            handleFiles(clipboardFiles);
          }
        }}
      >
        {/* File Upload Button */}
        <button
          id="chat-attach-btn"
          onClick={() => fileRef.current?.click()}
          disabled={uploading || sending}
          className="shrink-0 rounded-full p-2 bg-white/5 hover:bg-white/10 active:bg-white/15 transition will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
          title="Attach files (or drag & drop, or paste)"
          data-testid="button-attach-files"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
          ) : (
            <Paperclip className="w-5 h-5 text-[#D4AF37]" />
          )}
        </button>

        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*,.pdf,.txt,.docx,.xlsx,.zip"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading || sending}
        />

        {/* Message Input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (📎 attach, drop, or paste files)"
          className="flex-1 bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60 resize-none"
          data-testid="input-chat-message"
          disabled={sending || disabled}
          rows={1}
          style={{ minHeight: '38px', maxHeight: '100px' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = '38px';
            target.style.height = Math.min(target.scrollHeight, 100) + 'px';
          }}
        />

        {/* Send Button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="p-2 rounded-lg bg-[#D4AF37] hover:bg-[#D4AF37]/90 disabled:opacity-50 disabled:cursor-not-allowed text-black transition-colors"
          title="Send message"
          data-testid="button-send-message"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}