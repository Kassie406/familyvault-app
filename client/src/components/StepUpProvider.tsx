import React, { createContext, useContext, useState, useCallback } from 'react';
import { StepUpModal } from './StepUpModal';
import { registerStepUpModal } from '@/lib/step-up';

interface StepUpContextType {
  requestStepUp: () => Promise<boolean>;
}

const StepUpContext = createContext<StepUpContextType | null>(null);

export function useStepUp() {
  const context = useContext(StepUpContext);
  if (!context) {
    throw new Error('useStepUp must be used within a StepUpProvider');
  }
  return context;
}

interface StepUpProviderProps {
  children: React.ReactNode;
}

export function StepUpProvider({ children }: StepUpProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState<((success: boolean) => void) | null>(null);

  const requestStepUp = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
      setIsModalOpen(true);
    });
  }, []);

  const handleSuccess = useCallback(() => {
    setIsModalOpen(false);
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  // Register the modal with the step-up helper on mount
  React.useEffect(() => {
    registerStepUpModal({
      open: requestStepUp,
    });
  }, [requestStepUp]);

  const contextValue: StepUpContextType = {
    requestStepUp,
  };

  return (
    <StepUpContext.Provider value={contextValue}>
      {children}
      <StepUpModal
        isOpen={isModalOpen}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </StepUpContext.Provider>
  );
}