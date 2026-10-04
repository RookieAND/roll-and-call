ALTER TABLE "cert_applications" ADD COLUMN "discarded_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "certifications" ADD COLUMN "discarded_at" timestamp with time zone;