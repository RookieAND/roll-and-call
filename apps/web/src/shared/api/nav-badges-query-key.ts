export const NAV_BADGES_QUERY_ROOT = "nav-badges";

// 하단 탭 점(안 읽은 알림, 막힌 할 일)은 서버별로 한 번 묻는다. 읽음·처리 뒤 이 키를 무효화한다.
export function navBadgesQueryKey(slug: string) {
  return [NAV_BADGES_QUERY_ROOT, slug] as const;
}
