import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { CoupleGate } from '@/components/couple/CoupleGate';
import { CoupleMain } from '@/components/couple/CoupleMain';

interface CouplesConnectionModalProps {
  open: boolean;
  onClose: () => void;
}

export function CouplesConnectionModal({ open, onClose }: CouplesConnectionModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on modal open
  useEffect(() => {
    if (open) {
      const authStatus = sessionStorage.getItem('coupleAuthenticated');
      setIsAuthenticated(authStatus === 'true');
    }
  }, [open]);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handleClose = () => {
    // Clear authentication when modal closes
    sessionStorage.removeItem('coupleAuthenticated');
    setIsAuthenticated(false);
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 bg-neutral-900 border-none">
        {!isAuthenticated ? (
          <CoupleGate 
            onAuthenticated={handleAuthenticated}
            onCancel={handleClose}
          />
        ) : (
          <CoupleMain onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}