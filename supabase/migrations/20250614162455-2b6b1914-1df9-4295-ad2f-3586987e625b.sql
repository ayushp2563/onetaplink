
-- Create storage bucket for link photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('link-photos', 'link-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for link photos bucket
CREATE POLICY "Users can upload link photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'link-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public can view link photos" ON storage.objects
FOR SELECT USING (bucket_id = 'link-photos');

CREATE POLICY "Users can update their own link photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'link-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own link photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'link-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage bucket for profile avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for avatars bucket
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
