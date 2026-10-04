ALTER TYPE "public"."participant_status" ADD VALUE 'removed';--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "attendance_first_confirmed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "ended_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "capacity_raised_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "waitlisted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "absence_reason" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "absence_added_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "absence_added_by" uuid;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "absence_added_tag" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "absence_added_reason" text;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_absence_added_by_profiles_id_fk" FOREIGN KEY ("absence_added_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_ended_after_start" CHECK ("games"."ended_at" is null or ("games"."confirmed_at" is not null and "games"."ended_at" >= "games"."confirmed_at"));--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_attendance_first_confirmed" CHECK ("games"."attendance_first_confirmed_at" is null or "games"."attendance_confirmed_at" is not null);--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_absence_reason_length" CHECK (char_length("participants"."absence_reason") <= 200);--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_absence_added_tag" CHECK ("participants"."absence_added_tag" is null or "participants"."absence_added_tag" in ('gm_request', 'member_confirmed', 'other'));--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_absence_added_complete" CHECK ("participants"."absence_added_at" is null or "participants"."absence_added_tag" is not null);--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_absence_added_other_reason" CHECK ("participants"."absence_added_tag" is distinct from 'other' or "participants"."absence_added_reason" is not null);--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_absence_added_reason_length" CHECK (char_length("participants"."absence_added_reason") <= 200);--> statement-breakpoint
update games set attendance_first_confirmed_at = attendance_confirmed_at where attendance_confirmed_at is not null;--> statement-breakpoint
update participants p set waitlisted_at = case when p.draw_rank is not null then coalesce(g.drawn_at, p.joined_at) else p.joined_at end from games g where g.id = p.game_id and p.status = 'waiting';
