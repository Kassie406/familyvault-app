import React from 'react';
import { useLocation } from 'wouter';
import { Key } from 'lucide-react';

// Card Shell Component
function Shell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#232530] bg-gradient-to-b from-[#161616] to-[#0F0F0F]
                     shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition-all
                     hover:border-[#D4AF37] hover:shadow-[0_16px_40px_rgba(212,175,55,0.12)] ${className}`}>
      {children}
    </div>
  );
}

// Manager data
type Manager = { 
  id: "angel" | "kassandra"; 
  name: string; 
  prepopulatedCount: number; 
};

const MANAGERS: Manager[] = [
  { id: "angel", name: "Angel's Password Manager", prepopulatedCount: 5 },
  { id: "kassandra", name: "Kassandra's Password Manager", prepopulatedCount: 4 },
];

export default function FamilyPasswords() {
  // Clean version without undefined components
  const [, setLocation] = useLocation();

  const navigateToManager = (managerId: string) => {
    setLocation(`/family/passwords/manager/${managerId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Passwords</h1>
          <p className="text-sm text-neutral-400">Select a manager to view their vault.</p>
        </div>
      </div>

      {/* Manager Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MANAGERS.map((manager) => (
          <button
            key={manager.id}
            onClick={() => navigateToManager(manager.id)}
            className="text-left w-full focus:outline-none focus-visible:outline-none focus:ring-0 hover:bg-transparent"
            data-testid={`button-manager-${manager.id}`}
          >
            <Shell className="p-5 hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl grid place-items-center bg-[#D4AF37]/15 text-[#D4AF37] border border-[#232530]">
                  <Key className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-white font-medium truncate">{manager.name}</div>
                  <div className="text-xs text-neutral-400">+ {manager.prepopulatedCount} items pre-populated</div>
                </div>
              </div>
            </Shell>
          </button>
        ))}
      </div>
    </div>
  );
}