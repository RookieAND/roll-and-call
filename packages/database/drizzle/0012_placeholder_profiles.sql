ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "games" DROP CONSTRAINT "games_gm_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "participants" DROP CONSTRAINT "participants_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_gm_id_profiles_id_fk" FOREIGN KEY ("gm_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
-- 디스코드 구인글에서 미리 만든 프로필(auth 계정 없음)은 같은 discord_id로 가입하면 id를 넘겨받는다. FK는 ON UPDATE CASCADE로 따라간다.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, discord_id, username, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'provider_id', new.id::text),
    COALESCE(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'user_name',
      'user'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (discord_id) DO UPDATE
    SET id = excluded.id, username = excluded.username, avatar_url = excluded.avatar_url;
  RETURN new;
END;
$$;
