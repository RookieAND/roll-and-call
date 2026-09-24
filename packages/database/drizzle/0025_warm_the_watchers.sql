CREATE TYPE "public"."cert_application_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."rulebook_request_outcome" AS ENUM('added', 'linked', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."staff_role" AS ENUM('owner', 'staff');--> statement-breakpoint
CREATE TABLE "admin_settings" (
	"id" boolean PRIMARY KEY DEFAULT true NOT NULL,
	"cert_enforcement_date" timestamp with time zone,
	CONSTRAINT "admin_settings_single_row" CHECK ("admin_settings"."id")
);
--> statement-breakpoint
ALTER TABLE "admin_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" text NOT NULL,
	"target" text NOT NULL,
	"target_user_id" uuid,
	"target_game_id" uuid,
	"reason" text DEFAULT '' NOT NULL,
	"reason_tag" text,
	"staff_memo" text,
	"before" jsonb,
	"after" jsonb,
	"related" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_log" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "cert_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"rulebook_id" uuid NOT NULL,
	"memo" text DEFAULT '' NOT NULL,
	"photo_urls" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"replaced_shots" text[] DEFAULT '{}' NOT NULL,
	"status" "cert_application_status" DEFAULT 'pending' NOT NULL,
	"reject_tag" text,
	"reject_reason" text,
	"flagged_shots" text[] DEFAULT '{}' NOT NULL,
	"processed_by" uuid,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cert_applications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "certifications" (
	"user_id" uuid NOT NULL,
	"rulebook_id" uuid NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "certifications_user_id_rulebook_id_pk" PRIMARY KEY("user_id","rulebook_id")
);
--> statement-breakpoint
ALTER TABLE "certifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"reporter_id" uuid,
	"category" text NOT NULL,
	"detail" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_by" uuid,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "reports" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "rulebook_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"outcome" "rulebook_request_outcome",
	"processed_by" uuid,
	"processed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "rulebook_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "rulebooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"edition" text DEFAULT '' NOT NULL,
	"aliases" text[] DEFAULT '{}' NOT NULL,
	"cert_required" boolean DEFAULT true NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rulebooks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sanctions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"reason" text NOT NULL,
	"until" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"released_by" uuid,
	"released_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "sanctions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "staff" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"role" "staff_role" DEFAULT 'staff' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "staff" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "staff_memos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"author_id" uuid,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "staff_memos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "rulebook_id" uuid;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "hidden_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "hidden_by" uuid;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "hidden_reason" text;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "edit_requested_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "absence_cancelled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "absence_cancelled_by" uuid;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "absence_cancel_reason" text;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_profiles_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_target_user_id_profiles_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_target_game_id_games_id_fk" FOREIGN KEY ("target_game_id") REFERENCES "public"."games"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cert_applications" ADD CONSTRAINT "cert_applications_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cert_applications" ADD CONSTRAINT "cert_applications_rulebook_id_rulebooks_id_fk" FOREIGN KEY ("rulebook_id") REFERENCES "public"."rulebooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cert_applications" ADD CONSTRAINT "cert_applications_processed_by_profiles_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_rulebook_id_rulebooks_id_fk" FOREIGN KEY ("rulebook_id") REFERENCES "public"."rulebooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_approved_by_profiles_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_profiles_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_resolved_by_profiles_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rulebook_requests" ADD CONSTRAINT "rulebook_requests_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "rulebook_requests" ADD CONSTRAINT "rulebook_requests_processed_by_profiles_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sanctions" ADD CONSTRAINT "sanctions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "sanctions" ADD CONSTRAINT "sanctions_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sanctions" ADD CONSTRAINT "sanctions_released_by_profiles_id_fk" FOREIGN KEY ("released_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "staff_memos" ADD CONSTRAINT "staff_memos_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "staff_memos" ADD CONSTRAINT "staff_memos_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_log_target_game_id_idx" ON "audit_log" USING btree ("target_game_id");--> statement-breakpoint
