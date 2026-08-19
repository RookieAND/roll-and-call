-- Custom SQL migration file, put your code below! --

-- Public bucket for game thumbnails.
INSERT INTO storage.buckets (id, name, public)
VALUES ('game-thumbnails', 'game-thumbnails', true)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Storage RLS: public read, authenticated upload, owner-only update/delete.
CREATE POLICY "game_thumbnails_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'game-thumbnails');
--> statement-breakpoint
CREATE POLICY "game_thumbnails_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'game-thumbnails');
--> statement-breakpoint
CREATE POLICY "game_thumbnails_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'game-thumbnails' AND owner = (SELECT auth.uid()));
--> statement-breakpoint
CREATE POLICY "game_thumbnails_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'game-thumbnails' AND owner = (SELECT auth.uid()));
