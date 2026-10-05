import type { BadgeFacts, BadgeSession } from "@roll-and-call/database/badges/model";

export type RuleCount = { categoryId: string; categoryName: string; count: number };

function countByRule(sessions: BadgeSession[]): RuleCount[] {
  const counts = new Map<string, RuleCount>();
  for (const session of sessions) {
    if (!session.categoryId || !session.categoryName) continue;
    const current = counts.get(session.categoryId);
    counts.set(session.categoryId, {
      categoryId: session.categoryId,
      categoryName: session.categoryName,
      count: (current?.count ?? 0) + 1,
    });
  }
  return [...counts.values()].toSorted((left, right) => right.count - left.count);
}

// 진행도를 그릴 때 쓰는 횟수. 판정(computeBadges)과 같은 인정 세션을 센다.
export function badgeCounts({ played, hosted, reviews, written }: BadgeFacts) {
  const playerRules = countByRule(played);
  const hostedRules = countByRule(hosted);
  return {
    playerTotal: played.length,
    gmTotal: hosted.length,
    playerRules,
    playerVariety: playerRules.length,
    playerReviews: written.length,
    gmRules: hostedRules,
    gmVariety: hostedRules.length,
    gmReviews: reviews.length,
  };
}

export type BadgeCounts = ReturnType<typeof badgeCounts>;
