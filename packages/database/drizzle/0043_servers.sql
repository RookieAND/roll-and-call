-- 서버(테넌트) 1단계: servers·server_members를 만들고, 서버별 표에 server_id를 넣어 기존 행을 모두 trpia로 채운다.
-- 순서: 표 생성 → trpia 시드 → server_id 추가(nullable) → 백필 → NOT NULL → 키·인덱스·FK 교체. 지우는 데이터는 없다.
CREATE TABLE "server_members" (
	"server_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"bio" text,
	"keywords" text[] DEFAULT '{}' NOT NULL,
	"availability" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"show_gm_badge" boolean DEFAULT true NOT NULL,
	"show_badges" boolean DEFAULT true NOT NULL,
	"featured_badges" text[] DEFAULT '{}' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "server_members_server_id_user_id_pk" PRIMARY KEY("server_id","user_id"),
	CONSTRAINT "server_members_featured_badges_limit" CHECK (cardinality("server_members"."featured_badges") <= 3)
);
--> statement-breakpoint
ALTER TABLE "server_members" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE TABLE "servers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"discord_guild_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"recruit_channel_id" text,
	"closed_channel_id" text,
	"review_forum_channel_id" text,
	"gm_role_id" text,
	"cert_enforcement_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "servers_discord_guild_id_unique" UNIQUE("discord_guild_id"),
	CONSTRAINT "servers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "servers" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
INSERT INTO "servers" ("discord_guild_id", "slug", "name", "recruit_channel_id", "closed_channel_id", "review_forum_channel_id", "cert_enforcement_date")
SELECT '1530087068573896785', 'trpia', 'trpia', '1540025092652666930', '1548962827992170496', '1546184065483542569',
  (SELECT "cert_enforcement_date" FROM "admin_settings" WHERE "id");
