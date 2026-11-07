-- 0001에서 만든 옛 정책을 지운다. 앱은 DATABASE_URL과 service role로만 표를 읽고 써서 쓰는 곳이 없고,
-- 남아 있으면 로그인한 누구나 anon 키로 다른 서버의 구인·참여자(신청 메모·불참 사유 포함)를 읽고 참여 행을 직접 넣을 수 있다.
-- RLS는 켠 채 정책만 없애 다른 표처럼 service role 밖에서는 아무것도 못 하게 한다.
DROP POLICY IF EXISTS "games_select_authenticated" ON "games";--> statement-breakpoint
DROP POLICY IF EXISTS "games_insert_own" ON "games";--> statement-breakpoint
DROP POLICY IF EXISTS "games_update_own" ON "games";--> statement-breakpoint
DROP POLICY IF EXISTS "games_delete_own" ON "games";--> statement-breakpoint
DROP POLICY IF EXISTS "participants_select_authenticated" ON "participants";--> statement-breakpoint
DROP POLICY IF EXISTS "participants_insert_self" ON "participants";--> statement-breakpoint
DROP POLICY IF EXISTS "participants_delete_self" ON "participants";--> statement-breakpoint
DROP POLICY IF EXISTS "availabilities_select_authenticated" ON "availabilities";--> statement-breakpoint
DROP POLICY IF EXISTS "availabilities_insert_self" ON "availabilities";--> statement-breakpoint
DROP POLICY IF EXISTS "availabilities_delete_self" ON "availabilities";--> statement-breakpoint
DROP POLICY IF EXISTS "profiles_select_authenticated" ON "profiles";--> statement-breakpoint
DROP POLICY IF EXISTS "profile_memos_all_own" ON "profile_memos";--> statement-breakpoint
-- 아래 ENABLE은 이미 켜져 있던 것을 schema에 맞춰 적은 것이라 바뀌는 것이 없다.
-- 사람을 미리 만들어 둔 프로필이 가입하면 handle_new_user가 profiles.id를 바꾼다. *_by 같은 FK도 따라 바뀌도록 ON UPDATE CASCADE로 다시 만든다.
ALTER TABLE "profile_memos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "availabilities" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "games" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "participants" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "server_members" DROP CONSTRAINT "server_members_banned_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "server_message_heads" DROP CONSTRAINT "server_message_heads_updated_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "server_message_texts" DROP CONSTRAINT "server_message_texts_updated_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "games" DROP CONSTRAINT "games_hidden_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "games" DROP CONSTRAINT "games_cancelled_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "participants" DROP CONSTRAINT "participants_absence_cancelled_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "participants" DROP CONSTRAINT "participants_absence_added_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "session_reviews" DROP CONSTRAINT "session_reviews_hidden_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "session_reviews" DROP CONSTRAINT "session_reviews_removed_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "rulebook_requests" DROP CONSTRAINT "rulebook_requests_processed_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "cert_applications" DROP CONSTRAINT "cert_applications_processed_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "certifications" DROP CONSTRAINT "certifications_approved_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "certifications" DROP CONSTRAINT "certifications_revoked_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "homebrew_rule_applications" DROP CONSTRAINT "homebrew_rule_applications_processed_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "audit_log" DROP CONSTRAINT "audit_log_actor_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "audit_log" DROP CONSTRAINT "audit_log_target_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "reports" DROP CONSTRAINT "reports_reporter_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "reports" DROP CONSTRAINT "reports_resolved_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "sanctions" DROP CONSTRAINT "sanctions_created_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "sanctions" DROP CONSTRAINT "sanctions_released_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "staff_memos" DROP CONSTRAINT "staff_memos_author_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "server_members" ADD CONSTRAINT "server_members_banned_by_profiles_id_fk" FOREIGN KEY ("banned_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "server_message_heads" ADD CONSTRAINT "server_message_heads_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "server_message_texts" ADD CONSTRAINT "server_message_texts_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_hidden_by_profiles_id_fk" FOREIGN KEY ("hidden_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_cancelled_by_profiles_id_fk" FOREIGN KEY ("cancelled_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_absence_cancelled_by_profiles_id_fk" FOREIGN KEY ("absence_cancelled_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_absence_added_by_profiles_id_fk" FOREIGN KEY ("absence_added_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "session_reviews" ADD CONSTRAINT "session_reviews_hidden_by_profiles_id_fk" FOREIGN KEY ("hidden_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "session_reviews" ADD CONSTRAINT "session_reviews_removed_by_profiles_id_fk" FOREIGN KEY ("removed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "rulebook_requests" ADD CONSTRAINT "rulebook_requests_processed_by_profiles_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cert_applications" ADD CONSTRAINT "cert_applications_processed_by_profiles_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_approved_by_profiles_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_revoked_by_profiles_id_fk" FOREIGN KEY ("revoked_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "homebrew_rule_applications" ADD CONSTRAINT "homebrew_rule_applications_processed_by_profiles_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_profiles_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_target_user_id_profiles_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_profiles_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_resolved_by_profiles_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "sanctions" ADD CONSTRAINT "sanctions_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "sanctions" ADD CONSTRAINT "sanctions_released_by_profiles_id_fk" FOREIGN KEY ("released_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "staff_memos" ADD CONSTRAINT "staff_memos_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "cert_applications_pending_unique" ON "cert_applications" USING btree ("server_id","user_id","rulebook_id") WHERE status = 'pending';