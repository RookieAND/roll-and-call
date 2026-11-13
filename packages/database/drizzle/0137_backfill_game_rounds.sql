-- 단발 구인(예정 회차 수 1)의 회차 1을 games 행에서 다시 만든다. 읽기 이전(C36-3) 동안 games가 진실이라 쓰기 경로가 바뀔 때마다 부른다.
-- 회차가 없으면 만들고 있으면 덮는다. 예정 회차 수가 2 이상인 구인은 회차를 직접 쓰므로 건드리지 않는다.
-- 상태: 일시 없음(조율형)은 coordinating, 취소한 구인은 cancelling, 시작 전은 scheduled, 시작했고 끝나지 않았으면 in_progress,
-- GM이 마쳤거나 예정 종료가 지났으면 finished. 예정 종료는 시작 + 플레이타임 최대(없으면 180분, 하루 상한 24시간).
-- 상태는 부른 시각의 값이라 시간이 지나도 저절로 바뀌지 않는다. 읽는 쪽은 상태가 아니라 시각 칼럼을 본다.
CREATE OR REPLACE FUNCTION public.sync_game_first_round(target_game_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  g public.games%ROWTYPE;
  planned timestamptz;
  next_status public.round_status;
BEGIN
  SELECT * INTO g FROM public.games WHERE id = target_game_id;
  IF NOT FOUND OR g.round_count > 1 THEN
    RETURN;
  END IF;

  planned := g.confirmed_at + make_interval(mins => least(coalesce(nullif(g.play_minutes, 0), 180), 1440));
  next_status := CASE
    WHEN g.confirmed_at IS NULL THEN
      CASE WHEN g.schedule_mode = 'coordinate' THEN 'coordinating' ELSE 'unscheduled' END
    WHEN g.cancelled_at IS NOT NULL THEN 'cancelling'
    WHEN now() < g.confirmed_at THEN 'scheduled'
    WHEN g.ended_at IS NOT NULL OR now() >= planned THEN 'finished'
    ELSE 'in_progress'
  END;

  UPDATE public.game_rounds
  SET
    start_at = g.confirmed_at,
    planned_end_at = planned,
    ended_at = g.ended_at,
    status = next_status,
    coordination_start = CASE WHEN g.schedule_mode = 'coordinate' THEN g.range_start END,
    coordination_end = CASE WHEN g.schedule_mode = 'coordinate' THEN g.range_end END,
    coordination_timezone = CASE WHEN g.schedule_mode = 'coordinate' THEN 'Asia/Seoul' END,
    attendance_confirmed_at = g.attendance_confirmed_at
  WHERE game_id = g.id AND round_no = 1;
  IF NOT FOUND THEN
    INSERT INTO public.game_rounds (
      server_id, game_id, round_no, start_at, planned_end_at, ended_at, status,
      coordination_start, coordination_end, coordination_timezone, attendance_confirmed_at, created_at
    )
    VALUES (
      g.server_id, g.id, 1, g.confirmed_at, planned, g.ended_at, next_status,
      CASE WHEN g.schedule_mode = 'coordinate' THEN g.range_start END,
      CASE WHEN g.schedule_mode = 'coordinate' THEN g.range_end END,
      CASE WHEN g.schedule_mode = 'coordinate' THEN 'Asia/Seoul' END,
      g.attendance_confirmed_at, g.created_at
    );
  END IF;
END;
$$;--> statement-breakpoint
-- 단발 구인의 출석을 회차 1에 맞춘다. 확정·내보낸 참여자만 행을 두고(attended = not absent) 대기로 내려가면 행을 지운다.
-- 참여자 행이 지워질 때는 외래 키가 알아서 지운다. 회차 1이 아직 없으면 아무것도 하지 않고 백필이 채운다.
CREATE OR REPLACE FUNCTION public.participants_sync_first_round_attendance()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  first_round_id uuid;
BEGIN
  SELECT r.id INTO first_round_id
  FROM public.game_rounds r
  JOIN public.games g ON g.id = r.game_id
  WHERE r.game_id = NEW.game_id AND r.round_no = 1 AND g.round_count = 1;
  IF first_round_id IS NULL THEN
    RETURN NULL;
  END IF;
  IF NEW.status IN ('confirmed', 'removed') THEN
    INSERT INTO public.round_attendances (server_id, round_id, game_id, user_id, attended)
    VALUES (NEW.server_id, first_round_id, NEW.game_id, NEW.user_id, NOT NEW.absent)
    ON CONFLICT (round_id, user_id) DO UPDATE SET attended = EXCLUDED.attended;
  ELSE
    DELETE FROM public.round_attendances WHERE round_id = first_round_id AND user_id = NEW.user_id;
  END IF;
  RETURN NULL;
END;
$$;--> statement-breakpoint
CREATE TRIGGER participants_sync_first_round_attendance
AFTER INSERT OR UPDATE OF status, absent ON public.participants
FOR EACH ROW
EXECUTE FUNCTION public.participants_sync_first_round_attendance();--> statement-breakpoint
-- 기존 구인마다 회차 1개를 만들고 출석·후기를 옮긴다. 이미 회차 1이 있는 구인은 건드리지 않아 여러 번 돌려도 같다.
-- 쓰기 경로가 바뀌기 전에 새로 생긴 구인은 그때 한 번 더 부르면 채워진다. 알림·디스코드 호출은 없다.
CREATE OR REPLACE FUNCTION public.backfill_game_rounds()
RETURNS TABLE(rounds_created integer, attendances_created integer, reviews_linked integer)
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  target uuid;
  created_rounds integer := 0;
  created_attendances integer;
  linked_reviews integer;
BEGIN
  FOR target IN
    SELECT g.id FROM public.games g
    WHERE NOT EXISTS (SELECT 1 FROM public.game_rounds x WHERE x.game_id = g.id AND x.round_no = 1)
  LOOP
    PERFORM public.sync_game_first_round(target);
    created_rounds := created_rounds + 1;
  END LOOP;

  INSERT INTO public.round_attendances (server_id, round_id, game_id, user_id, attended)
  SELECT p.server_id, r.id, p.game_id, p.user_id, NOT p.absent
  FROM public.participants p
  JOIN public.game_rounds r ON r.game_id = p.game_id AND r.round_no = 1
  WHERE p.status IN ('confirmed', 'removed')
  ON CONFLICT DO NOTHING;
  GET DIAGNOSTICS created_attendances = ROW_COUNT;

  UPDATE public.session_reviews s
  SET round_id = r.id
  FROM public.game_rounds r
  WHERE r.game_id = s.game_id AND r.round_no = 1 AND s.round_id IS NULL;
  GET DIAGNOSTICS linked_reviews = ROW_COUNT;

  RETURN QUERY SELECT created_rounds, created_attendances, linked_reviews;
END;
$$;--> statement-breakpoint
SELECT * FROM public.backfill_game_rounds();
