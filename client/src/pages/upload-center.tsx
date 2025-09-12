import { DualUploadCenter } from "@/components/upload/DualUploadCenter";
import "@/components/upload/DualUploadCenter.css";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function UploadCenter() {
  const [, setLocation] = useLocation();

  // Handle document upload to Enhanced LEFT Sidebar workflow
  const handleDocumentUpload = async (files: File[]) => {
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        
        // Use fetch directly for FormData uploads to avoid content-type issues
        const response = await fetch('/api/uploads/enhanced', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Document upload failed: ${errorText}`);
        }
        
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Document upload failed');
        }
      }
    } catch (error) {
      console.error('Document upload error:', error);
      throw error;
    }
  };

  // Handle photo upload to Family Album
  const handlePhotoUpload = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('photos', file));
      
      // Use fetch directly for FormData uploads to avoid content-type issues
      const response = await fetch('/api/uploads/photos', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Photo upload failed: ${errorText}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Photo upload failed');
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      throw error;
    }
  };

  // Navigate to Family Album
  const handleNavigateToAlbum = () => {
    setLocation('/photos-albums'); // Navigate to Family Album page
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#e5e7eb]">
      {/* Dual Upload Center Component - matches user's layout specification exactly */}
      <DualUploadCenter 
        onDocumentUpload={handleDocumentUpload}
        onPhotoUpload={handlePhotoUpload}
        onNavigateToAlbum={handleNavigateToAlbum}
      />
    </div>
  );
}