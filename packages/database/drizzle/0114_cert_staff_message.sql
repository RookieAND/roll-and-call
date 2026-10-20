ALTER TABLE "cert_applications" ADD COLUMN "staff_message_id" text;--> statement-breakpoint
ALTER TABLE "cert_applications" ADD COLUMN "staff_message_synced_at" timestamp with time zone;