--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "server_id" uuid;
--> statement-breakpoint
ALTER TABLE "availabilities" ADD COLUMN "server_id" uuid;
--> statement-breakpoint
ALTER TABLE "cert_applications" ADD COLUMN "server_id" uuid;
--> statement-breakpoint
ALTER TABLE "certifications" ADD COLUMN "server_id" uuid;
--> statement-breakpoint
ALTER TABLE "draw_results" ADD COLUMN "server_id" uuid;
--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "server_id" uuid;
--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "server_id" uuid;
--> statement-breakpoint
ALTER TABLE "profile_memos" ADD COLUMN "server_id" uuid;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "server_id" uuid;
--> statement-breakpoint
ALTER TABLE "review_reports" ADD COLUMN "server_id" uuid;
--> statement-breakpoint
ALTER TABLE "rulebook_requests" ADD COLUMN "server_id" uuid;
--> statement-breakpoint
ALTER TABLE "sanctions" ADD COLUMN "server_id" uuid;
--> statement-breakpoint
ALTER TABLE "session_reviews" ADD COLUMN "server_id" uuid;
--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "server_id" uuid;
--> statement-breakpoint
ALTER TABLE "staff_memos" ADD COLUMN "server_id" uuid;
--> statement-breakpoint
ALTER TABLE "user_badges" ADD COLUMN "server_id" uuid;
--> statement-breakpoint
UPDATE "audit_log" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');
--> statement-breakpoint
UPDATE "availabilities" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');
--> statement-breakpoint
UPDATE "cert_applications" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');
--> statement-breakpoint
UPDATE "certifications" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');
--> statement-breakpoint
UPDATE "draw_results" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');
--> statement-breakpoint
UPDATE "games" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');
--> statement-breakpoint
UPDATE "participants" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');
--> statement-breakpoint
UPDATE "profile_memos" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');
--> statement-breakpoint
UPDATE "reports" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');
--> statement-breakpoint
UPDATE "review_reports" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');
--> statement-breakpoint
UPDATE "rulebook_requests" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');
--> statement-breakpoint
UPDATE "sanctions" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');
--> statement-breakpoint
UPDATE "session_reviews" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');
--> statement-breakpoint
UPDATE "staff" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');
--> statement-breakpoint
UPDATE "staff_memos" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');
--> statement-breakpoint
UPDATE "user_badges" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');
--> statement-breakpoint
INSERT INTO "server_members" ("server_id", "user_id", "bio", "keywords", "availability", "links", "show_gm_badge", "show_badges", "featured_badges", "joined_at")
SELECT (SELECT "id" FROM "servers" WHERE "slug" = 'trpia'), "id", "bio", "keywords", "availability", "links", "show_gm_badge", "show_badges", "featured_badges", "created_at"
FROM "profiles";
--> statement-breakpoint
ALTER TABLE "audit_log" ALTER COLUMN "server_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "availabilities" ALTER COLUMN "server_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "cert_applications" ALTER COLUMN "server_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "certifications" ALTER COLUMN "server_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "draw_results" ALTER COLUMN "server_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "server_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "participants" ALTER COLUMN "server_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "profile_memos" ALTER COLUMN "server_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "server_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "review_reports" ALTER COLUMN "server_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "rulebook_requests" ALTER COLUMN "server_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "sanctions" ALTER COLUMN "server_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "session_reviews" ALTER COLUMN "server_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "staff" ALTER COLUMN "server_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "staff_memos" ALTER COLUMN "server_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "user_badges" ALTER COLUMN "server_id" SET NOT NULL;
--> statement-breakpoint
DROP INDEX "audit_log_created_at_idx";
--> statement-breakpoint
DROP INDEX "cert_applications_pending_idx";
--> statement-breakpoint
DROP INDEX "games_end_date_idx";
--> statement-breakpoint
DROP INDEX "games_confirmed_at_idx";
--> statement-breakpoint
DROP INDEX "sanctions_active_user_unique";
--> statement-breakpoint
ALTER TABLE "certifications" DROP CONSTRAINT "certifications_user_id_rulebook_id_pk";
--> statement-breakpoint
ALTER TABLE "profile_memos" DROP CONSTRAINT "profile_memos_owner_id_target_id_pk";
--> statement-breakpoint
ALTER TABLE "user_badges" DROP CONSTRAINT "user_badges_user_id_badge_key_pk";
--> statement-breakpoint
ALTER TABLE "staff" DROP CONSTRAINT "staff_pkey";
--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_server_id_user_id_rulebook_id_pk" PRIMARY KEY("server_id","user_id","rulebook_id");
--> statement-breakpoint
ALTER TABLE "profile_memos" ADD CONSTRAINT "profile_memos_server_id_owner_id_target_id_pk" PRIMARY KEY("server_id","owner_id","target_id");
--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_server_id_user_id_pk" PRIMARY KEY("server_id","user_id");
--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_server_id_user_id_badge_key_pk" PRIMARY KEY("server_id","user_id","badge_key");
--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_id_server_id_unique" UNIQUE("id","server_id");
--> statement-breakpoint
ALTER TABLE "session_reviews" ADD CONSTRAINT "session_reviews_id_server_id_unique" UNIQUE("id","server_id");
--> statement-breakpoint
ALTER TABLE "server_members" ADD CONSTRAINT "server_members_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "server_members" ADD CONSTRAINT "server_members_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_game_server_fk" FOREIGN KEY ("game_id","server_id") REFERENCES "public"."games"("id","server_id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "cert_applications" ADD CONSTRAINT "cert_applications_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "draw_results" ADD CONSTRAINT "draw_results_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "draw_results" ADD CONSTRAINT "draw_results_game_server_fk" FOREIGN KEY ("game_id","server_id") REFERENCES "public"."games"("id","server_id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_game_server_fk" FOREIGN KEY ("game_id","server_id") REFERENCES "public"."games"("id","server_id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "profile_memos" ADD CONSTRAINT "profile_memos_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_game_server_fk" FOREIGN KEY ("game_id","server_id") REFERENCES "public"."games"("id","server_id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "review_reports" ADD CONSTRAINT "review_reports_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "review_reports" ADD CONSTRAINT "review_reports_review_server_fk" FOREIGN KEY ("review_id","server_id") REFERENCES "public"."session_reviews"("id","server_id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "rulebook_requests" ADD CONSTRAINT "rulebook_requests_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "sanctions" ADD CONSTRAINT "sanctions_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "session_reviews" ADD CONSTRAINT "session_reviews_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "session_reviews" ADD CONSTRAINT "session_reviews_game_server_fk" FOREIGN KEY ("game_id","server_id") REFERENCES "public"."games"("id","server_id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "staff_memos" ADD CONSTRAINT "staff_memos_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "server_members_user_id_idx" ON "server_members" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "audit_log_server_id_created_at_idx" ON "audit_log" USING btree ("server_id","created_at");
--> statement-breakpoint
CREATE INDEX "cert_applications_server_id_pending_idx" ON "cert_applications" USING btree ("server_id","created_at") WHERE status = 'pending';
--> statement-breakpoint
CREATE INDEX "certifications_user_id_idx" ON "certifications" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "games_server_id_end_date_idx" ON "games" USING btree ("server_id","end_date");
--> statement-breakpoint
CREATE INDEX "games_server_id_confirmed_at_idx" ON "games" USING btree ("server_id","confirmed_at") WHERE confirmed_at is not null;
--> statement-breakpoint
CREATE INDEX "profile_memos_owner_id_idx" ON "profile_memos" USING btree ("owner_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "sanctions_active_server_user_unique" ON "sanctions" USING btree ("server_id","user_id") WHERE released_at is null;
--> statement-breakpoint
CREATE INDEX "staff_user_id_idx" ON "staff" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "user_badges_user_id_idx" ON "user_badges" USING btree ("user_id");
--> statement-breakpoint
DROP POLICY IF EXISTS "cert_photos_insert" ON storage.objects;
--> statement-breakpoint
-- 새 업로드는 servers/{server_id}/{uid}/… 경로다. 옮기지 않은 예전 {uid}/… 경로도 그대로 받는다.
CREATE POLICY "cert_photos_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cert-photos' AND (
    (storage.foldername(name))[1] = (SELECT auth.uid())::text
    OR ((storage.foldername(name))[1] = 'servers' AND (storage.foldername(name))[3] = (SELECT auth.uid())::text)
  ));
--> statement-breakpoint
DROP POLICY IF EXISTS "review_photos_insert" ON storage.objects;
--> statement-breakpoint
-- 새 업로드는 servers/{server_id}/{uid}/… 경로다. 옮기지 않은 예전 {uid}/… 경로도 그대로 받는다.
CREATE POLICY "review_photos_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'review-photos' AND (
    (storage.foldername(name))[1] = (SELECT auth.uid())::text
    OR ((storage.foldername(name))[1] = 'servers' AND (storage.foldername(name))[3] = (SELECT auth.uid())::text)
  ));