CREATE INDEX "cert_applications_user_id_idx" ON "cert_applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cert_applications_rulebook_id_idx" ON "cert_applications" USING btree ("rulebook_id");--> statement-breakpoint
CREATE INDEX "cert_applications_pending_idx" ON "cert_applications" USING btree ("created_at") WHERE status = 'pending';--> statement-breakpoint
CREATE INDEX "certifications_rulebook_id_idx" ON "certifications" USING btree ("rulebook_id");--> statement-breakpoint
CREATE INDEX "reports_game_id_idx" ON "reports" USING btree ("game_id");--> statement-breakpoint
CREATE INDEX "rulebook_requests_user_id_idx" ON "rulebook_requests" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "rulebooks_name_edition_unique" ON "rulebooks" USING btree ("name","edition");--> statement-breakpoint
CREATE UNIQUE INDEX "sanctions_active_user_unique" ON "sanctions" USING btree ("user_id") WHERE released_at is null;--> statement-breakpoint
CREATE INDEX "staff_memos_user_id_idx" ON "staff_memos" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_rulebook_id_rulebooks_id_fk" FOREIGN KEY ("rulebook_id") REFERENCES "public"."rulebooks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_hidden_by_profiles_id_fk" FOREIGN KEY ("hidden_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_absence_cancelled_by_profiles_id_fk" FOREIGN KEY ("absence_cancelled_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "games_rulebook_id_idx" ON "games" USING btree ("rulebook_id");--> statement-breakpoint
-- 지금까지 구인에 적힌 룰 글자를 룰북으로 묶는다. 인증 정책은 안전한 쪽(인증 필요)으로 시작하고 어드민에서 고친다.
INSERT INTO "rulebooks" ("name", "edition", "aliases") VALUES
  ('크툴루의 부름', '7판', ARRAY['CoC 7th', 'CoC7', 'CoC 7판', 'CoC', 'COC 7판']),
  ('인세인', '', ARRAY['INSANE']),
  ('피아스코', '', ARRAY['Fiasco']),
  ('더블크로스', '', ARRAY['DX3', 'DX']),
  ('마기카로기아', '', ARRAY['마기로기', 'MGLG']),
  ('머더미스터리', '', ARRAY['머미']),
  ('D&D', '5판', ARRAY['dnd', 'D&D 5판', 'D&D5e', '5e']),
  ('여왕을 위하여', '', ARRAY['For the Queen']),
  ('좀비라인', '', ARRAY[]::text[]),
  ('너냐?! F룰', '', ARRAY[]::text[]),
  ('퀼', '', ARRAY['퀼 (Quill)', 'Quill'])
ON CONFLICT DO NOTHING;
--> statement-breakpoint
-- 대소문자·앞뒤 공백을 무시하고 "이름 판본" 또는 다른 이름과 같으면 그 룰북이다. 숨긴 룰북도 맞춘다.
CREATE OR REPLACE FUNCTION public.match_rulebook(rule text)
RETURNS uuid
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT r.id FROM public.rulebooks r
  WHERE lower(trim(rule)) = lower(trim(r.name || ' ' || r.edition))
     OR lower(trim(rule)) = ANY (SELECT lower(trim(a)) FROM unnest(r.aliases) a)
  ORDER BY r.hidden, r.created_at
  LIMIT 1
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.set_game_rulebook()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.rulebook_id := public.match_rulebook(NEW.rule);
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER games_set_rulebook
  BEFORE INSERT OR UPDATE OF rule ON public.games
  FOR EACH ROW EXECUTE FUNCTION public.set_game_rulebook();
--> statement-breakpoint
REVOKE EXECUTE ON FUNCTION public.set_game_rulebook() FROM public, anon, authenticated;
--> statement-breakpoint
UPDATE "games" SET "rulebook_id" = public.match_rulebook("rule");
--> statement-breakpoint
INSERT INTO "admin_settings" ("id") VALUES (true) ON CONFLICT DO NOTHING;
