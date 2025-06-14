
-- Add a photo_url column to store the image URL for links
-- Since links are stored as JSONB in the profile_settings table, 
-- we don't need to alter the table structure directly.
-- The photo_url will be part of the JSONB object structure.

-- However, we should create a storage bucket for link photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('link-photos', 'link-photos', true);

-- Create RLS policies for the link-photos bucket
CREATE POLICY "Allow authenticated users to upload link photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'link-photos' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow public access to link photos" ON storage.objects
FOR SELECT USING (bucket_id = 'link-photos');

CREATE POLICY "Allow users to update their own link photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'link-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to delete their own link photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'link-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
