-- Custom SQL migration file, put your code below! --

-- 1. Sync auth.users -> public.profiles on signup (Discord OAuth metadata).
--    SECURITY DEFINER so it bypasses RLS; empty search_path per Supabase guidance.
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
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;
--> statement-breakpoint
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
--> statement-breakpoint
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
--> statement-breakpoint

-- 2. Row Level Security.
--    NOTE: the app's Drizzle connection (DATABASE_URL, privileged role) BYPASSES RLS,
--    so app-level authz still lives in Route Handlers. RLS guards the anon/authenticated
--    PostgREST API that Supabase auto-exposes on every public table.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.availabilities ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

-- profiles: readable by any authenticated user; rows are written only by the trigger.
CREATE POLICY "profiles_select_authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);
--> statement-breakpoint

-- games: readable by authenticated users; only the KP mutates their own game.
CREATE POLICY "games_select_authenticated" ON public.games
  FOR SELECT TO authenticated USING (true);
--> statement-breakpoint
CREATE POLICY "games_insert_own" ON public.games
  FOR INSERT TO authenticated WITH CHECK (kp_id = (SELECT auth.uid()));
--> statement-breakpoint
CREATE POLICY "games_update_own" ON public.games
  FOR UPDATE TO authenticated
  USING (kp_id = (SELECT auth.uid()))
  WITH CHECK (kp_id = (SELECT auth.uid()));
--> statement-breakpoint
CREATE POLICY "games_delete_own" ON public.games
  FOR DELETE TO authenticated USING (kp_id = (SELECT auth.uid()));
--> statement-breakpoint

-- participants: readable by authenticated users; a user joins/leaves only as themselves.
CREATE POLICY "participants_select_authenticated" ON public.participants
  FOR SELECT TO authenticated USING (true);
--> statement-breakpoint
CREATE POLICY "participants_insert_self" ON public.participants
  FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
--> statement-breakpoint
CREATE POLICY "participants_delete_self" ON public.participants
  FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));
--> statement-breakpoint

-- availabilities: readable by authenticated users (heatmap); a user edits only their own slots.
CREATE POLICY "availabilities_select_authenticated" ON public.availabilities
  FOR SELECT TO authenticated USING (true);
--> statement-breakpoint
CREATE POLICY "availabilities_insert_self" ON public.availabilities
  FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
--> statement-breakpoint
CREATE POLICY "availabilities_delete_self" ON public.availabilities
  FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));
