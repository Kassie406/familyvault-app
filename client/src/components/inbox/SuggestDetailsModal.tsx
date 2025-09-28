"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { maskPII, getConfidenceColor } from "@/lib/inbox";
import type { InboxItem } from '@shared/types/inbox';

interface SuggestDetailsModalProps {
  open: boolean;
  item: InboxItem | null;
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
  onOpenMember: (memberId: string) => void;
  onClose: () => void;
}

export default function SuggestDetailsModal({ 
  open, 
  item, 
  onAccept, 
  onDismiss, 
  onOpenMember, 
  onClose 
}: SuggestDetailsModalProps) {
  const [showPII, setShowPII] = useState(false);
  const [copied, setCopied] = useState(false);
  
  if (!item?.suggestion || !open) return null;
  
  const suggestion = item.suggestion;
  
  const handleCopyAll = async () => {
    const text = (suggestion.fields || [])
      .map(field => `${field.key}: ${field.value}`)
      .join('\n');
    
    if (!text.trim()) {
      console.log('No fields to copy');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed right-4 top-4 w-[560px] max-w-[calc(100vw-2rem)] rounded-xl bg-[#13141B] border border-[#232530] shadow-2xl z-50">
        {/* Header */}
        <div className="p-6 border-b border-[#232530] flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-medium">
              {item.filename}
            </h3>
            <p className="text-white/60 text-sm mt-1">
              <span className="text-purple-400">✨</span> Suggested filename
            </p>
            <p className="text-white/80 text-sm font-medium mt-2">
              Social Security Card Angel Quintana
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDismiss(item.id)}
              className="px-4 py-2 rounded-lg border border-[#232530] text-white/80 hover:bg-white/5 transition-colors"
              data-testid="button-dismiss"
            >
              Dismiss
            </button>
            <button
              onClick={() => onAccept(item.id)}
              className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-medium hover:bg-[#c5a000] transition-colors"
              data-testid="button-accept"
            >
              Accept
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Suggested Destination */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#232530] bg-[#0A0B10]">
            <div>
              <div className="text-white/60 text-sm">Suggested destination</div>
              <div className="text-white text-sm font-medium">
                {suggestion.memberName}
              </div>
              <div className="text-white/40 text-xs">
                Family IDs › Family Member
              </div>
            </div>
            <button
              onClick={() => onOpenMember(suggestion.memberId)}
              className="px-3 py-1.5 rounded-lg border border-[#232530] text-white/80 hover:bg-white/5 transition-colors"
              data-testid="button-open-member"
            >
              Open
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-[#232530]">
            <div className="flex space-x-6">
              <button className="pb-3 border-b-2 border-[#D4AF37] text-[#D4AF37] text-sm font-medium">
                Details
                <span className="ml-2 px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-xs">
                  {suggestion.fields?.length || 0}
                </span>
              </button>
              <button className="pb-3 text-white/60 text-sm hover:text-white/80 transition-colors">
                Summary
              </button>
              <button className="pb-3 text-white/60 text-sm hover:text-white/80 transition-colors">
                Edit
              </button>
            </div>
          </div>

          {/* Extracted Fields */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-white text-sm font-medium">Extracted Information</h4>
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-white/60 hover:text-white/80 transition-colors"
                data-testid="button-copy-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy all
                  </>
                )}
              </button>
            </div>
            
            <div className="space-y-1 rounded-lg border border-[#232530] overflow-hidden">
              {(suggestion.fields || []).length === 0 ? (
                <div className="p-6 text-center text-white/60">
                  <p>No extracted fields available</p>
                  <p className="text-sm mt-2">The document analysis may still be in progress</p>
                </div>
              ) : (
                (suggestion.fields || []).map((field, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 p-3 border-b border-[#232530]/50 last:border-b-0">
                  <div className="col-span-2 text-white/60 text-xs uppercase tracking-wide font-medium">
                    {field.key}
                  </div>
                  <div className="col-span-3">
                    <div className="text-white text-sm">
                      {field.pii && !showPII ? (
                        <span className="select-none font-mono">
                          {maskPII(field.key, field.value)}
                        </span>
                      ) : (
                        <span className="font-mono">{field.value}</span>
                      )}
                    </div>
                    <div className={`text-xs mt-1 ${getConfidenceColor(field.confidence)}`}>
                      {field.confidence}% confidence
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
            
            {/* Show/Hide PII Toggle */}
            {(suggestion.fields || []).some(f => f.pii) && (
              <button
                onClick={() => setShowPII(!showPII)}
                className="text-xs text-white/60 hover:text-white/80 transition-colors"
                data-testid="button-toggle-pii"
              >
                {showPII ? "Hide" : "Show"} sensitive information
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}