ALTER TABLE "cert_applications" ADD COLUMN "group_id" uuid;--> statement-breakpoint
ALTER TABLE "cert_applications" ADD COLUMN "purchase_capture_url" text;--> statement-breakpoint
ALTER TABLE "cert_applications" ADD COLUMN "order_number" text;--> statement-breakpoint
ALTER TABLE "cert_applications" ADD COLUMN "order_date" text;--> statement-breakpoint
ALTER TABLE "rulebook_requests" ADD COLUMN "kind" "rulebook_kind";--> statement-breakpoint
ALTER TABLE "rulebook_requests" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "rulebook_requests" ADD COLUMN "category_name" text;--> statement-breakpoint
ALTER TABLE "rulebook_requests" ADD CONSTRAINT "rulebook_requests_category_id_rulebook_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."rulebook_categories"("id") ON DELETE set null ON UPDATE no action;