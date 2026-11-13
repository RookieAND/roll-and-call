-- 기존 구인마다 회차 1개를 만들고 출석·후기를 옮긴다. 이미 회차 1이 있는 구인은 건드리지 않아 여러 번 돌려도 같다.
-- 읽기 이전(C36-3)에서 쓰기 경로가 바뀌기 전에 새로 생긴 구인은 그때 한 번 더 부르면 채워진다. 알림·디스코드 호출은 없다.
-- 회차 상태: 일시 없음(조율형)은 coordinating, 취소한 구인은 cancelling, 시작 전은 scheduled, 시작했고 끝나지 않았으면 in_progress,
-- GM이 마쳤거나 예정 종료가 지났으면 finished. 예정 종료는 시작 + 플레이타임 최대(없으면 180분, 하루 상한 24시간).
CREATE OR REPLACE FUNCTION public.backfill_game_rounds()
RETURNS TABLE(rounds_created integer, attendances_created integer, reviews_linked integer)
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  created_rounds integer;
  created_attendances integer;
  linked_reviews integer;
BEGIN
  INSERT INTO public.game_rounds (
    server_id, game_id, round_no, start_at, planned_end_at, ended_at, status,
    coordination_start, coordination_end, coordination_timezone, attendance_confirmed_at, created_at
  )
  SELECT
    t.server_id, t.id, 1, t.confirmed_at, t.planned_end_at, t.ended_at,
    CASE
      WHEN t.confirmed_at IS NULL THEN
        CASE WHEN t.schedule_mode = 'coordinate' THEN 'coordinating' ELSE 'unscheduled' END
      WHEN t.cancelled_at IS NOT NULL THEN 'cancelling'
      WHEN now() < t.confirmed_at THEN 'scheduled'
      WHEN t.ended_at IS NOT NULL OR now() >= t.planned_end_at THEN 'finished'
      ELSE 'in_progress'
    END::public.round_status,
    CASE WHEN t.schedule_mode = 'coordinate' THEN t.range_start END,
    CASE WHEN t.schedule_mode = 'coordinate' THEN t.range_end END,
    CASE WHEN t.schedule_mode = 'coordinate' THEN 'Asia/Seoul' END,
    t.attendance_confirmed_at, t.created_at
  FROM (
    SELECT
      g.*,
      g.confirmed_at + make_interval(mins => least(coalesce(nullif(g.play_minutes, 0), 180), 1440)) AS planned_end_at
    FROM public.games g
    WHERE NOT EXISTS (SELECT 1 FROM public.game_rounds x WHERE x.game_id = g.id AND x.round_no = 1)
  ) t;
  GET DIAGNOSTICS created_rounds = ROW_COUNT;

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
