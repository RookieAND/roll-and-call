CREATE TYPE "public"."rulebook_request_source" AS ENUM('user', 'game');--> statement-breakpoint
CREATE TABLE "rulebook_request_games" (
	"server_id" uuid NOT NULL,
	"request_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rulebook_request_games_request_id_game_id_pk" PRIMARY KEY("request_id","game_id")
);
--> statement-breakpoint
ALTER TABLE "rulebook_request_games" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "supplements" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "rulebook_requests" ADD COLUMN "source" "rulebook_request_source" DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "rulebook_request_games" ADD CONSTRAINT "rulebook_request_games_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rulebook_request_games" ADD CONSTRAINT "rulebook_request_games_request_id_rulebook_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."rulebook_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rulebook_request_games" ADD CONSTRAINT "rulebook_request_games_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rulebook_request_games" ADD CONSTRAINT "rulebook_request_games_game_server_fk" FOREIGN KEY ("game_id","server_id") REFERENCES "public"."games"("id","server_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "rulebook_request_games_game_id_idx" ON "rulebook_request_games" USING btree ("game_id");--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_supplements_limit" CHECK (jsonb_array_length("games"."supplements") <= 10);--> statement-breakpoint
-- 구인이 취소되면 그 구인이 자동 요청에 붙은 행을 뺀다. 취소 경로(GM·운영진·자동 취소)가 여럿이라 트리거가 맡는다.
CREATE OR REPLACE FUNCTION public.unlink_cancelled_game_requests()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.rulebook_request_games WHERE game_id = NEW.id;
  RETURN NEW;
END;
$$;--> statement-breakpoint
CREATE TRIGGER games_unlink_cancelled_requests
AFTER UPDATE OF cancelled_at ON public.games
FOR EACH ROW
WHEN (OLD.cancelled_at IS NULL AND NEW.cancelled_at IS NOT NULL)
EXECUTE FUNCTION public.unlink_cancelled_game_requests();--> statement-breakpoint
-- 붙은 구인이 하나도 남지 않은 대기 중 자동 요청은 대기열에서 내린다. 구인을 지워 행이 함께 지워질 때도 돈다.
CREATE OR REPLACE FUNCTION public.drop_orphan_game_requests()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.rulebook_requests r
  WHERE r.id = OLD.request_id
    AND r.source = 'game'
    AND r.outcome IS NULL
    AND NOT EXISTS (SELECT 1 FROM public.rulebook_request_games l WHERE l.request_id = OLD.request_id);
  RETURN NULL;
END;
$$;--> statement-breakpoint
CREATE TRIGGER rulebook_request_games_drop_orphans
AFTER DELETE ON public.rulebook_request_games
FOR EACH ROW
EXECUTE FUNCTION public.drop_orphan_game_requests();
