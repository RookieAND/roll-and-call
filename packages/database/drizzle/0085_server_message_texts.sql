CREATE TABLE "server_message_texts" (
	"server_id" uuid NOT NULL,
	"text_key" text NOT NULL,
	"body" text NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "server_message_texts_server_id_text_key_pk" PRIMARY KEY("server_id","text_key")
);
--> statement-breakpoint
ALTER TABLE "server_message_texts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "server_message_texts" ADD CONSTRAINT "server_message_texts_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_message_texts" ADD CONSTRAINT "server_message_texts_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;