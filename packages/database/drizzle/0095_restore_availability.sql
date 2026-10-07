CREATE TABLE "availabilities" (
	"server_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"slot_start" timestamp with time zone NOT NULL,
	CONSTRAINT "availabilities_game_id_user_id_slot_start_pk" PRIMARY KEY("game_id","user_id","slot_start")
);
--> statement-breakpoint
ALTER TABLE "server_members" ADD COLUMN "availability" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "availability" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "availability_submitted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_game_server_fk" FOREIGN KEY ("game_id","server_id") REFERENCES "public"."games"("id","server_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "availabilities_user_id_game_id_idx" ON "availabilities" USING btree ("user_id","game_id");