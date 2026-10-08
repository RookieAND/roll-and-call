import "server-only";
import { createClient } from "@supabase/supabase-js";

// service-role 키라 RLS를 건너뛴다. 로그인 세션이 없는 서명된 디스코드 요청처럼 서버가 사용자를 이미 확인한 곳에서만 쓴다.
export function createSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY not set");

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
