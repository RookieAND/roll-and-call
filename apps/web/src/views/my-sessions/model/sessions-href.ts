import type { SessionBucket, SessionChip } from "@/widgets/session-list";

// 내 세션 주소. 기본 탭(참여 중)·전체 칩은 주소에 남기지 않는다.
export function sessionsHref(tab: SessionBucket, status?: SessionChip | "all"): string {
  const sp = new URLSearchParams();
  if (tab !== "joined") sp.set("tab", tab);
  if (status && status !== "all") sp.set("status", status);
  const query = sp.toString();
  return query ? `/me/sessions?${query}` : "/me/sessions";
}
