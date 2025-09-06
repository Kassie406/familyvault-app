import { ArrowLeft, Camera, Upload } from "lucide-react";
import { Link } from "wouter";
import QuickPhotoUpload from "@/components/upload/QuickPhotoUpload";

export default function PhotosUpload() {
  return (
    <div className="min-h-screen bg-[var(--bg-900)] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[var(--bg-800)]">
        <div className="px-4 py-4 flex items-center gap-4">
          <Link href="/family">
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-white">Upload Photos</h1>
            <p className="text-sm text-white/70">Add new memories to your family gallery</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid gap-6">
          {/* Upload Instructions */}
          <div className="bg-[var(--bg-800)] border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--gold)] rounded-lg">
                <Camera className="h-5 w-5 text-black" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Upload Your Photos</h2>
                <p className="text-white/70">Share your family memories securely</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-white/70">
              <div className="flex items-start gap-2">
                <Upload className="h-4 w-4 mt-0.5 text-[var(--gold)]" />
                <div>
                  <p className="font-medium text-white">High Quality</p>
                  <p>Upload photos up to 50MB each</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Upload className="h-4 w-4 mt-0.5 text-[var(--gold)]" />
                <div>
                  <p className="font-medium text-white">Auto Organization</p>
                  <p>Photos are automatically sorted by date</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Upload className="h-4 w-4 mt-0.5 text-[var(--gold)]" />
                <div>
                  <p className="font-medium text-white">Secure Storage</p>
                  <p>End-to-end encrypted photo storage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Component */}
          <QuickPhotoUpload 
            familyId="family-1" 
            className="bg-[var(--bg-800)] border border-white/10 rounded-lg" 
          />
        </div>
      </div>
    </div>
  );
}