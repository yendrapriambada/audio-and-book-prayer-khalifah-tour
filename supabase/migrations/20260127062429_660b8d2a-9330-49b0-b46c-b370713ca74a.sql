-- Add policies for admin management (using service role via edge functions)
-- These allow all operations for now - admin access will be controlled at app level

-- Allow all operations on playlists for admin
CREATE POLICY "Admin full access to playlists"
  ON public.playlists FOR ALL
  USING (true)
  WITH CHECK (true);

-- Allow viewing all playlists (including inactive) for admin
CREATE POLICY "Admin can view all playlists"
  ON public.playlists FOR SELECT
  USING (true);

-- Allow all operations on tracks for admin
CREATE POLICY "Admin full access to tracks"
  ON public.tracks FOR ALL
  USING (true)
  WITH CHECK (true);

-- Allow viewing all tracks for admin
CREATE POLICY "Admin can view all tracks"
  ON public.tracks FOR SELECT
  USING (true);

-- Allow all operations on books
CREATE POLICY "Admin full access to books"
  ON public.books FOR ALL
  USING (true)
  WITH CHECK (true);