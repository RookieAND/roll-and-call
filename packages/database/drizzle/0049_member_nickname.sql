-- C01: 닉네임을 계정(profiles.username)에서 서버 멤버십(server_members.nickname)으로 옮긴다.
-- 서버마다 활동 중인 멤버를 가입 순으로 돌며 계정 닉네임을 복사하고, 앞사람과 겹치면(대소문자 무시) 숫자를 붙인다.
-- 나간 멤버는 겹쳐도 그대로 복사한다. 다시 가입할 때 겹치면 그때 숫자를 붙인다.
ALTER TABLE "server_members" ADD COLUMN "nickname" text;--> statement-breakpoint
ALTER TABLE "server_members" ADD COLUMN "nickname_suffix_base" text;--> statement-breakpoint
DO $$
DECLARE
  member record;
  current_server uuid;
  taken text[] := '{}';
  base text;
  candidate text;
  n int;
BEGIN
  FOR member IN
    SELECT sm.server_id, sm.user_id, sm.deleted_at, p.username
    FROM server_members sm
    JOIN profiles p ON p.id = sm.user_id
    ORDER BY sm.server_id, (sm.deleted_at IS NOT NULL), sm.joined_at, sm.user_id
  LOOP
    IF current_server IS DISTINCT FROM member.server_id THEN
      current_server := member.server_id;
      taken := '{}';
    END IF;
    base := left(regexp_replace(btrim(coalesce(member.username, '')), '\s+', ' ', 'g'), 30);
    IF base = '' THEN
      base := 'user';
    END IF;
    IF member.deleted_at IS NOT NULL THEN
      UPDATE server_members SET nickname = base
      WHERE server_id = member.server_id AND user_id = member.user_id;
      CONTINUE;
    END IF;
    candidate := base;
    n := 1;
    WHILE lower(candidate) = ANY(taken) LOOP
      n := n + 1;
      candidate := left(base, 30 - length(n::text)) || n::text;
    END LOOP;
    taken := taken || lower(candidate);
    UPDATE server_members
    SET nickname = candidate, nickname_suffix_base = CASE WHEN n > 1 THEN base END
    WHERE server_id = member.server_id AND user_id = member.user_id;
  END LOOP;
END $$;--> statement-breakpoint
ALTER TABLE "server_members" ALTER COLUMN "nickname" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "server_members_active_nickname_uq" ON "server_members" USING btree ("server_id",lower("nickname")) WHERE "server_members"."deleted_at" is null;
