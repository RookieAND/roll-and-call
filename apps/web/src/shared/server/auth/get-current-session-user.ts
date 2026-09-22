import "server-only";
import { createSupabaseServerClient } from "./create-supabase-server-client";

// proxy(middleware)가 이미 getUser()로 토큰을 검증·갱신했으므로,
// 읽기 전용 페이지에서는 로컬 JWT 파싱만으로 충분하다.
export async function getCurrentSessionUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}
