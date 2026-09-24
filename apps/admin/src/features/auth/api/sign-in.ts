import { createSupabaseBrowserClient } from "@/shared/api";

export async function signInWithDiscord() {
  const supabase = createSupabaseBrowserClient();
  await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: { redirectTo: new URL("/auth/callback", window.location.origin).toString() },
  });
}
