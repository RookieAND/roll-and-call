import type { BadgeFacts } from "./badge-facts";
import type { BadgeEvent } from "./reached-tier";

// 가입하고 months(또는 days)가 지났고 인정 세션이 1회 이상이면, 둘 중 늦은 때에 받는다.
export function anniversaryEvents({
  facts,
  months = 0,
  days = 0,
}: {
  facts: BadgeFacts;
  months?: number;
  days?: number;
}): BadgeEvent[] {
  if (!facts.joinedAt) return [];
  const sessionEnds = [...facts.played, ...facts.hosted].map((session) => session.endsAt.getTime());
  if (sessionEnds.length === 0) return [];
  const anniversary = new Date(facts.joinedAt);
  anniversary.setUTCMonth(anniversary.getUTCMonth() + months);
  anniversary.setUTCDate(anniversary.getUTCDate() + days);
  const at = new Date(Math.max(anniversary.getTime(), Math.min(...sessionEnds)));
  if (at.getTime() > facts.asOf.getTime()) return [];
  return [{ at, gameId: null }];
}
