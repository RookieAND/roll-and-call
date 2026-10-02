CREATE TYPE "public"."audit_actor_kind" AS ENUM('staff', 'platform', 'system');--> statement-breakpoint
CREATE TABLE "server_free_rulebooks" (
	"server_id" uuid NOT NULL,
	"rulebook_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "server_free_rulebooks_server_id_rulebook_id_pk" PRIMARY KEY("server_id","rulebook_id")
);
--> statement-breakpoint
ALTER TABLE "server_free_rulebooks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "admin_settings" CASCADE;--> statement-breakpoint
ALTER TABLE "cert_sellers" DROP CONSTRAINT "cert_sellers_name_unique";--> statement-breakpoint
ALTER TABLE "server_members" ADD COLUMN "banned_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "server_members" ADD COLUMN "banned_by" uuid;--> statement-breakpoint
ALTER TABLE "server_members" ADD COLUMN "ban_reason" text;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "announce_channel_id" text;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "owner_discord_id" text;--> statement-breakpoint
ALTER TABLE "cert_sellers" ADD COLUMN "server_id" uuid;--> statement-breakpoint
ALTER TABLE "rulebook_quiz_questions" ADD COLUMN "server_id" uuid;--> statement-breakpoint
-- 지금까지의 퀴즈 문항·판매처는 trpia가 만든 것이다. 판매처는 다른 서버에도 같은 목록을 복사해 둔다.
UPDATE "cert_sellers" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');--> statement-breakpoint
INSERT INTO "cert_sellers" ("server_id", "name", "created_at")
  SELECT "servers"."id", "cert_sellers"."name", "cert_sellers"."created_at"
  FROM "servers" CROSS JOIN "cert_sellers"
  WHERE "servers"."slug" <> 'trpia';--> statement-breakpoint
UPDATE "rulebook_quiz_questions" SET "server_id" = (SELECT "id" FROM "servers" WHERE "slug" = 'trpia');--> statement-breakpoint
ALTER TABLE "cert_sellers" ALTER COLUMN "server_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rulebook_quiz_questions" ALTER COLUMN "server_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "actor_kind" "audit_actor_kind" DEFAULT 'staff' NOT NULL;--> statement-breakpoint
ALTER TABLE "server_free_rulebooks" ADD CONSTRAINT "server_free_rulebooks_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_free_rulebooks" ADD CONSTRAINT "server_free_rulebooks_rulebook_id_rulebooks_id_fk" FOREIGN KEY ("rulebook_id") REFERENCES "public"."rulebooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_members" ADD CONSTRAINT "server_members_banned_by_profiles_id_fk" FOREIGN KEY ("banned_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cert_sellers" ADD CONSTRAINT "cert_sellers_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rulebook_quiz_questions" ADD CONSTRAINT "rulebook_quiz_questions_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cert_sellers_server_id_name_unique" ON "cert_sellers" USING btree ("server_id","name");--> statement-breakpoint
ALTER TABLE "servers" DROP COLUMN "cert_enforcement_date";