CREATE TYPE "public"."audit_actor_kind" AS ENUM('staff', 'platform', 'system');--> statement-breakpoint
DROP TABLE "admin_settings" CASCADE;--> statement-breakpoint
ALTER TABLE "cert_sellers" DROP CONSTRAINT "cert_sellers_name_unique";--> statement-breakpoint
ALTER TABLE "rulebook_categories" DROP CONSTRAINT "rulebook_categories_name_unique";--> statement-breakpoint
DROP INDEX "rulebooks_name_edition_unique";--> statement-breakpoint
ALTER TABLE "server_members" ADD COLUMN "banned_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "server_members" ADD COLUMN "banned_by" uuid;--> statement-breakpoint
ALTER TABLE "server_members" ADD COLUMN "ban_reason" text;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "announce_channel_id" text;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "owner_discord_id" text;--> statement-breakpoint
ALTER TABLE "cert_sellers" ADD COLUMN "server_id" uuid;--> statement-breakpoint
ALTER TABLE "rulebook_categories" ADD COLUMN "server_id" uuid;--> statement-breakpoint
ALTER TABLE "rulebook_quiz_questions" ADD COLUMN "server_id" uuid;--> statement-breakpoint
ALTER TABLE "rulebooks" ADD COLUMN "server_id" uuid;--> statement-breakpoint
-- 지금까지의 룰북·카테고리·퀴즈 문항·판매처는 trpia가 만든 것이다.
UPDATE "rulebook_categories" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');--> statement-breakpoint
UPDATE "rulebooks" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');--> statement-breakpoint
UPDATE "rulebook_quiz_questions" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');--> statement-breakpoint
UPDATE "cert_sellers" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');--> statement-breakpoint
ALTER TABLE "rulebook_categories" ALTER COLUMN "server_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rulebooks" ALTER COLUMN "server_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rulebook_quiz_questions" ALTER COLUMN "server_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cert_sellers" ALTER COLUMN "server_id" SET NOT NULL;--> statement-breakpoint
-- 룰북 목록은 서버마다 따로 둔다. 새 서버는 trpia의 카테고리·룰북·판매처를 복사해 시작한다(퀴즈는 복사하지 않는다).
-- 이미 그 서버에 있던 구인·인증·신청·추가 요청이 trpia 룰북을 가리키면 복사본으로 옮긴다.
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
    SELECT id, gen_random_uuid() FROM public.rulebook_categories WHERE server_id = source;
  INSERT INTO pg_temp.rulebook_copy_map
    SELECT id, gen_random_uuid() FROM public.rulebooks WHERE server_id = source;
  INSERT INTO public.rulebook_categories (id, server_id, name, created_at)
    SELECT m.new_id, target, c.name, c.created_at
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
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.copy_default_rulebooks_on_server_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  PERFORM public.copy_default_rulebooks(NEW.id);
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER servers_copy_default_rulebooks
  AFTER INSERT ON public.servers
  FOR EACH ROW EXECUTE FUNCTION public.copy_default_rulebooks_on_server_insert();
--> statement-breakpoint
SELECT public.copy_default_rulebooks("id") FROM "servers" WHERE "slug" <> 'trpia';--> statement-breakpoint
-- 서버 추가 트리거만 부르는 함수라 API(PostgREST rpc)로 부르지 못하게 막는다.
REVOKE EXECUTE ON FUNCTION public.copy_default_rulebooks(uuid) FROM public, anon, authenticated;--> statement-breakpoint
REVOKE EXECUTE ON FUNCTION public.copy_default_rulebooks_on_server_insert() FROM public, anon, authenticated;--> statement-breakpoint
-- 구인의 rule 글자는 그 서버의 룰북에만 맞춘다.
DROP FUNCTION public.match_rulebook(text) CASCADE;--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.match_rulebook(rule text, server uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT r.id FROM public.rulebooks r
  JOIN public.rulebook_categories c ON c.id = r.category_id
  WHERE r.server_id = server
    AND (lower(trim(rule)) = lower(trim(r.name || ' ' || r.edition))
      OR lower(trim(rule)) = ANY (SELECT lower(trim(a)) FROM unnest(r.aliases) a)
      OR (r.kind = 'core' AND lower(trim(rule)) = lower(trim(c.name || ' ' || r.edition))))
  ORDER BY
    r.hidden,
    (lower(trim(rule)) = lower(trim(r.name || ' ' || r.edition))
      OR lower(trim(rule)) = ANY (SELECT lower(trim(a)) FROM unnest(r.aliases) a)) DESC,
    r.created_at
  LIMIT 1
$$;
--> statement-breakpoint
REVOKE EXECUTE ON FUNCTION public.match_rulebook(text, uuid) FROM public, anon, authenticated;--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.set_game_rulebook()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.rulebook_id := COALESCE(NEW.rulebook_id, public.match_rulebook(NEW.rule, NEW.server_id));
  ELSIF NEW.rulebook_id IS NOT DISTINCT FROM OLD.rulebook_id THEN
    NEW.rulebook_id := public.match_rulebook(NEW.rule, NEW.server_id);
  END IF;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "actor_kind" "audit_actor_kind" DEFAULT 'staff' NOT NULL;--> statement-breakpoint
ALTER TABLE "server_members" ADD CONSTRAINT "server_members_banned_by_profiles_id_fk" FOREIGN KEY ("banned_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cert_sellers" ADD CONSTRAINT "cert_sellers_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rulebook_categories" ADD CONSTRAINT "rulebook_categories_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rulebook_quiz_questions" ADD CONSTRAINT "rulebook_quiz_questions_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rulebooks" ADD CONSTRAINT "rulebooks_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cert_sellers_server_id_name_unique" ON "cert_sellers" USING btree ("server_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "rulebook_categories_server_id_name_unique" ON "rulebook_categories" USING btree ("server_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "rulebooks_server_id_name_edition_unique" ON "rulebooks" USING btree ("server_id","name","edition");--> statement-breakpoint
ALTER TABLE "servers" DROP COLUMN "cert_enforcement_date";