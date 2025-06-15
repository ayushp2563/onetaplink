
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";

interface LinkPhotoUploaderProps {
  onPhotoUploaded: (url: string) => void;
  currentPhotoUrl?: string;
  onPhotoRemoved: () => void;
}

export const LinkPhotoUploader = ({ 
  onPhotoUploaded, 
  currentPhotoUrl, 
  onPhotoRemoved 
}: LinkPhotoUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to upload photos");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('link-photos')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error("Failed to upload photo");
        return;
      }

      const { data } = supabase.storage
        .from('link-photos')
        .getPublicUrl(fileName);

      onPhotoUploaded(data.publicUrl);
      toast.success("Photo uploaded successfully");
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!currentPhotoUrl) return;
    
    try {
      // Extract file path from URL
      const url = new URL(currentPhotoUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const folderName = pathParts[pathParts.length - 2];
      const filePath = `${folderName}/${fileName}`;

      const { error } = await supabase.storage
        .from('link-photos')
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        toast.error("Failed to remove photo");
        return;
      }

      onPhotoRemoved();
      toast.success("Photo removed successfully");
    } catch (error) {
      console.error('Error removing photo:', error);
      toast.error("Failed to remove photo");
    }
  };

  const handleUploadClick = () => {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="photo-upload-input">Link Photo (Optional)</Label>
      
      {currentPhotoUrl ? (
        <div className="space-y-2">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
            <img 
              src={currentPhotoUrl} 
              alt="Link photo" 
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 w-6 h-6 p-0"
              onClick={handleRemovePhoto}
              aria-label="Remove"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Input
            type="file"
            id="photo-upload-input"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
          <label htmlFor="photo-upload-input" className="cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
            </div>
          </label>
        </div>
      )}
    </div>
  );
};
