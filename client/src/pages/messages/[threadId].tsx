import React, { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send, Paperclip, ImageIcon, File, Loader2 } from "lucide-react";
import { Link } from "wouter";

/** ---------------------------------------------
 * Types
 * --------------------------------------------- */
type Message = {
  id: string;
  body: string;
  author: { id: string; name: string };
  attachments: Array<{ id: string; name: string; url: string; type?: string }>;
  createdAt: string;
};

type Thread = {
  id: string;
  title: string;
  memberIds: string[];
  memberNames: string[];
};

/** ---------------------------------------------
 * API calls
 * --------------------------------------------- */
async function fetchThread(threadId: string): Promise<Thread> {
  const response = await fetch(`/api/threads/${threadId}`);
  if (!response.ok) throw new Error("Failed to fetch thread");
  return response.json();
}

async function fetchMessages(threadId: string): Promise<{ messages: Message[] }> {
  const response = await fetch(`/api/threads/${threadId}/messages`);
  if (!response.ok) throw new Error("Failed to fetch messages");
  return response.json();
}

async function sendMessage(threadId: string, body: string, fileIds: string[]): Promise<Message> {
  const response = await fetch(`/api/threads/${threadId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body, fileIds }),
  });
  if (!response.ok) throw new Error("Failed to send message");
  const result = await response.json();
  return result.message;
}

async function uploadFiles(files: File[]): Promise<string[]> {
  if (!files.length) return [];
  
  const fileIds: string[] = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    fileIds.push(result.fileId);
  }
  return fileIds;
}

/** ---------------------------------------------
 * Components
 * --------------------------------------------- */
const MessageBubble: React.FC<{ message: Message; isMe: boolean }> = ({ message, isMe }) => {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : ''}`}>
      {!isMe && (
        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-xs text-[#D4AF37] font-medium mt-1">
          {message.author.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
      )}
      
      <div className={`flex-1 max-w-[70%] ${isMe ? 'text-right' : ''}`}>
        {!isMe && (
          <div className="text-xs text-white/60 mb-1">{message.author.name}</div>
        )}
        
        <div className={`rounded-2xl px-4 py-3 ${
          isMe 
            ? 'bg-[#D4AF37] text-black ml-auto' 
            : 'bg-white/10 text-white'
        }`}>
          {message.body && (
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.body}
            </div>
          )}
          
          {message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className={`flex items-center gap-2 p-2 rounded border ${
                    isMe ? 'border-black/20 bg-black/10' : 'border-white/20 bg-white/10'
                  }`}
                >
                  {attachment.type?.startsWith('image/') ? (
                    <ImageIcon className="h-4 w-4" />
                  ) : (
                    <File className="h-4 w-4" />
                  )}
                  <span className="text-xs truncate max-w-[120px]">{attachment.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="text-xs text-white/40 mt-1">
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
};

const MessageComposer: React.FC<{
  threadId: string;
  onMessageSent?: () => void;
}> = ({ threadId, onMessageSent }) => {
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const sendMutation = useMutation({
    mutationFn: async () => {
      setSending(true);
      const fileIds = await uploadFiles(files);
      return sendMessage(threadId, body, fileIds);
    },
    onSuccess: () => {
      setBody("");
      setFiles([]);
      queryClient.invalidateQueries({ queryKey: ["messages", threadId] });
      onMessageSent?.();
    },
    onSettled: () => setSending(false),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((body.trim() || files.length > 0) && !sending) {
      sendMutation.mutate();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t border-white/10 p-4">
      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.map((file, i) => (
            <div 
              key={`${file.name}-${i}`}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-xs text-white/80"
              data-testid={`file-preview-${i}`}
            >
              <ImageIcon className="h-4 w-4" />
              <span className="max-w-[200px] truncate">{file.name}</span>
              <button
                onClick={() => removeFile(i)}
                className="text-white/60 hover:text-white/90"
                data-testid={`button-remove-file-${i}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type a message..."
            rows={2}
            className="w-full resize-none rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
            data-testid="textarea-message-compose"
          />
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          data-testid="input-file-attachment"
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition"
          data-testid="button-attach-file"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        
        <button
          type="submit"
          disabled={(!body.trim() && files.length === 0) || sending}
          className="px-4 py-3 rounded-xl bg-[#D4AF37] text-black font-medium hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          data-testid="button-send-message"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};

/** ---------------------------------------------
 * Main Component
 * --------------------------------------------- */
type Props = {
  threadId?: string;
  onBack?: () => void;
};

export const MessagesPage: React.FC<Props> = ({ threadId = "family", onBack }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch thread info
  const { data: thread, isLoading: threadLoading } = useQuery({
    queryKey: ["thread", threadId],
    queryFn: () => fetchThread(threadId),
  });

  // Fetch messages
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", threadId],
    queryFn: () => fetchMessages(threadId),
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData?.messages]);

  if (threadLoading || messagesLoading) {
    return (
      <div className="h-screen bg-[var(--bg-900)] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/60">
          <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
          <span>Loading messages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[var(--bg-900)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-[var(--bg-800)]">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/10 transition"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5 text-white/70" />
          </button>
        )}
        <Link href="/family">
          <button className="p-2 rounded-lg hover:bg-white/10 transition">
            <ArrowLeft className="h-5 w-5 text-white/70" />
          </button>
        </Link>
        
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-white">
            {thread?.title || "Family Chat"}
          </h1>
          {thread?.memberNames && (
            <p className="text-sm text-white/60">
              {thread.memberNames.join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagesData?.messages && messagesData.messages.length > 0 ? (
          messagesData.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isMe={message.author.id === "me"} // TODO: Replace with actual user check
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-white/40">
            <div className="text-center">
              <div className="text-lg mb-2">No messages yet</div>
              <div className="text-sm">Start the conversation!</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <MessageComposer threadId={threadId} />
    </div>
  );
};

export default MessagesPage;