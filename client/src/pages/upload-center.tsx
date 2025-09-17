import { CleanUploadCenter } from "@/components/upload/enhanced/CleanUploadCenter";

export default function UploadCenter() {
  return (
    <div className="min-h-screen">
      {/* Clean Upload Center with three upload methods: Browse Files, Take Photo, Mobile Upload */}
      <CleanUploadCenter 
        familyId="camacho_family"
        onDocumentProcessed={(documents) => {
          console.log('Documents processed:', documents);
        }}
        onNavigateToProfile={(memberId) => {
          console.log('Navigate to profile:', memberId);
        }}
      />
    </div>
  );
}