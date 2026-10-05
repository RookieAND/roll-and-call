CREATE TABLE "server_message_heads" (
	"server_id" uuid NOT NULL,
	"case_key" text NOT NULL,
	"head_line" text NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "server_message_heads_server_id_case_key_pk" PRIMARY KEY("server_id","case_key")
);
--> statement-breakpoint
ALTER TABLE "server_message_heads" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "server_message_heads" ADD CONSTRAINT "server_message_heads_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_message_heads" ADD CONSTRAINT "server_message_heads_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;
