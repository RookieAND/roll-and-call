import "server-only";
import { cache } from "react";

import { createSupabaseServerClient } from "./create-supabase-server-client";

export interface SessionUser {
  id: string;
  email: string | undefined;
  user_metadata: Record<string, unknown>;
}

// 읽기 전용 화면용. getSession()의 user는 쿠키 값 그대로라 믿을 수 없어(Supabase 경고),
// getClaims()로 JWT 서명을 검증한 클레임만 쓴다. 비대칭 키면 Auth 서버를 부르지 않는다.
// 레이아웃과 페이지가 같은 요청에서 여러 번 불러도 한 번만 검증한다.
export const getCurrentSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;
  return {
    id: claims.sub,
    email: claims.email,
    user_metadata: (claims.user_metadata ?? {}) as Record<string, unknown>,
  };
});
