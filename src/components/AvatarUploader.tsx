
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

interface AvatarUploaderProps {
  currentAvatarUrl?: string;
  onAvatarUploaded: (url: string) => void;
  onAvatarRemoved: () => void;
  fallbackText: string;
}

export const AvatarUploader = ({ 
  currentAvatarUrl, 
  onAvatarUploaded, 
  onAvatarRemoved,
  fallbackText 
}: AvatarUploaderProps) => {
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
      const fileName = `${session.user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error("Failed to upload avatar");
        return;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      onAvatarUploaded(data.publicUrl);
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!currentAvatarUrl) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const fileName = `${session.user.id}/avatar.jpg`;

      const { error } = await supabase.storage
        .from('avatars')
        .remove([fileName]);

      if (error) {
        console.error('Delete error:', error);
      }

      onAvatarRemoved();
      toast.success("Avatar removed successfully");
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error("Failed to remove avatar");
    }
  };

  return (
    <div className="space-y-4">
      <Label>Profile Picture</Label>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage src={currentAvatarUrl} alt="Profile" />
            <AvatarFallback className="text-xl">{fallbackText}</AvatarFallback>
          </Avatar>
          {currentAvatarUrl && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
              onClick={handleRemoveAvatar}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id="avatar-upload"
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => document.getElementById('avatar-upload')?.click()}
            className="w-full"
          >
            {isUploading ? (
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {currentAvatarUrl ? 'Change Avatar' : 'Upload Avatar'}
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG up to 5MB
          </p>
        </div>
      </div>
    </div>
  );
};
