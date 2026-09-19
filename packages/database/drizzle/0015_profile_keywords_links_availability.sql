-- 성향 · 링크 · 가능 시간대. 옛 default_slots(프리셋 키 3개)는 새 요일별 구간과 옮길 값이 없어 버린다.
ALTER TABLE "profiles" ADD COLUMN "keywords" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "availability" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "links" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN IF EXISTS "default_slots";--> statement-breakpoint

CREATE TABLE "profile_memos" (
  "owner_id" uuid NOT NULL,
  "target_id" uuid NOT NULL,
  "body" text NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "profile_memos_owner_id_target_id_pk" PRIMARY KEY("owner_id","target_id")
);--> statement-breakpoint
ALTER TABLE "profile_memos" ADD CONSTRAINT "profile_memos_owner_id_profiles_id_fk"
  FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "profile_memos" ADD CONSTRAINT "profile_memos_target_id_profiles_id_fk"
  FOREIGN KEY ("target_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint

-- 쓴 사람만 본다. PostgREST로도 남의 메모가 새지 않게 소유자 조건만 건다.
ALTER TABLE "profile_memos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "profile_memos_all_own" ON "public"."profile_memos"
  FOR ALL TO authenticated
  USING (owner_id = (SELECT auth.uid()))
  WITH CHECK (owner_id = (SELECT auth.uid()));
