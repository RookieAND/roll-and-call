ALTER TABLE "cert_applications" ADD COLUMN "files_purged_at" timestamp with time zone;--> statement-breakpoint
-- ===== 손으로 쓴 SQL(drizzle 스키마 밖): 인증 사진 비공개 저장소와 결정 30일 뒤 사진 비우기 =====
-- 0054(운영진 서명 정책 cert_photos_read_staff)가 먼저 적용되어 있어야 어드민 심사 화면이 사진을 계속 본다.
UPDATE storage.buckets SET public = false WHERE id = 'cert-photos';--> statement-breakpoint
DROP POLICY IF EXISTS "cert_photos_read" ON storage.objects;--> statement-breakpoint
-- 올린 사람만 자기 파일을 읽고 서명 URL을 만들 수 있다.
-- Storage의 remove는 select와 delete 권한을 함께 요구하므로, 사용자 세션으로 지우는 removeUnusedCertPhotos도 이 정책이 있어야 동작한다.
DROP POLICY IF EXISTS "cert_photos_read_own" ON storage.objects;--> statement-breakpoint
CREATE POLICY "cert_photos_read_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'cert-photos' AND owner = (SELECT auth.uid()));--> statement-breakpoint
-- 승인·반려 뒤 30일이 지난 신청의 사진 칸을 비운다(매일 04:30 KST, 0041의 파일 정리 20:00 UTC보다 먼저).
-- 칸을 비우면 다음 정리 때 orphan_storage_objects가 그 파일을 "연결 안 됨"으로 보고 purge-orphan-files가 지운다.
-- 단, 같은 사람의 뒤 신청이 같은 파일을 이어받아 쓰고 있으면(재신청의 이전 사진) 그 행이 아직 가리키므로 파일은 남는다.
-- direct 행(운영진 인증을 반려로 돌린 기록)은 사진이 없어 건너뛴다.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;--> statement-breakpoint
SELECT cron.schedule(
  'purge-cert-proofs',
  '30 19 * * *',
  $$UPDATE public.cert_applications
    SET photo_urls = '{}'::jsonb, purchase_capture_url = NULL, receipt_url = NULL, files_purged_at = now()
    WHERE status IN ('approved', 'rejected')
      AND processed_at < now() - interval '30 days'
      AND files_purged_at IS NULL
      AND direct = false$$
);
-- ===== 손으로 쓴 SQL 끝 =====
