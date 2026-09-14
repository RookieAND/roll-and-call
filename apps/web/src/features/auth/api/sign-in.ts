import { createSupabaseBrowserClient } from "@/shared/api";

// next: 로그인 후 돌아올 앱 내부 경로. 기본값은 로그인을 누른 지금 화면.
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
