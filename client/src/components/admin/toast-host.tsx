import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import { X } from 'lucide-react';

type Toast = { 
  id: string; 
  kind: 'error' | 'success' | 'info'; 
  title: string; 
  body?: string;
  timestamp: Date;
};

type ToastContext = { 
  push: (toast: Omit<Toast, 'id' | 'timestamp'>) => void;
  remove: (id: string) => void;
};

const ToastCtx = createContext<ToastContext | null>(null);

export function useToasts() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('ToastHost provider is missing');
  return ctx;
}

interface ToastHostProps {
  children: ReactNode;
}

export default function ToastHost({ children }: ToastHostProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((toast: Omit<Toast, 'id' | 'timestamp'>) => {
    const id = crypto.randomUUID();
    const newToast: Toast = { 
      id, 
      ...toast, 
      timestamp: new Date()
    };
    
    setToasts(prev => [newToast, ...prev.slice(0, 4)]); // Keep max 5 toasts
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const ctx = useMemo<ToastContext>(() => ({ push, remove }), [push, remove]);

  const getToastStyles = (kind: Toast['kind']) => {
    const baseStyles = "border rounded-lg p-4 shadow-lg backdrop-blur-sm transition-all duration-300 ease-out";
    
    switch (kind) {
      case 'error':
        return `${baseStyles} bg-red-50/90 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200`;
      case 'success':
        return `${baseStyles} bg-green-50/90 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-200`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-50/90 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200`;
    }
  };

  const getIconColor = (kind: Toast['kind']) => {
    switch (kind) {
      case 'error':
        return 'bg-red-500';
      case 'success':
        return 'bg-green-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <ToastCtx.Provider value={ctx}>
      {children}
      
      {/* Toast Container */}
      <div 
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
        data-testid="toast-container"
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={getToastStyles(toast.kind)}
            data-testid={`toast-${toast.kind}`}
          >
            <div className="flex items-start gap-3">
              {/* Status Indicator */}
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getIconColor(toast.kind)}`} />
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm" data-testid="toast-title">
                  {toast.title}
                </div>
                {toast.body && (
                  <div className="text-xs opacity-90 mt-1" data-testid="toast-body">
                    {toast.body}
                  </div>
                )}
                <div className="text-xs opacity-60 mt-1">
                  {toast.timestamp.toLocaleTimeString()}
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => remove(toast.id)}
                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex-shrink-0"
                data-testid="toast-close"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}