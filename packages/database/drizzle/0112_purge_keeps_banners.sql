-- 프로필 배너(server_members.banner_url)도 game-thumbnails 버킷에 올라가는데 연결 목록에 빠져 하루 뒤 지워졌다. 목록에 더한다.
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
    UNION ALL SELECT banner_url FROM public.server_members
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
$$;
