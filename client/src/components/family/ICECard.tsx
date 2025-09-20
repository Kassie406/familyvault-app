import { useState } from 'react';
import { ShieldAlert, Download, Edit2, Save, X } from 'lucide-react';
import { ICESection } from './ICESection';
import { Button } from '@/components/ui/button';

export function ICECard() {
  const [isEditing, setIsEditing] = useState(false);

  const handleDownloadPDF = () => {
    window.open('/api/ice/print', '_blank');
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-600/10">
            <ShieldAlert className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-gray-200 font-semibold text-lg">In Case of Emergency (ICE)</h3>
            <p className="text-xs text-gray-500">Critical family information for emergencies</p>
          </div>
        </div>
        
      </div>

      {/* ICE Content */}
      <div className="ice-content">
        <ICESection />
      </div>

      {/* Footer note */}
      <div className="mt-4 pt-4 border-t border-zinc-800">
        <p className="text-xs text-gray-500 text-center">
          Keep this information current and accessible for emergency responders
        </p>
      </div>
    </div>
  );
}
