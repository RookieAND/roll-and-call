import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/shared/server";

// 디스코드 창을 닫거나 권한 허용을 취소하면 code 없이 돌아온다 → login_fail.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocal = process.env.NODE_ENV === "development";
      if (!isLocal && forwardedHost) return NextResponse.redirect(`https://${forwardedHost}/`);
      return NextResponse.redirect(`${origin}/`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=1`);
}
