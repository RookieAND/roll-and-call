ALTER TABLE "certifications" ADD COLUMN "revoked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "certifications" ADD COLUMN "revoked_by" uuid;--> statement-breakpoint
ALTER TABLE "certifications" ADD COLUMN "revoke_reason" text;--> statement-breakpoint
ALTER TABLE "rulebook_requests" ADD COLUMN "edition" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "rulebook_requests" ADD COLUMN "publisher" text;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_revoked_by_profiles_id_fk" FOREIGN KEY ("revoked_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
-- 구인 등록이 룰북을 직접 고르므로 트리거는 비어 있을 때만 채운다. rule 글자만 바뀐 수정은 예전처럼 다시 맞춘다.
CREATE OR REPLACE FUNCTION public.set_game_rulebook()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.rulebook_id := COALESCE(NEW.rulebook_id, public.match_rulebook(NEW.rule));
  ELSIF NEW.rulebook_id IS NOT DISTINCT FROM OLD.rulebook_id THEN
    NEW.rulebook_id := public.match_rulebook(NEW.rule);
  END IF;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
-- 인증 사진. 썸네일과 같은 방식이다: 공개 읽기(uuid 경로), 로그인한 사람이 자기 폴더에만 올리고 지운다.
INSERT INTO storage.buckets (id, name, public)
VALUES ('cert-photos', 'cert-photos', true)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
CREATE POLICY "cert_photos_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'cert-photos');
--> statement-breakpoint
CREATE POLICY "cert_photos_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cert-photos' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);
--> statement-breakpoint
CREATE POLICY "cert_photos_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'cert-photos' AND owner = (SELECT auth.uid()));
