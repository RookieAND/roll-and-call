CREATE TYPE "public"."rulebook_kind" AS ENUM('core', 'supplement', 'handbook');--> statement-breakpoint
CREATE TABLE "rulebook_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rulebook_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "rulebook_categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "rulebooks" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "rulebooks" ADD COLUMN "kind" "rulebook_kind" DEFAULT 'core' NOT NULL;--> statement-breakpoint
ALTER TABLE "rulebooks" ADD COLUMN "supersedes_id" uuid;--> statement-breakpoint
ALTER TABLE "rulebooks" ADD CONSTRAINT "rulebooks_category_id_rulebook_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."rulebook_categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rulebooks" ADD CONSTRAINT "rulebooks_supersedes_id_rulebooks_id_fk" FOREIGN KEY ("supersedes_id") REFERENCES "public"."rulebooks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "rulebooks_category_id_idx" ON "rulebooks" USING btree ("category_id");;--> statement-breakpoint
UPDATE "rulebooks" SET "name" = '크툴루의 부름 수호자 룰북', "aliases" = "aliases" || ARRAY['크툴루의 부름 7판', '크툴루의 부름']
  WHERE "name" = '크툴루의 부름' AND "edition" = '7판';--> statement-breakpoint
UPDATE "rulebooks" SET "name" = '더블크로스 1권', "aliases" = "aliases" || ARRAY['더블크로스 3rd', '더블크로스']
  WHERE "name" = '더블크로스' AND "edition" = '3rd';--> statement-breakpoint
UPDATE "rulebooks" SET "edition" = '3rd' WHERE "name" = '더블크로스 상급' AND "edition" = '';--> statement-breakpoint
UPDATE "rulebooks" SET "aliases" = "aliases" || ARRAY['인세인 1'] WHERE "name" = '인세인' AND "edition" = '';--> statement-breakpoint
INSERT INTO "rulebooks" ("name", "edition", "aliases") VALUES
  ('크툴루의 부름 수호자 룰북', '6판', ARRAY['크툴루의 부름 6판', 'CoC 6판', 'CoC6']),
  ('크툴루의 부름 탐사자 핸드북', '7판', ARRAY['탐사자 핸드북']),
  ('펄프 크툴루', '7판', ARRAY['펄프']),
  ('인세인 3', '', ARRAY[]::text[]),
  ('황혼선서', '', ARRAY[]::text[]),
  ('수집일기', '', ARRAY[]::text[]),
  ('더블크로스 2권', '3rd', ARRAY[]::text[])
ON CONFLICT DO NOTHING;--> statement-breakpoint
CREATE TEMP TABLE "rulebook_category_map" ("category" text, "name" text, "edition" text, "kind" "rulebook_kind") ON COMMIT DROP;--> statement-breakpoint
INSERT INTO "rulebook_category_map" VALUES
  ('크툴루의 부름', '크툴루의 부름 수호자 룰북', '6판', 'core'),
  ('크툴루의 부름', '크툴루의 부름 수호자 룰북', '7판', 'core'),
  ('크툴루의 부름', '크툴루의 부름 탐사자 핸드북', '7판', 'handbook'),
  ('크툴루의 부름', '펄프 크툴루', '7판', 'supplement'),
  ('인세인', '인세인', '', 'core'),
  ('인세인', '인세인 2', '', 'supplement'),
  ('인세인', '인세인 3', '', 'supplement'),
  ('인세인', '빌라디오다티의 모임', '', 'supplement'),
  ('언성듀엣', '언성듀엣', '', 'core'),
  ('언성듀엣', '리프라이즈', '', 'supplement'),
  ('언성듀엣', '엉성듀엣', '', 'supplement'),
  ('여왕을 위하여', '여왕을 위하여', '', 'core'),
  ('여왕을 위하여', '지금 죽이러 갑니다.', '', 'supplement'),
  ('너냐?!', '너냐?!', 'F', 'core'),
  ('너냐?!', '너냐?!', 'V', 'core'),
  ('피아스코', '피아스코', '', 'core'),
  ('피아스코', '피아스코 컴패니언', '', 'supplement'),
  ('피아스코', '죽기 딱 좋은 날', '', 'supplement'),
  ('Quill (퀼)', 'Quill (퀼)', '', 'core'),
  ('Quill (퀼)', '우리가 지구에서 보내는 시간', '', 'supplement'),
  ('거점방어 TRPG 좀비라인', '거점방어 TRPG 좀비라인', '', 'core'),
  ('거점방어 TRPG 좀비라인', '데드왈츠', '', 'supplement'),
  ('둘이서 수사', '둘이서 수사', '구판', 'core'),
  ('둘이서 수사', '둘이서 수사', '신판', 'core'),
  ('마기카로기아', '마기카로기아', '', 'core'),
  ('마기카로기아', '황혼선서', '', 'supplement'),
  ('마기카로기아', '수집일기', '', 'supplement'),
  ('더블크로스', '더블크로스 1권', '3rd', 'core'),
  ('더블크로스', '더블크로스 2권', '3rd', 'core'),
  ('더블크로스', '더블크로스 상급', '3rd', 'supplement'),
  ('D&D', 'D&D', '5판 (2014)', 'core'),
  ('D&D', 'D&D', '2024 개정판', 'core');--> statement-breakpoint
INSERT INTO "rulebook_categories" ("name")
  SELECT DISTINCT "category" FROM "rulebook_category_map"
  UNION SELECT "name" FROM "rulebooks"
ON CONFLICT DO NOTHING;--> statement-breakpoint
UPDATE "rulebooks" r SET "category_id" = c."id", "kind" = m."kind"
  FROM "rulebook_category_map" m JOIN "rulebook_categories" c ON c."name" = m."category"
  WHERE r."name" = m."name" AND r."edition" = m."edition";--> statement-breakpoint
UPDATE "rulebooks" r SET "category_id" = c."id"
  FROM "rulebook_categories" c WHERE r."category_id" IS NULL AND c."name" = r."name";--> statement-breakpoint
DELETE FROM "rulebook_categories" c WHERE NOT EXISTS (SELECT 1 FROM "rulebooks" r WHERE r."category_id" = c."id");--> statement-breakpoint
UPDATE "rulebooks" r SET "supersedes_id" = old."id"
  FROM "rulebooks" old
  WHERE (r."name", r."edition", old."name", old."edition") IN (
    ('크툴루의 부름 수호자 룰북', '7판', '크툴루의 부름 수호자 룰북', '6판'),
    ('둘이서 수사', '신판', '둘이서 수사', '구판')
  );--> statement-breakpoint
ALTER TABLE "rulebooks" ALTER COLUMN "category_id" SET NOT NULL;
