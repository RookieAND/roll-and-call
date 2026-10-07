-- Public bucket for design-system image assets (empty-state illustrations, logos).
-- Uploaded by the maintainer with the service role; no client write policy.
INSERT INTO storage.buckets (id, name, public)
VALUES ('ui-assets', 'ui-assets', true)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
CREATE POLICY "ui_assets_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'ui-assets');
