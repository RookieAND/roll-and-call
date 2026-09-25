CREATE TYPE "public"."cert_format" AS ENUM('physical', 'ebook');--> statement-breakpoint
ALTER TABLE "cert_applications" ADD COLUMN "format" "cert_format" DEFAULT 'physical' NOT NULL;--> statement-breakpoint
ALTER TABLE "cert_applications" ADD COLUMN "seller" text;--> statement-breakpoint
ALTER TABLE "cert_applications" ADD COLUMN "receipt_url" text;