// 우리 Supabase 프로젝트 주소인가. 다른 호스트에 버킷 경로만 흉내 낸 주소를 서버가 내려받지 않게 한다.
// 테스트처럼 Supabase 주소가 없는 환경에서는 통과시킨다.
export function isSupabaseUrl(url: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return true;
  return URL.parse(url)?.origin === new URL(supabaseUrl).origin;
}
