CREATE TYPE "public"."participant_left_reason" AS ENUM('removed', 'mutual', 'server_left');--> statement-breakpoint
CREATE TYPE "public"."round_schedule_kind" AS ENUM('designated', 'coordinated');--> statement-breakpoint
CREATE TYPE "public"."round_status" AS ENUM('unscheduled', 'coordinating', 'scheduled', 'in_progress', 'finished', 'cancelling');--> statement-breakpoint
CREATE TABLE "game_round_skips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"server_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	"round_no" smallint NOT NULL,
	"original_start_at" timestamp with time zone NOT NULL,
	"original_planned_end_at" timestamp with time zone NOT NULL,
	"skipped_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "game_round_skips" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "game_rounds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"server_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	"round_no" smallint NOT NULL,
	"start_at" timestamp with time zone,
	"planned_end_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"status" "round_status" DEFAULT 'unscheduled' NOT NULL,
	"coordination_start" date,
	"coordination_end" date,
	"coordination_timezone" text,
	"attendance_confirmed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "game_rounds_game_id_round_no_unique" UNIQUE("game_id","round_no"),
	CONSTRAINT "game_rounds_id_game_id_unique" UNIQUE("id","game_id"),
	CONSTRAINT "game_rounds_round_no_positive" CHECK ("game_rounds"."round_no" >= 1),
	CONSTRAINT "game_rounds_time_shape" CHECK (("game_rounds"."start_at" is null and "game_rounds"."planned_end_at" is null) or ("game_rounds"."start_at" is not null and "game_rounds"."planned_end_at" > "game_rounds"."start_at" and "game_rounds"."planned_end_at" - "game_rounds"."start_at" <= interval '24 hours')),
	CONSTRAINT "game_rounds_status_has_time" CHECK (("game_rounds"."status" = 'unscheduled' and "game_rounds"."start_at" is null) or ("game_rounds"."status" = 'coordinating') or ("game_rounds"."status" not in ('unscheduled', 'coordinating') and "game_rounds"."start_at" is not null)),
	CONSTRAINT "game_rounds_ended_after_start" CHECK ("game_rounds"."ended_at" is null or ("game_rounds"."start_at" is not null and "game_rounds"."ended_at" >= "game_rounds"."start_at")),
	CONSTRAINT "game_rounds_coordination_range" CHECK ("game_rounds"."coordination_end" is null or "game_rounds"."coordination_end" >= "game_rounds"."coordination_start")
);
--> statement-breakpoint
ALTER TABLE "game_rounds" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "round_attendances" (
	"server_id" uuid NOT NULL,
	"round_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"attended" boolean DEFAULT true NOT NULL,
	CONSTRAINT "round_attendances_round_id_user_id_pk" PRIMARY KEY("round_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "round_attendances" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "availabilities" ADD COLUMN "round_no" smallint DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_game_id_user_id_slot_start_pk";--> statement-breakpoint
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_game_id_round_no_user_id_slot_start_pk" PRIMARY KEY("game_id","round_no","user_id","slot_start");--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "round_count" smallint DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "round_schedule_kind" "round_schedule_kind" DEFAULT 'designated' NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "repeat_rule" jsonb;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "last_start_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "finished_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "incomplete_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "late_joined" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "left_reason" "participant_left_reason";--> statement-breakpoint
ALTER TABLE "session_reviews" ADD COLUMN "round_id" uuid;--> statement-breakpoint
ALTER TABLE "game_round_skips" ADD CONSTRAINT "game_round_skips_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_round_skips" ADD CONSTRAINT "game_round_skips_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_round_skips" ADD CONSTRAINT "game_round_skips_game_server_fk" FOREIGN KEY ("game_id","server_id") REFERENCES "public"."games"("id","server_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_rounds" ADD CONSTRAINT "game_rounds_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_rounds" ADD CONSTRAINT "game_rounds_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_rounds" ADD CONSTRAINT "game_rounds_game_server_fk" FOREIGN KEY ("game_id","server_id") REFERENCES "public"."games"("id","server_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "round_attendances" ADD CONSTRAINT "round_attendances_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "round_attendances" ADD CONSTRAINT "round_attendances_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "round_attendances" ADD CONSTRAINT "round_attendances_round_game_fk" FOREIGN KEY ("round_id","game_id") REFERENCES "public"."game_rounds"("id","game_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "round_attendances" ADD CONSTRAINT "round_attendances_participant_fk" FOREIGN KEY ("game_id","user_id") REFERENCES "public"."participants"("game_id","user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "round_attendances" ADD CONSTRAINT "round_attendances_game_server_fk" FOREIGN KEY ("game_id","server_id") REFERENCES "public"."games"("id","server_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "game_round_skips_game_id_idx" ON "game_round_skips" USING btree ("game_id");--> statement-breakpoint
CREATE INDEX "game_rounds_server_id_start_at_idx" ON "game_rounds" USING btree ("server_id","start_at") WHERE start_at is not null;--> statement-breakpoint
CREATE INDEX "round_attendances_user_id_idx" ON "round_attendances" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "session_reviews" ADD CONSTRAINT "session_reviews_round_id_game_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."game_rounds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "session_reviews_round_id_author_id_unique" ON "session_reviews" USING btree ("round_id","author_id") WHERE round_id is not null;--> statement-breakpoint
CREATE INDEX "session_reviews_round_id_idx" ON "session_reviews" USING btree ("round_id");--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_round_count_range" CHECK ("games"."round_count" between 1 and 52);