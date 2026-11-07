CREATE TYPE "public"."homebrew_application_status" AS ENUM('pending', 'approved', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."homebrew_rule_scope" AS ENUM('maker_only', 'everyone');--> statement-breakpoint
CREATE TABLE "homebrew_rule_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"server_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"edition" text DEFAULT '' NOT NULL,
	"summary" text NOT NULL,
	"links" text[] DEFAULT '{}' NOT NULL,
	"image_urls" text[] DEFAULT '{}' NOT NULL,
	"status" "homebrew_application_status" DEFAULT 'pending' NOT NULL,
	"previous_id" uuid,
	"processed_by" uuid,
	"processed_at" timestamp with time zone,
	"reject_tag" text,
	"reject_reason" text,
	"rulebook_id" uuid,
	"staff_message_id" text,
	"files_purged_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "homebrew_rule_applications_name_length" CHECK (char_length("homebrew_rule_applications"."name") between 1 and 40),
	CONSTRAINT "homebrew_rule_applications_summary_length" CHECK (char_length("homebrew_rule_applications"."summary") between 1 and 100),
	CONSTRAINT "homebrew_rule_applications_reject_reason_length" CHECK (char_length("homebrew_rule_applications"."reject_reason") <= 200),
	CONSTRAINT "homebrew_rule_applications_links_count" CHECK (cardinality("homebrew_rule_applications"."links") <= 3),
	CONSTRAINT "homebrew_rule_applications_images_count" CHECK (cardinality("homebrew_rule_applications"."image_urls") <= 10),
	CONSTRAINT "homebrew_rule_applications_has_material" CHECK ("homebrew_rule_applications"."files_purged_at" IS NOT NULL OR cardinality("homebrew_rule_applications"."links") + cardinality("homebrew_rule_applications"."image_urls") >= 1)
);
--> statement-breakpoint
ALTER TABLE "homebrew_rule_applications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "homebrew_rules" (
	"rulebook_id" uuid PRIMARY KEY NOT NULL,
	"server_id" uuid NOT NULL,
	"maker_id" uuid,
	"scope" "homebrew_rule_scope" DEFAULT 'maker_only' NOT NULL,
	"summary" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "homebrew_rules_summary_length" CHECK (char_length("homebrew_rules"."summary") <= 100)
);
--> statement-breakpoint
ALTER TABLE "homebrew_rules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "homebrew_rule_applications" ADD CONSTRAINT "homebrew_rule_applications_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homebrew_rule_applications" ADD CONSTRAINT "homebrew_rule_applications_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "homebrew_rule_applications" ADD CONSTRAINT "homebrew_rule_applications_previous_id_homebrew_rule_applications_id_fk" FOREIGN KEY ("previous_id") REFERENCES "public"."homebrew_rule_applications"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homebrew_rule_applications" ADD CONSTRAINT "homebrew_rule_applications_processed_by_profiles_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homebrew_rule_applications" ADD CONSTRAINT "homebrew_rule_applications_rulebook_id_rulebooks_id_fk" FOREIGN KEY ("rulebook_id") REFERENCES "public"."rulebooks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homebrew_rules" ADD CONSTRAINT "homebrew_rules_rulebook_id_rulebooks_id_fk" FOREIGN KEY ("rulebook_id") REFERENCES "public"."rulebooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homebrew_rules" ADD CONSTRAINT "homebrew_rules_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homebrew_rules" ADD CONSTRAINT "homebrew_rules_maker_id_profiles_id_fk" FOREIGN KEY ("maker_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "homebrew_rule_applications_user_id_idx" ON "homebrew_rule_applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "homebrew_rule_applications_server_id_pending_idx" ON "homebrew_rule_applications" USING btree ("server_id","created_at") WHERE status = 'pending';--> statement-breakpoint
CREATE UNIQUE INDEX "homebrew_rule_applications_rulebook_id_unique" ON "homebrew_rule_applications" USING btree ("rulebook_id") WHERE rulebook_id IS NOT NULL;--> statement-breakpoint
CREATE INDEX "homebrew_rules_maker_id_idx" ON "homebrew_rules" USING btree ("maker_id");--> statement-breakpoint
-- ===== 손으로 쓴 SQL(drizzle 스키마 밖): 자작 룰 복사 제외, 이미지 연결 목록, 30일 뒤 이미지 비우기 =====
-- 새 서버가 trpia의 룰북을 복사할 때 자작 룰(homebrew_rules에 행이 있는 책)과 그 카테고리는 가져가지 않는다.
CREATE OR REPLACE FUNCTION public.copy_default_rulebooks(target uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  source uuid := (SELECT id FROM public.servers WHERE slug = 'trpia');
BEGIN
  IF source IS NULL OR source = target THEN
    RETURN;
  END IF;
  CREATE TEMP TABLE IF NOT EXISTS rulebook_copy_map (old_id uuid, new_id uuid) ON COMMIT DROP;
  DELETE FROM pg_temp.rulebook_copy_map;
  INSERT INTO pg_temp.rulebook_copy_map
    SELECT c.id, gen_random_uuid() FROM public.rulebook_categories c
    WHERE c.server_id = source
      AND NOT EXISTS (
        SELECT 1 FROM public.rulebooks r JOIN public.homebrew_rules h ON h.rulebook_id = r.id
        WHERE r.category_id = c.id
      );
  INSERT INTO pg_temp.rulebook_copy_map
    SELECT r.id, gen_random_uuid() FROM public.rulebooks r
    WHERE r.server_id = source
      AND NOT EXISTS (SELECT 1 FROM public.homebrew_rules h WHERE h.rulebook_id = r.id);
  INSERT INTO public.rulebook_categories (id, server_id, name, mini_rule, created_at)
    SELECT m.new_id, target, c.name, c.mini_rule, c.created_at
    FROM public.rulebook_categories c
    JOIN pg_temp.rulebook_copy_map m ON m.old_id = c.id;
  INSERT INTO public.rulebooks
    (id, server_id, category_id, name, edition, kind, supersedes_id, aliases, cert_required, hidden, created_at)
    SELECT m.new_id, target, category.new_id, r.name, r.edition, r.kind, superseded.new_id,
      r.aliases, r.cert_required, r.hidden, r.created_at
    FROM public.rulebooks r
    JOIN pg_temp.rulebook_copy_map m ON m.old_id = r.id
    JOIN pg_temp.rulebook_copy_map category ON category.old_id = r.category_id
    LEFT JOIN pg_temp.rulebook_copy_map superseded ON superseded.old_id = r.supersedes_id;
  INSERT INTO public.cert_sellers (server_id, name, created_at)
    SELECT target, name, created_at FROM public.cert_sellers WHERE server_id = source
    ON CONFLICT DO NOTHING;
  UPDATE public.games g SET rulebook_id = m.new_id
    FROM pg_temp.rulebook_copy_map m WHERE g.server_id = target AND g.rulebook_id = m.old_id;
  UPDATE public.cert_applications a SET rulebook_id = m.new_id
    FROM pg_temp.rulebook_copy_map m WHERE a.server_id = target AND a.rulebook_id = m.old_id;
  UPDATE public.certifications c SET rulebook_id = m.new_id
    FROM pg_temp.rulebook_copy_map m WHERE c.server_id = target AND c.rulebook_id = m.old_id;
  UPDATE public.rulebook_requests q SET category_id = m.new_id
    FROM pg_temp.rulebook_copy_map m WHERE q.server_id = target AND q.category_id = m.old_id;
END;
$$;--> statement-breakpoint
-- 자작 룰 신청 이미지도 cert-photos 버킷에 올라간다. 연결 목록에 넣지 않으면 하루 뒤 지워진다.
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
    UNION ALL SELECT unnest(image_urls) FROM public.homebrew_rule_applications
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
-- 운영진 서명 정책(cert_photos_read_staff)이 자작 룰 신청 이미지도 읽게 한다. 빠지면 어드민 심사 화면이 이미지를 못 연다.
CREATE OR REPLACE FUNCTION public.can_read_cert_photo(object_suffix text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM (
      SELECT application.server_id, file.url
      FROM public.cert_applications AS application
      CROSS JOIN LATERAL (
        SELECT photo.value AS url FROM jsonb_each_text(application.photo_urls) AS photo
        UNION ALL SELECT application.purchase_capture_url
        UNION ALL SELECT application.receipt_url
      ) AS file
      UNION ALL
      SELECT homebrew.server_id, unnest(homebrew.image_urls)
      FROM public.homebrew_rule_applications AS homebrew
    ) AS owned
    WHERE right(owned.url, length(object_suffix)) = object_suffix
      AND (
        EXISTS (
          SELECT 1 FROM public.staff
          WHERE staff.server_id = owned.server_id AND staff.user_id = (SELECT auth.uid())
        )
        OR EXISTS (
          SELECT 1
          FROM public.servers
          JOIN public.profiles ON profiles.discord_id = servers.owner_discord_id
          WHERE servers.id = owned.server_id AND profiles.id = (SELECT auth.uid())
        )
      )
  )
$$;--> statement-breakpoint
-- 반려·거둔 자작 룰 신청은 처리 30일 뒤 이미지 칸을 비운다(매일 04:35 KST). 파일은 다음 정리 때 orphan_storage_objects가 지운다.
-- 재신청이 같은 파일을 이어받았으면 새 행이 아직 가리키므로 파일은 남는다. 승인된 행은 그 룰의 현재 자료라 비우지 않는다.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;--> statement-breakpoint
SELECT cron.schedule(
  'purge-homebrew-files',
  '35 19 * * *',
  $$UPDATE public.homebrew_rule_applications
    SET image_urls = '{}', files_purged_at = now()
    WHERE status IN ('rejected', 'withdrawn')
      AND processed_at < now() - interval '30 days'
      AND files_purged_at IS NULL$$
);
-- ===== 손으로 쓴 SQL 끝 =====
