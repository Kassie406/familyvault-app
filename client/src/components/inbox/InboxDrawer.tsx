"use client";

import React, { useState, useCallback } from "react";
import { X, FileImage, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useUI } from "@/lib/ui-store";
import SuggestDetailsModal from "./SuggestDetailsModal";
import { formatFileSize, getConfidenceDot } from "@/lib/inbox";
import type { InboxItem } from '@shared/types/inbox';

interface InboxItemCardProps {
  item: InboxItem;
  onOpenMember: () => void;
  onShowDetails: () => void;
  onDismiss: () => void;
}

function InboxItemCard({ item, onOpenMember, onShowDetails, onDismiss }: InboxItemCardProps) {
  const suggestion = item.suggestion;
  
  const getStatusIcon = () => {
    switch (item.status) {
      case "analyzing":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />;
      case "suggested":
        return <div className={`w-2 h-2 rounded-full ${getConfidenceDot(suggestion?.confidence || 0)}`} />;
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "dismissed":
        return <XCircle className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-xl border border-[#232530] bg-[#0A0B10] p-4 space-y-3">
      {/* File Info */}
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-16 rounded-lg bg-[#232530] overflow-hidden flex items-center justify-center">
          {item.fileUrl ? (
            <img 
              src={item.fileUrl} 
              alt="" 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : null}
          <div className="absolute inset-0 flex items-center justify-center">
            <FileImage className="w-6 h-6 text-white/40" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-white text-sm truncate font-medium">
            {item.filename}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            {getStatusIcon()}
            <span>
              {item.status === "analyzing" && "Analyzing..."}
              {item.status === "suggested" && suggestion && `${suggestion.confidence}% match`}
              {item.status === "accepted" && "Accepted"}
              {item.status === "dismissed" && "Dismissed"}
            </span>
            {item.fileSize && (
              <>
                <span>•</span>
                <span>{formatFileSize(item.fileSize)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Suggested Destination */}
      {suggestion && item.status === "suggested" && (
        <div className="rounded-lg border border-[#232530] bg-[#13141B] p-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="text-white/50 text-xs">Suggested destination</div>
              <div className="text-white text-sm font-medium">
                {suggestion.memberName}
              </div>
              <div className="text-white/40 text-xs">
                Family IDs › Family Member
              </div>
            </div>
            <button
              onClick={onOpenMember}
              className="px-3 py-1.5 rounded-lg border border-[#232530] text-white/80 hover:bg-white/5 transition-colors flex-shrink-0"
              data-testid="button-open-member"
            >
              Open
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {suggestion && item.status === "suggested" && (
          <button
            onClick={onShowDetails}
            className="px-3 py-1.5 rounded-lg border border-[#232530] text-white/80 hover:bg-white/5 transition-colors text-sm"
            data-testid="button-show-details"
          >
            Details
            <span className="ml-1 px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-xs">
              {suggestion.fields.length}
            </span>
          </button>
        )}
        {item.status !== "dismissed" && (
          <button
            onClick={onDismiss}
            className="px-3 py-1.5 rounded-lg border border-[#232530] text-white/60 hover:bg-white/5 transition-colors text-sm"
            data-testid="button-dismiss"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

export default function InboxDrawer() {
  const [location, setLocation] = useLocation();
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { openInbox, closeInbox } = useUI();

  const isOpen = location === "/family/inbox";

  // Wire to UI store
  React.useEffect(() => {
    if (isOpen) openInbox();
    else closeInbox();
    return () => closeInbox(); // safety on unmount
  }, [isOpen, openInbox, closeInbox]);

  // Fetch inbox items from API
  const { data: items = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/inbox"],
    enabled: isOpen, // Only fetch when drawer is open
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  // Close handler
  const onClose = useCallback(() => {
    setLocation("/family");
  }, [setLocation]);

  const activeItem = (items as InboxItem[]).find((item: InboxItem) => item.id === activeItemId) || null;

  // Accept suggestion mutation
  const acceptMutation = useMutation({
    mutationFn: async ({ id, memberId, fields }: { id: string; memberId: string; fields: any[] }) => {
      return await apiRequest(`/api/inbox/${id}/accept`, "POST", {
        memberId, fields
      });
    },
    onSuccess: () => {
      setActiveItemId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/inbox"] });
    },
    onError: (error) => {
      console.error("Failed to accept suggestion:", error);
    },
  });

  // Dismiss item mutation
  const dismissMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/inbox/${id}/dismiss`, "POST");
    },
    onSuccess: () => {
      setActiveItemId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/inbox"] });
    },
    onError: (error) => {
      console.error("Failed to dismiss item:", error);
    },
  });

  // Accept suggestion - move file to member
  const acceptSuggestion = (id: string) => {
    const item = (items as InboxItem[]).find((item: InboxItem) => item.id === id);
    if (item?.suggestion) {
      acceptMutation.mutate({
        id,
        memberId: item.suggestion.memberId,
        fields: item.suggestion.fields,
      });
    }
  };

  // Dismiss item
  const dismissItem = (id: string) => {
    dismissMutation.mutate(id);
  };

  // Navigate to member profile
  const openMember = (memberId: string) => {
    setLocation(`/family/member/${memberId}`);
  };

  const visibleItems = (items as InboxItem[]).filter((item: InboxItem) => item.status !== "dismissed");

  if (!isOpen) return null;

  return (
    <>
      {/* Inbox Drawer */}
      <aside 
        className="fixed top-0 left-0 h-full w-[400px] bg-[#0A0B10] border-r border-[#232530] z-40 shadow-2xl"
        aria-label="Upload Inbox"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#232530] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <h2 className="text-white font-medium">Inbox</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/60 hover:text-white transition-colors"
            data-testid="button-close-inbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drop Zone */}
        <div className="p-4 border-b border-[#232530]">
          <div className="border-2 border-dashed border-[#232530] rounded-lg p-4 text-center">
            <div className="text-white/60 text-sm">
              Drop files here or{" "}
              <button className="text-blue-400 hover:text-blue-300 underline">
                Browse files
              </button>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 mx-auto mb-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
              </div>
              <div className="text-white/40 text-sm">
                Loading inbox...
              </div>
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-white/40 text-sm">
                No files to review
              </div>
              <div className="text-white/30 text-xs mt-2">
                Upload files through the Upload Center to see AI analysis here
              </div>
            </div>
          ) : (
            visibleItems.map((item: InboxItem) => (
              <InboxItemCard
                key={item.id}
                item={item}
                onOpenMember={() => item.suggestion && openMember(item.suggestion.memberId)}
                onShowDetails={() => setActiveItemId(item.id)}
                onDismiss={() => dismissItem(item.id)}
              />
            ))
          )}
        </div>
      </aside>

      {/* Details Modal */}
      <SuggestDetailsModal
        open={!!activeItem}
        item={activeItem}
        onAccept={acceptSuggestion}
        onDismiss={dismissItem}
        onOpenMember={(memberId) => openMember(memberId)}
        onClose={() => setActiveItemId(null)}
      />
    </>
  );
}