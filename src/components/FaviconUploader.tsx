
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';

interface FaviconUploaderProps {
  userId: string;
  currentFavicon: string | null;
  onFaviconUpload: (url: string) => void;
}

const FaviconUploader: React.FC<FaviconUploaderProps> = ({ 
  userId, 
  currentFavicon, 
  onFaviconUpload 
}) => {
  const [uploading, setUploading] = useState(false);

  const uploadFavicon = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileSize = file.size / 1024 / 1024; // in MB
      
      // Check file size (limit to 2MB)
      if (fileSize > 2) {
        throw new Error('File size must be less than 2MB');
      }
      
      // Check file type
      const allowedExtensions = ['ico', 'png', 'jpg', 'jpeg', 'svg'];
      if (!allowedExtensions.includes(fileExt?.toLowerCase() || '')) {
        throw new Error('File type not supported. Please upload ico, png, jpg, jpeg or svg file.');
      }
      
      // Create a unique file name
      const fileName = `${userId}_favicon_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('favicons')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('favicons')
        .getPublicUrl(data.path);

      onFaviconUpload(publicUrlData.publicUrl);
      toast.success('Favicon uploaded successfully!');
    } catch (error: any) {
      toast.error(`Error uploading favicon: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        {currentFavicon && (
          <img 
            src={currentFavicon} 
            alt="Current favicon" 
            className="w-8 h-8 object-contain bg-gray-100 border border-gray-200 rounded p-1" 
          />
        )}
        <div className="relative">
          <Button 
            variant="outline" 
            className="relative cursor-pointer"
            disabled={uploading}
            type="button"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Favicon
              </>
            )}
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".ico,.png,.jpg,.jpeg,.svg"
              onChange={uploadFavicon}
              disabled={uploading}
            />
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Recommended: Upload a square image (.ico, .png, .jpg, .svg) that will be used as the favicon 
        for your profile page. Max size: 2MB.
      </p>
    </div>
  );
};

export default FaviconUploader;
