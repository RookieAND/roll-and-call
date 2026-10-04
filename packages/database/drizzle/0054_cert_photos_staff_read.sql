-- ===== 손으로 쓴 SQL(drizzle 스키마 밖): 어드민 심사 화면이 운영진 세션으로 인증 증빙 서명 URL을 만든다 =====
-- cert_applications·staff는 RLS로 막혀 있어 정책 안 하위 쿼리로는 행을 못 읽는다. 그래서 SECURITY DEFINER 함수로 확인한다.
-- object_suffix는 저장된 공개 URL 모양 문자열의 끝부분(/storage/v1/object/public/cert-photos/{경로})이다.
-- 플랫폼 관리자가 운영진 행 없이 보는 경우는 이 정책으로 서명하지 못한다.
-- ponytail: 객체마다 그 서버의 신청 행을 훑는다. 신청이 수만 건이 되면 경로 칼럼을 따로 두고 인덱스를 건다.
CREATE OR REPLACE FUNCTION public.can_read_cert_photo(object_suffix text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.cert_applications AS application
    CROSS JOIN LATERAL (
      SELECT photo.value AS url FROM jsonb_each_text(application.photo_urls) AS photo
      UNION ALL SELECT application.purchase_capture_url
      UNION ALL SELECT application.receipt_url
    ) AS file
    WHERE right(file.url, length(object_suffix)) = object_suffix
      AND (
        EXISTS (
          SELECT 1 FROM public.staff
          WHERE staff.server_id = application.server_id AND staff.user_id = (SELECT auth.uid())
        )
        OR EXISTS (
          SELECT 1
          FROM public.servers
          JOIN public.profiles ON profiles.discord_id = servers.owner_discord_id
          WHERE servers.id = application.server_id AND profiles.id = (SELECT auth.uid())
        )
      )
  )
$$;--> statement-breakpoint
REVOKE EXECUTE ON FUNCTION public.can_read_cert_photo(text) FROM PUBLIC, anon;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.can_read_cert_photo(text) TO authenticated;--> statement-breakpoint
DROP POLICY IF EXISTS "cert_photos_read_staff" ON storage.objects;--> statement-breakpoint
CREATE POLICY "cert_photos_read_staff" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'cert-photos'
    AND public.can_read_cert_photo('/storage/v1/object/public/cert-photos/' || name)
  );
-- ===== 손으로 쓴 SQL 끝 =====
