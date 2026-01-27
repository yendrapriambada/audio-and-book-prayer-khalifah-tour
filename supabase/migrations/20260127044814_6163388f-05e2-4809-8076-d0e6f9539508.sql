-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('audio', 'audio', true, 52428800, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']);

-- Create storage bucket for book files (PDFs)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('books', 'books', true, 157286400, ARRAY['application/pdf']);

-- RLS policies for audio bucket - allow public read
CREATE POLICY "Public read access for audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio');

-- RLS policies for audio bucket - allow public insert (for admin upload)
CREATE POLICY "Allow public upload for audio"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'audio');

-- RLS policies for audio bucket - allow public update
CREATE POLICY "Allow public update for audio"
ON storage.objects FOR UPDATE
USING (bucket_id = 'audio');

-- RLS policies for audio bucket - allow public delete
CREATE POLICY "Allow public delete for audio"
ON storage.objects FOR DELETE
USING (bucket_id = 'audio');

-- RLS policies for books bucket - allow public read
CREATE POLICY "Public read access for books"
ON storage.objects FOR SELECT
USING (bucket_id = 'books');

-- RLS policies for books bucket - allow public insert
CREATE POLICY "Allow public upload for books"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'books');

-- RLS policies for books bucket - allow public update
CREATE POLICY "Allow public update for books"
ON storage.objects FOR UPDATE
USING (bucket_id = 'books');

-- RLS policies for books bucket - allow public delete
CREATE POLICY "Allow public delete for books"
ON storage.objects FOR DELETE
USING (bucket_id = 'books');