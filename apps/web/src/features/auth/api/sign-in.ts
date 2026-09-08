import { createSupabaseBrowserClient } from "@/shared/api";
export async function signInWithDiscord() {
  const supabase = createSupabaseBrowserClient();
  await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
}
