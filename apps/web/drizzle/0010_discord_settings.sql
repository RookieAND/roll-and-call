ALTER TABLE "games" ADD COLUMN "discord_channel_id" text;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "discord_rooms_disabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "discord_auto_open" boolean DEFAULT false NOT NULL;
