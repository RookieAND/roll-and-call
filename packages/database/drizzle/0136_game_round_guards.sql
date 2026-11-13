CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA extensions;--> statement-breakpoint
-- 회차 생략 때 뒤 번호를 한 문장으로 당기려고 트랜잭션 끝에서 검사한다. 이 제약은 ON CONFLICT의 대상으로 쓸 수 없다.
ALTER TABLE "game_rounds" DROP CONSTRAINT "game_rounds_game_id_round_no_unique";--> statement-breakpoint
ALTER TABLE "game_rounds" ADD CONSTRAINT "game_rounds_game_id_round_no_unique" UNIQUE ("game_id", "round_no") DEFERRABLE INITIALLY DEFERRED;--> statement-breakpoint
-- 같은 구인의 회차끼리는 시간이 겹치지 않는다. 끝과 시작이 맞닿는 것은 허용한다. 일시가 없는 회차는 비교하지 않는다.
ALTER TABLE "game_rounds" ADD CONSTRAINT "game_rounds_no_overlap" EXCLUDE USING gist ("game_id" WITH =, tstzrange("start_at", "planned_end_at") WITH &&) WHERE ("start_at" IS NOT NULL);--> statement-breakpoint
-- games의 last_start_at·finished_at을 회차에서 다시 계산한다. 조기 종결이 있으면 그 시각이 종료이고,
-- 없으면 예정 회차 수와 같은 번호의 회차가 끝났을 때 그 회차의 종료 시각이다.
CREATE OR REPLACE FUNCTION public.refresh_game_round_summary(target_game_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  UPDATE public.games g
  SET
    last_start_at = (SELECT max(r.start_at) FROM public.game_rounds r WHERE r.game_id = g.id),
    finished_at = CASE
      WHEN g.incomplete_at IS NOT NULL THEN g.incomplete_at
      ELSE (
        SELECT coalesce(r.ended_at, r.planned_end_at)
        FROM public.game_rounds r
        WHERE r.game_id = g.id AND r.round_no = g.round_count AND r.status = 'finished'
      )
    END
  WHERE g.id = target_game_id
    AND (
      g.last_start_at IS DISTINCT FROM (SELECT max(r.start_at) FROM public.game_rounds r WHERE r.game_id = g.id)
      OR g.finished_at IS DISTINCT FROM CASE
        WHEN g.incomplete_at IS NOT NULL THEN g.incomplete_at
        ELSE (
          SELECT coalesce(r.ended_at, r.planned_end_at)
          FROM public.game_rounds r
          WHERE r.game_id = g.id AND r.round_no = g.round_count AND r.status = 'finished'
        )
      END
    );
END;
$$;--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.game_rounds_refresh_summary()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.refresh_game_round_summary(OLD.game_id);
  ELSE
    PERFORM public.refresh_game_round_summary(NEW.game_id);
  END IF;
  RETURN NULL;
END;
$$;--> statement-breakpoint
CREATE TRIGGER game_rounds_refresh_summary
AFTER INSERT OR DELETE OR UPDATE OF start_at, planned_end_at, ended_at, status, round_no ON public.game_rounds
FOR EACH ROW
EXECUTE FUNCTION public.game_rounds_refresh_summary();--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.games_refresh_round_summary()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  PERFORM public.refresh_game_round_summary(NEW.id);
  RETURN NULL;
END;
$$;--> statement-breakpoint
CREATE TRIGGER games_refresh_round_summary
AFTER UPDATE OF round_count, incomplete_at ON public.games
FOR EACH ROW
EXECUTE FUNCTION public.games_refresh_round_summary();
