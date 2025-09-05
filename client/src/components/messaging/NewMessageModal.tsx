import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Paperclip } from "lucide-react";

/** ---------------------------------------------
 * Types
 * --------------------------------------------- */
export type Member = { id: string; name: string; role?: string; avatarUrl?: string };
export type Thread = { id: string; title?: string; memberIds: string[] };

/** ---------------------------------------------
 * API placeholders (swap with real fetchers)
 * --------------------------------------------- */
async function apiResolveFamilyThread(memberIds: string[]): Promise<Thread> {
  // POST /api/threads { memberIds } -> { id, ... }
  const response = await fetch('/api/threads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberIds })
  });
  return response.json();
}

async function apiUploadFiles(files: File[]): Promise<string[]> {
  // Use existing upload pipeline
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

async function apiSendMessage(threadId: string, body: string, fileIds: string[]) {
  // POST /api/threads/:id/messages { body, fileIds }
  const response = await fetch(`/api/threads/${threadId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body, fileIds })
  });
  return response.json();
}

/** ---------------------------------------------
 * UI bits
 * --------------------------------------------- */
const Backdrop: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div
    onClick={onClose}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
    aria-hidden="true"
  />
);

const ModalCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed z-[1001] left-1/2 top-16 -translate-x-1/2 w-[680px] max-w-[95vw] rounded-2xl border border-white/8 bg-[#0F1115] shadow-2xl">
    {children}
  </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-sm text-white/60">{children}</div>
);

const PrimaryButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }
> = ({ children, loading, className = "", ...rest }) => (
  <button
    {...rest}
    disabled={loading || rest.disabled}
    className={`inline-flex items-center justify-center rounded-xl px-4 h-10 bg-[#D4AF37] text-black font-medium hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    data-testid="button-send-message"
  >
    {loading ? "Sending…" : children}
  </button>
);

const GhostButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = "",
  ...rest
}) => (
  <button
    {...rest}
    className={`inline-flex items-center justify-center rounded-xl px-3 h-10 border border-white/10 text-white/80 hover:bg-white/5 transition ${className}`}
    data-testid="button-close-modal"
  >
    {children}
  </button>
);

const Chip: React.FC<{ selected?: boolean; onClick?: () => void; children: React.ReactNode }> = ({
  selected,
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    className={`px-3 h-8 rounded-full text-sm border ${
      selected ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10" : "border-white/10 text-white/70 hover:bg-white/5"
    } transition`}
    data-testid="chip-member-select"
  >
    {children}
  </button>
);

/** ---------------------------------------------
 * Props
 * --------------------------------------------- */
type Props = {
  open: boolean;
  onClose: () => void;
  /** Family members to choose recipients from */
  members?: Member[];
  /** Optional preselected ids (e.g., "Message Mom") */
  preselectIds?: string[];
  /** On success → navigate to thread */
  onCreated?: (threadId: string) => void;
};

/** ---------------------------------------------
 * Component
 * --------------------------------------------- */
export const NewMessageModal: React.FC<Props> = ({
  open,
  onClose,
  members = [
    { id: "1", name: "Sarah", role: "Mom" },
    { id: "2", name: "Michael", role: "Dad" },
    { id: "3", name: "Emma", role: "Sister" },
    { id: "4", name: "Jake", role: "Brother" }
  ],
  preselectIds = [],
  onCreated,
}) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(preselectIds);
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setBody("");
      setFiles([]);
      setSelected(preselectIds);
      setError(null);
      setSending(false);
    }
  }, [open, preselectIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => m.name.toLowerCase().includes(q));
  }, [query, members]);

  const toggleMember = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
      e.target.value = "";
    }
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const canSend = selected.length > 0 && (body.trim().length > 0 || files.length > 0) && !sending;

  const submit = async () => {
    try {
      setSending(true);
      setError(null);
      // 1) Ensure a thread exists
      const thread = await apiResolveFamilyThread(selected);
      // 2) Upload files (use your upload pipeline)
      const fileIds = await apiUploadFiles(files);
      // 3) Send message
      await apiSendMessage(thread.id, body.trim(), fileIds);
      // 4) Notify caller
      onCreated?.(thread.id);
      onClose();
    } catch (e: any) {
      setError(e?.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <>
      <Backdrop onClose={onClose} />

      <ModalCard>
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
          <div className="text-white text-lg font-semibold">New Message</div>
          <GhostButton onClick={onClose}>
            <X className="h-4 w-4" />
          </GhostButton>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Recipients */}
          <div className="space-y-2">
            <SectionTitle>Recipients</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {selected.length === 0 && (
                <span className="text-white/40 text-sm">Select at least one person…</span>
              )}
              {selected.map((id) => {
                const m = members.find((x) => x.id === id);
                return (
                  <Chip key={id} selected onClick={() => toggleMember(id)}>
                    {m?.name ?? id}
                  </Chip>
                );
              })}
            </div>
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search family (Sarah, Michael, Emma…)"
                className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
                data-testid="input-search-members"
              />
              {query && (
                <div className="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-xl border border-white/10 bg-[#0F1115] shadow-xl">
                  {filtered.length === 0 && (
                    <div className="px-3 py-3 text-white/50 text-sm">No matches</div>
                  )}
                  {filtered.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMember(m.id)}
                      className="px-3 py-2 cursor-pointer hover:bg-white/5 flex items-center gap-3"
                      data-testid={`member-option-${m.id}`}
                    >
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70">
                        {m.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="text-white/90 text-sm">{m.name}</div>
                        {m.role && <div className="text-white/40 text-xs">{m.role}</div>}
                      </div>
                      <div className="text-[#D4AF37] text-xs">
                        {selected.includes(m.id) ? "Remove" : "Add"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <SectionTitle>Message</SectionTitle>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Type your message…"
              className="w-full resize-y min-h-[112px] rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/35 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
              data-testid="textarea-message-body"
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <SectionTitle>Attachments (optional)</SectionTitle>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl px-3 h-10 border border-white/10 text-white/80 hover:bg-white/5 transition">
                <input 
                  type="file" 
                  className="hidden" 
                  multiple 
                  onChange={onPickFiles}
                  data-testid="input-file-upload"
                />
                <Paperclip className="h-4 w-4" />
                <span>Choose files</span>
              </label>
              <div className="text-xs text-white/40">
                Photos, PDFs, docs — same pipeline as Upload Center
              </div>
            </div>
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <div
                    key={`${f.name}-${i}`}
                    className="group flex items-center gap-2 px-2 h-8 rounded-lg border border-white/10 text-xs text-white/80"
                    data-testid={`file-attachment-${i}`}
                  >
                    <span className="max-w-[180px] truncate">{f.name}</span>
                    <button
                      onClick={() => removeFile(i)}
                      className="text-white/40 hover:text-white/80 transition"
                      title="Remove"
                      data-testid={`button-remove-file-${i}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <div className="text-rose-400 text-sm" data-testid="text-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/8 flex items-center justify-end gap-3">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={submit} disabled={!canSend} loading={sending}>
            Send
          </PrimaryButton>
        </div>
      </ModalCard>
    </>,
    document.body
  );
};