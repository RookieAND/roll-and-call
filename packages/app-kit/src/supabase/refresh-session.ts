import { createServerClient } from "@supabase/ssr";
import type { NextResponse, NextRequest } from "next/server";

const AUTH_COOKIE_PATTERN = /^sb-.+-auth-token(\.\d+)?$/;

type RefreshSessionOptions = {
  createResponse: () => NextResponse;
  skipWithoutAuthCookie?: boolean;
};

// proxy에서 만료된 로그인 토큰을 갱신해 응답 쿠키에 쓴다. 갱신으로 쿠키가 바뀌면 createResponse를 다시 불러 새 쿠키를 요청에 싣는다.
export async function refreshSession(
  request: NextRequest,
  { createResponse, skipWithoutAuthCookie = false }: RefreshSessionOptions,
) {
  let response = createResponse();

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
          response = createResponse();
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // getClaims()는 만료된 토큰을 갱신하고, 비대칭 키면 Auth 서버를 부르지 않는다. 신원 검증은 서버 액션·페이지의 getUser()가 맡는다.
  const hasAuthCookie = request.cookies.getAll().some(({ name }) => AUTH_COOKIE_PATTERN.test(name));
  if (hasAuthCookie || !skipWithoutAuthCookie) await supabase.auth.getClaims();

  return response;
}
