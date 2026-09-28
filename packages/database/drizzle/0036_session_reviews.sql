CREATE TYPE "public"."review_report_outcome" AS ENUM('dismissed', 'hidden', 'removed');--> statement-breakpoint
CREATE TABLE "review_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"reporter_id" uuid,
	"category" text NOT NULL,
	"detail" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"outcome" "review_report_outcome",
	"resolved_by" uuid,
	"resolved_at" timestamp with time zone,
	CONSTRAINT "review_reports_category" CHECK ("review_reports"."category" in ('abuse', 'privacy', 'spoiler', 'image', 'unrelated', 'other')),
	CONSTRAINT "review_reports_detail_length" CHECK (char_length("review_reports"."detail") <= 200)
);
--> statement-breakpoint
ALTER TABLE "review_reports" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "session_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"body" text NOT NULL,
	"spoiler" boolean DEFAULT false NOT NULL,
	"photo_urls" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"hidden_at" timestamp with time zone,
	"hidden_by" uuid,
	"hidden_reason" text,
	"removed_at" timestamp with time zone,
	"removed_by" uuid,
	"removed_reason" text,
	CONSTRAINT "session_reviews_body_length" CHECK ("session_reviews"."removed_at" is not null or char_length("session_reviews"."body") between 20 and 2000),
	CONSTRAINT "session_reviews_photo_limit" CHECK (cardinality("session_reviews"."photo_urls") <= 5)
);
--> statement-breakpoint
ALTER TABLE "session_reviews" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "review_reports" ADD CONSTRAINT "review_reports_review_id_session_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."session_reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_reports" ADD CONSTRAINT "review_reports_reporter_id_profiles_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_reports" ADD CONSTRAINT "review_reports_resolved_by_profiles_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_reviews" ADD CONSTRAINT "session_reviews_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_reviews" ADD CONSTRAINT "session_reviews_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "session_reviews" ADD CONSTRAINT "session_reviews_hidden_by_profiles_id_fk" FOREIGN KEY ("hidden_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_reviews" ADD CONSTRAINT "session_reviews_removed_by_profiles_id_fk" FOREIGN KEY ("removed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "review_reports_review_id_idx" ON "review_reports" USING btree ("review_id");--> statement-breakpoint
CREATE UNIQUE INDEX "review_reports_open_reporter_unique" ON "review_reports" USING btree ("review_id","reporter_id") WHERE outcome is null;--> statement-breakpoint
CREATE UNIQUE INDEX "session_reviews_game_id_author_id_unique" ON "session_reviews" USING btree ("game_id","author_id");--> statement-breakpoint
CREATE INDEX "session_reviews_author_id_idx" ON "session_reviews" USING btree ("author_id");--> statement-breakpoint
-- 후기 사진. 인증 사진과 같은 방식이다: 공개 읽기(uuid 경로), 로그인한 사람이 자기 폴더에만 올리고 지운다.
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-photos', 'review-photos', true)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
CREATE POLICY "review_photos_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'review-photos');
--> statement-breakpoint
CREATE POLICY "review_photos_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'review-photos' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);
--> statement-breakpoint
CREATE POLICY "review_photos_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'review-photos' AND owner = (SELECT auth.uid()));
