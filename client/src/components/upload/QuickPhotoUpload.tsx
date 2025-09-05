import { useState } from "react";
import MobileUploadModal from "./MobileUploadModal";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Image, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface QuickPhotoUploadProps {
  familyId?: string;
  albumId?: string;
  onUploadComplete?: (photoId: string) => void;
  className?: string;
  compact?: boolean;
}

export default function QuickPhotoUpload({ 
  familyId = "family-1", 
  albumId,
  onUploadComplete,
  className,
  compact = false
}: QuickPhotoUploadProps) {
  const { uploadFile, progress, uploading, error, reset } = usePresignedUpload();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [location, setLocation] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);

  // Upload photos mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const uploadedPhotos = [];

      for (const file of files) {
        // Step 1: Create photo record
        const createRes = await fetch("/api/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ 
            familyId,
            albumId,
            caption: caption || undefined,
            altText: altText || undefined,
            location: location || undefined,
          }),
        });
        
        if (!createRes.ok) {
          throw new Error(`Failed to create photo record for ${file.name}`);
        }
        
        const photo = await createRes.json();

        // Step 2: Upload file to S3/R2
        const { key, publicUrl } = await uploadFile(file, {
          type: "photo",
          familyId
        });

        // Step 3: Attach file to photo
        const attachRes = await fetch(`/api/photos/${photo.id}/attach`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            storageKey: key,
            fileName: file.name,
            contentType: file.type || "image/jpeg",
            size: file.size,
            publicUrl,
          }),
        });

        if (!attachRes.ok) {
          throw new Error(`Failed to attach file for ${file.name}`);
        }

        uploadedPhotos.push(photo);
      }

      return uploadedPhotos;
    },
    onSuccess: (photos) => {
      const count = photos.length;
      toast({
        title: `${count} photo${count > 1 ? 's' : ''} uploaded successfully`,
        description: `Added to your family album${albumId ? '' : ' (General)'}`,
      });
      
      // Reset form
      handleClear();
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/family/stats"] });
      
      if (photos.length > 0) {
        onUploadComplete?.(photos[0].id);
      }
    },
    onError: (err) => {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Failed to upload photos",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate files are images
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid files",
        description: "Only image files are allowed",
        variant: "destructive",
      });
    }

    setSelectedFiles(validFiles);

    // Generate previews
    const newPreviews: string[] = [];
    validFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      newPreviews.push(url);
    });
    
    // Clean up old previews
    previews.forEach(url => URL.revokeObjectURL(url));
    setPreviews(newPreviews);
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previews];
    
    // Clean up preview URL
    URL.revokeObjectURL(newPreviews[index]);
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    uploadMutation.mutate(selectedFiles);
  };

  const handleClear = () => {
    selectedFiles.forEach((_, index) => {
      URL.revokeObjectURL(previews[index]);
    });
    setSelectedFiles([]);
    setPreviews([]);
    setCaption("");
    setAltText("");
    setLocation("");
    reset();
  };

  const isUploading = uploading || uploadMutation.isPending;
  const showProgress = isUploading && progress > 0;

  if (compact) {
    return (
      <div className={className}>
        <label className="inline-flex items-center gap-2 rounded-xl bg-yellow-600/90 px-4 py-2 text-black hover:bg-yellow-500 cursor-pointer font-medium">
          <Camera className="h-4 w-4" />
          Upload Photos
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </label>
        {isUploading && (
          <div className="mt-2">
            <div className="text-sm text-gray-300 mb-1">Uploading {selectedFiles.length} photo{selectedFiles.length > 1 ? 's' : ''}...</div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`bg-gray-800/50 border-gray-700/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Camera className="h-5 w-5 text-yellow-400" />
          Upload Photos
        </CardTitle>
        <CardDescription className="text-gray-400">
          Add photos to your family album
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {selectedFiles.length === 0 ? (
          <>
            {/* Metadata Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="caption" className="text-gray-300">
                  Caption (optional)
                </Label>
                <Input
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What's happening in this photo?"
                  className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-gray-300">
                  Location (optional)
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where was this taken?"
                  className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* File Selection */}
            <div>
              <Label htmlFor="photo-upload" className="text-gray-300 mb-2 block">
                Select Photos
              </Label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-700/20 hover:bg-gray-700/30 transition-colors">
                <div className="flex flex-col items-center justify-center pt-3 pb-3">
                  <Image className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Click to select</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mb-3">JPEG, PNG, GIF, WebP (MAX. 10MB each)</p>
                  
                  {/* Mobile Upload Button */}
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMobileModalOpen(true);
                    }}
                    className="h-8 px-4 border-gray-500 bg-gray-800/70 hover:bg-gray-700/70 text-white text-sm"
                    disabled={isUploading}
                  >
                    📱 Mobile Upload
                  </Button>
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif"
                />
              </label>
            </div>
          </>
        ) : (
          <>
            {/* Selected Photos View */}
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">
                  {selectedFiles.length} photo{selectedFiles.length > 1 ? 's' : ''} selected
                </h3>
                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>

              {/* Photo Previews Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={previews[index]}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded-lg bg-gray-600"
                    />
                    {!isUploading && (
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                    <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs p-1 rounded truncate">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Metadata Fields */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="final-caption" className="text-gray-300">
                    Caption
                  </Label>
                  <Textarea
                    id="final-caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Describe these photos..."
                    className="bg-gray-600/50 border-gray-500/50 text-white resize-none"
                    rows={2}
                    disabled={isUploading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="final-alt" className="text-gray-300">
                      Alt Text (accessibility)
                    </Label>
                    <Input
                      id="final-alt"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Describe for screen readers"
                      className="bg-gray-600/50 border-gray-500/50 text-white"
                      disabled={isUploading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="final-location" className="text-gray-300">
                      Location
                    </Label>
                    <Input
                      id="final-location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Where were these taken?"
                      className="bg-gray-600/50 border-gray-500/50 text-white"
                      disabled={isUploading}
                    />
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {showProgress && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Uploading photos...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mt-3 p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleClear}
                  variant="outline"
                  disabled={isUploading}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || selectedFiles.length === 0}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-medium"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Upload {selectedFiles.length} Photo{selectedFiles.length > 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      {/* Mobile Upload Modal */}
      <MobileUploadModal
        open={mobileModalOpen}
        onOpenChange={setMobileModalOpen}
        purpose="photos"
        familyId={familyId}
      />
    </Card>
  );
}