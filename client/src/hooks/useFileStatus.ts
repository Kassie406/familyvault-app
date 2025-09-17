import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";

export interface FileStatus {
  id: string;
  scanStatus: "pending" | "clean" | "infected" | "error" | "skipped";
  scanResult?: string;
  quarantined: boolean;
  thumbStatus: "pending" | "done" | "error" | "skipped";
  thumbKey?: string;
  thumbWidth?: number;
  thumbHeight?: number;
  processedAt?: string;
  fileName?: string;
  contentType?: string;
  size?: number;
  // convenience flags
  ready: boolean;
  blocked: boolean;
  processing: boolean;
}

export interface FamilyFilesStatus {
  familyId: string;
  files: Array<FileStatus & { type: 'document' | 'photo' }>;
  summary: {
    total: number;
    ready: number;
    processing: number;
    blocked: number;
  };
}

/**
 * Hook for real-time file status updates with WebSocket
 */
export function useFileStatus(fileId: string, type: 'document' | 'photo' = 'document') {
  const [socket, setSocket] = useState<Socket | null>(null);
  const queryClient = useQueryClient();
  const fileIdRef = useRef(fileId);

  // REST API query for initial status
  const { data: status, isLoading, error, refetch } = useQuery<FileStatus>({
    queryKey: ['/api/files', fileId, 'status'],
    queryFn: async () => {
      const response = await fetch(`/api/files/${fileId}/status?type=${type}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch status: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!fileId,
    refetchInterval: (data) => data?.processing ? 5000 : false, // Poll every 5s if processing
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!fileId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;

    const newSocket = io(wsUrl, {
      transports: ['websocket'],
      upgrade: false,
    });

    newSocket.on('connect', () => {
      console.log('[file-status] WebSocket connected');
      newSocket.emit('file:watch', { fileId });
    });

    newSocket.on('file:update', (update: any) => {
      if (update.fileId === fileId) {
        console.log('[file-status] Received update for file:', fileId, update);
        
        // Update the query cache with new data
        queryClient.setQueryData(['/api/files', fileId, 'status'], (oldData: FileStatus | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            ...update,
            // Recalculate convenience flags
            ready: (update.scanStatus || oldData.scanStatus) === "clean" && 
                   ((update.thumbStatus || oldData.thumbStatus) === "done" || 
                    (update.thumbStatus || oldData.thumbStatus) === "skipped"),
            blocked: !!(update.quarantined ?? oldData.quarantined) || 
                     (update.scanStatus || oldData.scanStatus) === "infected",
            processing: (update.scanStatus || oldData.scanStatus) === "pending" || 
                       (update.thumbStatus || oldData.thumbStatus) === "pending",
          };
        });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('[file-status] WebSocket disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('[file-status] WebSocket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('file:unwatch', { fileId });
      newSocket.disconnect();
    };
  }, [fileId, queryClient]);

  // Update watched file if fileId changes
  useEffect(() => {
    if (socket && fileIdRef.current !== fileId) {
      socket.emit('file:unwatch', { fileId: fileIdRef.current });
      socket.emit('file:watch', { fileId });
      fileIdRef.current = fileId;
    }
  }, [fileId, socket]);

  const forceRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    status,
    isLoading,
    error,
    forceRefresh,
    connected: socket?.connected ?? false,
  };
}

/**
 * Hook for real-time family files status
 */
export function useFamilyFilesStatus(familyId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const queryClient = useQueryClient();

  // REST API query for initial status
  const { data: familyStatus, isLoading, error, refetch } = useQuery<FamilyFilesStatus>({
    queryKey: ['/api/files/family', familyId, 'status'],
    queryFn: async () => {
      const response = await fetch(`/api/files/family/${familyId}/status`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch family status: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!familyId,
    refetchInterval: (data) => (data?.summary?.processing || 0) > 0 ? 10000 : false, // Poll every 10s if any processing
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!familyId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;

    const newSocket = io(wsUrl, {
      transports: ['websocket'],
      upgrade: false,
    });

    newSocket.on('connect', () => {
      console.log('[family-status] WebSocket connected');
      newSocket.emit('family:watch', { familyId });
    });

    newSocket.on('file:update', (update: any) => {
      if (update.familyId === familyId) {
        console.log('[family-status] Received update for family file:', update);
        
        // Update the family status cache
        queryClient.setQueryData(['/api/files/family', familyId, 'status'], (oldData: FamilyFilesStatus | undefined) => {
          if (!oldData) return oldData;
          
          const updatedFiles = oldData.files.map(file => {
            if (file.id === update.fileId) {
              const updated = {
                ...file,
                ...update,
                ready: (update.scanStatus || file.scanStatus) === "clean" && 
                       ((update.thumbStatus || file.thumbStatus) === "done" || 
                        (update.thumbStatus || file.thumbStatus) === "skipped"),
                blocked: !!(update.quarantined ?? file.quarantined) || 
                         (update.scanStatus || file.scanStatus) === "infected",
                processing: (update.scanStatus || file.scanStatus) === "pending" || 
                           (update.thumbStatus || file.thumbStatus) === "pending",
              };
              return updated;
            }
            return file;
          });

          // Recalculate summary
          const summary = {
            total: updatedFiles.length,
            ready: updatedFiles.filter(f => f.ready).length,
            processing: updatedFiles.filter(f => f.processing).length,
            blocked: updatedFiles.filter(f => f.blocked).length,
          };

          return {
            ...oldData,
            files: updatedFiles,
            summary,
          };
        });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('[family-status] WebSocket disconnected');
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('family:unwatch', { familyId });
      newSocket.disconnect();
    };
  }, [familyId, queryClient]);

  return {
    familyStatus,
    isLoading,
    error,
    refetch,
    connected: socket?.connected ?? false,
  };
}