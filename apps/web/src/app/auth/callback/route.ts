import { NextResponse } from "next/server";

import { safeNextPath } from "@/shared/lib";
import { createSupabaseServerClient } from "@/shared/server";

// 로그인만 한다. 서버 가입은 그 서버 주소의 가입 화면(/{slug}/join)에서만 일어난다.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath({ value: searchParams.get("next"), fallback: "/" });

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // behind Vercel's proxy the real host is in x-forwarded-host
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocal = process.env.NODE_ENV === "development";
      if (!isLocal && forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/?auth_error=1`);
}
