-- Add photo_url field to employee table
ALTER TABLE employee ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create storage bucket for employee photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('employee-photos', 'employee-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for employee photos
CREATE POLICY "Public Access to Employee Photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'employee-photos');

CREATE POLICY "Authenticated users can upload employee photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'employee-photos');

CREATE POLICY "Authenticated users can update employee photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'employee-photos');

CREATE POLICY "Authenticated users can delete employee photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'employee-photos');
