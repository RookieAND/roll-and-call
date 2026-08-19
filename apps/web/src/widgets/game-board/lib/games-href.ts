// 게임 목록 필터/검색/페이지 상태를 /games 쿼리스트링으로 직렬화.
export function gamesHref(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `/games?${s}` : "/games";
}
