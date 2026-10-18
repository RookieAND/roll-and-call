import { refreshSession } from "@roll-and-call/app-kit/supabase/proxy";
import { isServerSlug } from "@roll-and-call/database/servers/model";
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

  return refreshSession(request, {
    createResponse: () => NextResponse.next({ request }),
    skipWithoutAuthCookie: true,
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
