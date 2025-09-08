import React from 'react';
import Together from '@/pages/couple/Together';

interface CoupleMainProps {
  onClose: () => void;
}

export function CoupleMain({ onClose }: CoupleMainProps) {
  return (
    <div className="h-full">
      <Together />
    </div>
  );
}