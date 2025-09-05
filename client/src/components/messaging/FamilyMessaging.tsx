import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Send, Users, MessageCircle, Loader2, File, Image } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface FamilyMessagingProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MessageThread {
  id: string;
  kind: "family" | "dm" | "group";
  title?: string;
  familyId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  threadId: string;
  authorId: string;
  body?: string;
  fileIds?: string[];
  createdAt: string;
  author?: {
    name: string;
    avatarColor: string;
  };
}

export function FamilyMessaging({ isOpen, onClose }: FamilyMessagingProps) {
  const [messageBody, setMessageBody] = useState("");
  const queryClient = useQueryClient();

  // Fetch or create family thread
  const { data: threadData, isLoading: threadLoading } = useQuery({
    queryKey: ["/api/threads", "family"],
    queryFn: async () => {
      const response = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "family" })
      });
      if (!response.ok) throw new Error("Failed to create/get thread");
      return response.json();
    },
    enabled: isOpen,
  });

  // Fetch messages for the thread
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/threads", threadData?.thread?.id, "messages"],
    enabled: !!threadData?.thread?.id,
  });

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (body: string) => {
      if (!threadData?.thread?.id) throw new Error("No thread available");
      const response = await apiRequest("POST", `/api/threads/${threadData.thread.id}/messages`, { body });
      return response.json();
    },
    onSuccess: () => {
      setMessageBody("");
      queryClient.invalidateQueries({ 
        queryKey: ["/api/threads", threadData?.thread?.id, "messages"] 
      });
    }
  });

  const handleSend = () => {
    if (!messageBody.trim() || !threadData?.thread?.id) return;
    sendMessage.mutate(messageBody);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl h-[600px] flex flex-col p-0 bg-zinc-900 border border-zinc-700 shadow-2xl"
        data-testid="messaging-modal"
      >
        <DialogHeader className="p-6 pb-4 border-b border-zinc-700">
          <DialogTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg">
              <MessageCircle className="h-5 w-5 text-black" />
            </div>
            <span>Family Chat</span>
            <div className="flex items-center gap-1 ml-auto text-sm text-zinc-400">
              <Users className="h-4 w-4" />
              <span>Family</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 p-6">
            {threadLoading || messagesLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                <span className="ml-2 text-zinc-400">Loading messages...</span>
              </div>
            ) : messagesData && (messagesData as any)?.messages && (messagesData as any).messages.length > 0 ? (
              <div className="space-y-4">
                {(messagesData as any).messages.reverse().map((message: Message) => (
                  <div key={message.id} className="flex gap-3 group">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback 
                        className="text-xs font-medium"
                        style={{ backgroundColor: message.author?.avatarColor || "#3498DB" }}
                      >
                        {message.author?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white text-sm">
                          {message.author?.name || "User"}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      {message.body && (
                        <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                          {message.body}
                        </div>
                      )}
                      {message.fileIds && message.fileIds.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {message.fileIds.map((fileId: string, index: number) => (
                            <div 
                              key={index}
                              className="flex items-center gap-2 p-2 bg-zinc-800 rounded border border-zinc-700"
                            >
                              <File className="h-4 w-4 text-zinc-400" />
                              <span className="text-xs text-zinc-400">File attached</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <MessageCircle className="h-12 w-12 text-zinc-600 mb-3" />
                <h3 className="text-lg font-medium text-white mb-1">Start the conversation</h3>
                <p className="text-zinc-400 text-sm">
                  Send the first message to your family
                </p>
              </div>
            )}
          </ScrollArea>

          {/* Message Composer */}
          <div className="p-6 pt-4 border-t border-zinc-700">
            <div className="flex gap-3">
              <div className="flex-1">
                <Textarea
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="min-h-[44px] max-h-32 resize-none bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/20"
                  data-testid="message-input"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-11 w-11 text-zinc-400 hover:text-white hover:bg-zinc-700"
                  data-testid="attach-file-btn"
                >
                  <File className="h-5 w-5" />
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={!messageBody.trim() || sendMessage.isPending}
                  className="h-11 w-11 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black"
                  data-testid="send-message-btn"
                >
                  {sendMessage.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}