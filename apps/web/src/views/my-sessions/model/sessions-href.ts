import { SESSION_BUCKET, type SessionBucket, type SessionChip } from "@/widgets/session-list";

export const ALL_SESSION_CHIPS = "all";

// 기본 탭(참여 중)·전체 칩은 주소에 남기지 않는다.
export function sessionsHref(
  tab: SessionBucket,
  status?: SessionChip | typeof ALL_SESSION_CHIPS,
): string {
  const searchParams = new URLSearchParams();
  if (tab !== SESSION_BUCKET.joined) searchParams.set("tab", tab);
  if (status && status !== ALL_SESSION_CHIPS) searchParams.set("status", status);
  const query = searchParams.toString();
  return query ? `/me/sessions?${query}` : "/me/sessions";
}
