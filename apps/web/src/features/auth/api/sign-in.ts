import { createSupabaseBrowserClient } from "@/shared/api";

export async function signInWithDiscord(
  next: string = `${window.location.pathname}${window.location.search}`,
) {
  const supabase = createSupabaseBrowserClient();
  const callback = new URL("/auth/callback", window.location.origin);
  callback.searchParams.set("next", next);
  await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: { redirectTo: callback.toString() },
  });
}
