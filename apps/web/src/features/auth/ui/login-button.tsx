"use client";

import { createClient } from "@/shared/api/supabase/client";

export function LoginButton() {
  async function signIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <button
      type="button"
      onClick={signIn}
      className="rounded-md bg-[#5865F2] px-4 py-2 font-medium text-white transition-colors hover:bg-[#4752c4]"
    >
      Discord로 로그인
    </button>
  );
}
