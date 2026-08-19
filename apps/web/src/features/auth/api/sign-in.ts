import { createClient } from "@/shared/api/supabase/client";

export async function signInWithDiscord() {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
}
