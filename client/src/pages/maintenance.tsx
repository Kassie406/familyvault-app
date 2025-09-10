export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900/80 border border-zinc-700 rounded-2xl p-8 text-center backdrop-blur-sm">
        <div className="mb-6">
          <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-[#D4AF37] rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Under Development
          </h1>
          <p className="text-zinc-400">
            We're temporarily working on improvements to provide you with a better experience.
          </p>
        </div>
        
        <div className="space-y-3 text-sm text-zinc-500">
          <p>✨ Enhanced AI document processing</p>
          <p>🔧 System improvements in progress</p>
          <p>🚀 Back online soon</p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-zinc-700">
          <p className="text-xs text-zinc-600">
            Thank you for your patience
          </p>
        </div>
      </div>
    </div>
  );
}