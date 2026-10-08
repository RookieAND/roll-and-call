CREATE TABLE "onboarding_quest_clears" (
	"server_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"quest" text NOT NULL,
	"cleared_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "onboarding_quest_clears_server_id_user_id_quest_pk" PRIMARY KEY("server_id","user_id","quest")
);
--> statement-breakpoint
ALTER TABLE "onboarding_quest_clears" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "server_members" ADD COLUMN "onboarded_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "onboarding_quest_clears" ADD CONSTRAINT "onboarding_quest_clears_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_quest_clears" ADD CONSTRAINT "onboarding_quest_clears_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;