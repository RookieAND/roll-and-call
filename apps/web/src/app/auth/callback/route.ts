import { NextResponse } from "next/server";

import { authFailurePath, safeNextPath } from "@/shared/lib";
import { createSupabaseServerClient } from "@/shared/server";

const DISCORD_CANCELLED = "access_denied";

// 로그인만 한다. 실패하면 출발한 곳(인덱스 또는 그 서버 가입 화면)에서 안내하고, 디스코드에서 취소하면 안내 없이 돌아간다(D45, D105).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath({ value: searchParams.get("next"), fallback: "/" });

  const redirectTo = (path: string) => {
    // behind Vercel's proxy the real host is in x-forwarded-host
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocal = process.env.NODE_ENV === "development";
    if (!isLocal && forwardedHost) return NextResponse.redirect(`https://${forwardedHost}${path}`);
    return NextResponse.redirect(`${origin}${path}`);
  };

  if (searchParams.get("error") === DISCORD_CANCELLED) return redirectTo(next);

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return redirectTo(next);
  }

  return redirectTo(authFailurePath(next));
}
