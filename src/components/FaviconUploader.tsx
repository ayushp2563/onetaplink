
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FaviconUploaderProps {
  userId: string;
  currentFaviconUrl: string;
  onFaviconChange: (url: string) => void;
}

export const FaviconUploader = ({ userId, currentFaviconUrl, onFaviconChange }: FaviconUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentFaviconUrl || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    
    // Check file size (max 200KB)
    if (file.size > 200 * 1024) {
      alert("Favicon should be less than 200KB.");
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create a preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}_favicon.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('favicons')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('favicons')
        .getPublicUrl(filePath);
      
      onFaviconChange(publicUrl);
    } catch (error) {
      console.error("Error uploading favicon:", error);
      alert("Failed to upload favicon. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {preview && (
            <div className="relative h-10 w-10 rounded-md border overflow-hidden">
              <img 
                src={preview} 
                alt="Favicon Preview" 
                className="h-full w-full object-cover"
              />
            </div>
          )}
          {!preview && (
            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No icon</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <Input
            type="file"
            accept=".ico,.png,.jpg,.jpeg,.svg"
            onChange={handleFileChange}
            className="hidden"
            id="favicon-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("favicon-upload")?.click()}
            disabled={isUploading}
            className="text-xs sm:text-sm w-full"
          >
            <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            {isUploading ? "Uploading..." : "Upload Custom Favicon"}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Recommended: 32x32 pixels, PNG or ICO format, less than 200KB
      </p>
    </div>
  );
};
