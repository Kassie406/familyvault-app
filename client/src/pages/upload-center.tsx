import { EnhancedUploadCenter } from "@/components/upload/enhanced/EnhancedUploadCenter";
import "@/components/upload/enhanced/EnhancedUploadCenter.css";

export default function UploadCenter() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-[#e5e7eb] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#D4AF37]">Upload Center</h1>
          <p className="text-[#9ca3af]">
            Drag & drop files for AI-powered document analysis and automatic organization. 
            Experience the enhanced upload workflow with luxury theming and smooth animations.
          </p>
        </div>

        {/* Enhanced Upload Center Component */}
        <EnhancedUploadCenter />
      </div>
    </div>
  );
}