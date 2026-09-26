ALTER TYPE "public"."cert_application_status" ADD VALUE 'withdrawn';--> statement-breakpoint
CREATE TABLE "cert_sellers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cert_sellers_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "cert_sellers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "rulebook_quiz_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rulebook_id" uuid NOT NULL,
	"question" text NOT NULL,
	"answers" text[] DEFAULT '{}' NOT NULL,
	"page" text DEFAULT '' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rulebook_quiz_questions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "cert_applications" ADD COLUMN "quiz_question_id" uuid;--> statement-breakpoint
ALTER TABLE "cert_applications" ADD COLUMN "quiz_answer" text;--> statement-breakpoint
ALTER TABLE "rulebook_quiz_questions" ADD CONSTRAINT "rulebook_quiz_questions_rulebook_id_rulebooks_id_fk" FOREIGN KEY ("rulebook_id") REFERENCES "public"."rulebooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "rulebook_quiz_questions_rulebook_id_idx" ON "rulebook_quiz_questions" USING btree ("rulebook_id");--> statement-breakpoint
ALTER TABLE "cert_applications" ADD CONSTRAINT "cert_applications_quiz_question_id_rulebook_quiz_questions_id_fk" FOREIGN KEY ("quiz_question_id") REFERENCES "public"."rulebook_quiz_questions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
INSERT INTO "cert_sellers" ("name") VALUES ('리디'), ('교보문고'), ('알라딘'), ('예스24'), ('구글 플레이 북'), ('DriveThruRPG') ON CONFLICT DO NOTHING;