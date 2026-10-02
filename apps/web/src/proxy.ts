import { isServerSlug } from "@roll-and-call/database/servers/model";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { legacyServerRedirect, REQUEST_PATH_HEADER, SERVER_SLUG_HEADER } from "@/shared/lib";

// 서버 화면은 주소의 첫 칸, API는 ?server=로 서버를 정한다. 밖에서 같은 헤더를 보내도 여기서 덮어쓴다.
function serverSlugOf(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname.startsWith("/api/")) return searchParams.get("server");
  const [, first] = pathname.split("/");
  return isServerSlug(first) ? first : null;
}

export async function proxy(request: NextRequest) {
  const legacy = legacyServerRedirect({
    pathname: request.nextUrl.pathname,
    defaultSlug: process.env.DEFAULT_SERVER_SLUG!,
  });
  if (legacy) {
    const url = request.nextUrl.clone();
    url.pathname = legacy.path;
    return NextResponse.redirect(url, legacy.permanent ? 308 : 307);
  }

  const slug = serverSlugOf(request);
  request.headers.delete(SERVER_SLUG_HEADER);
  if (slug) request.headers.set(SERVER_SLUG_HEADER, slug);
  request.headers.set(REQUEST_PATH_HEADER, `${request.nextUrl.pathname}${request.nextUrl.search}`);

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // getClaims()는 만료된 토큰을 갱신해 응답 쿠키에 쓰고, 비대칭 키면 Auth 서버를 부르지 않는다.
  await supabase.auth.getClaims();

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
