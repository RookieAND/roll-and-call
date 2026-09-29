-- 어느 행에도 연결되지 않은 업로드 파일(썸네일을 바꾸거나, 올리고 등록하지 않았거나, 게임을 지운 것)을 하루 한 번 지운다.
-- 방금 올리고 아직 저장하지 않은 파일을 지우지 않도록 하루 지난 것만 본다.
-- 업로드 URL을 담는 컬럼을 새로 만들면 아래 urls에도 더한다.
CREATE OR REPLACE FUNCTION public.orphan_storage_objects()
RETURNS TABLE (bucket_id text, name text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  WITH urls AS (
    SELECT thumbnail_url AS url FROM public.games
    UNION ALL SELECT unnest(images) FROM public.games
    UNION ALL SELECT photo.value FROM public.cert_applications, jsonb_each_text(photo_urls) AS photo
    UNION ALL SELECT purchase_capture_url FROM public.cert_applications
    UNION ALL SELECT receipt_url FROM public.cert_applications
    UNION ALL SELECT unnest(photo_urls) FROM public.session_reviews
  ),
  refs AS (
    SELECT split_part(split_part(url, '/storage/v1/object/public/', 2), '?', 1) AS path
    FROM urls WHERE url LIKE '%/storage/v1/object/public/%'
  )
  SELECT object.bucket_id, object.name
  FROM storage.objects AS object
  WHERE object.bucket_id IN ('game-thumbnails', 'cert-photos', 'review-photos')
    AND object.created_at < now() - interval '1 day'
    AND object.bucket_id || '/' || object.name NOT IN (SELECT path FROM refs)
$$;--> statement-breakpoint
REVOKE EXECUTE ON FUNCTION public.orphan_storage_objects() FROM PUBLIC, anon, authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.orphan_storage_objects() TO service_role;--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;--> statement-breakpoint
-- 함수 주소와 anon 키는 git에 두지 않고 Vault(project_url, anon_key)에서 읽는다.
SELECT cron.schedule(
  'purge-orphan-files',
  '0 20 * * *',
  $$SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/purge-orphan-files',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
    )
  )$$
);
