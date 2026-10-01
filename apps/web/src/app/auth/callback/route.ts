import {
  ensureMembership,
  getDefaultServer,
  getServerBySlug,
  isServerSlug,
} from "@roll-and-call/database/servers";
import { NextResponse } from "next/server";

import { safeNextPath } from "@/shared/lib";
import { createSupabaseServerClient } from "@/shared/server";

// 돌아갈 서버 화면의 서버에 멤버로 넣는다. 서버 밖 화면에서 로그인했으면 기본 서버다.
async function serverOfPath(path: string) {
  const [, first] = path.split("/");
  const server = isServerSlug(first) ? await getServerBySlug(first) : undefined;
  return server ?? getDefaultServer();
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath({ value: searchParams.get("next"), fallback: "/" });

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const server = await serverOfPath(next);
      await ensureMembership({ serverId: server.id, userId: data.user.id });
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
