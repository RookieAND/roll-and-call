-- 업적: 사람별 뱃지 저장본과 대표 뱃지·업적 보이기 설정. 뱃지는 기록에서 다시 계산해 채운다(evaluateBadges).
CREATE TABLE "user_badges" (
	"user_id" uuid NOT NULL,
	"badge_key" text NOT NULL,
	"tier" integer NOT NULL,
	"earned_at" timestamp with time zone NOT NULL,
	"source_game_id" uuid,
	"revoked_at" timestamp with time zone,
	"notified_at" timestamp with time zone,
	"seen_at" timestamp with time zone,
	CONSTRAINT "user_badges_user_id_badge_key_pk" PRIMARY KEY("user_id","badge_key"),
	CONSTRAINT "user_badges_tier_positive" CHECK ("user_badges"."tier" >= 1)
);
--> statement-breakpoint
ALTER TABLE "user_badges" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "show_badges" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "featured_badges" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_source_game_id_games_id_fk" FOREIGN KEY ("source_game_id") REFERENCES "public"."games"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_featured_badges_limit" CHECK (cardinality("profiles"."featured_badges") <= 3);