import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { SERVER_SLUG_HEADER } from "@/shared/lib";

const NON_SERVER_SEGMENTS: ReadonlySet<string> = new Set(["login", "denied", "auth", "platform"]);

// 주소 첫 칸이 서버 slug다. 서버 액션도 페이지 주소로 POST되므로 같은 헤더를 받는다.
// 요청에 원래 붙어 온 헤더는 늘 지워서, 밖에서 서버를 바꿔 끼울 수 없게 한다.
function forwardHeaders(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.delete(SERVER_SLUG_HEADER);
  const [segment] = request.nextUrl.pathname.split("/").filter(Boolean);
  if (segment && !NON_SERVER_SEGMENTS.has(segment)) {
    headers.set(SERVER_SLUG_HEADER, decodeURIComponent(segment));
  }
  return headers;
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: forwardHeaders(request) } });

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
          response = NextResponse.next({ request: { headers: forwardHeaders(request) } });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Refreshes the auth token and writes it back to the response cookies.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
