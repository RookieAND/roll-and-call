ALTER TABLE "games" ADD COLUMN "application_note_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "application_note" text;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_application_note_length" CHECK (char_length("participants"."application_note") <= 500);