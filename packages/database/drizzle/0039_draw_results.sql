CREATE TABLE "draw_results" (
	"game_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"roll" integer,
	"status" "participant_status" NOT NULL,
	CONSTRAINT "draw_results_game_id_user_id_pk" PRIMARY KEY("game_id","user_id"),
	CONSTRAINT "draw_results_roll_range" CHECK ("draw_results"."roll" between 1 and 100)
);
--> statement-breakpoint
ALTER TABLE "draw_results" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "draw_results" ADD CONSTRAINT "draw_results_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "draw_results" ADD CONSTRAINT "draw_results_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
-- 이미 적용한 추첨은 지금 남은 명단으로 결과 페이지가 보여 주던 그대로 채운다. 이미 나간 사람은 되살릴 수 없다.
INSERT INTO "draw_results" ("game_id", "user_id", "roll", "status")
SELECT p."game_id", p."user_id", p."draw_roll",
	CASE
		WHEN p."draw_roll" IS NULL THEN 'confirmed'::"participant_status"
		WHEN row_number() OVER (PARTITION BY p."game_id", p."draw_roll" IS NULL ORDER BY p."draw_roll", p."joined_at")
			<= greatest(g."max_players" - pre."count", 0) THEN 'confirmed'::"participant_status"
		ELSE 'waiting'::"participant_status"
	END
FROM "participants" p
JOIN "games" g ON g."id" = p."game_id"
CROSS JOIN LATERAL (
	SELECT count(*) AS "count" FROM "participants" q
	WHERE q."game_id" = p."game_id" AND q."draw_roll" IS NULL AND q."status" = 'confirmed'
) pre
WHERE g."drawn_at" IS NOT NULL AND (p."draw_roll" IS NOT NULL OR p."status" = 'confirmed');
