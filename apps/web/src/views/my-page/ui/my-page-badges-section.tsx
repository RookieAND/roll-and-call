import { badgeCounts, countBadges, heldBadges, nextBadgeGoal } from "@/entities/badge";
import { getCurrentServer, getCurrentSessionUser, getUserBadges } from "@/shared/server";

import { loadMyBadgeFacts } from "../api/load-my-badge-facts";
import { MyPageBadges } from "./my-page-badges";

const RECENT_BADGE_COUNT = 4;

export async function MyPageBadgesSection() {
  const user = (await getCurrentSessionUser())!;
  const server = await getCurrentServer();
  const [records, facts] = await Promise.all([
    getUserBadges(server.id, user.id),
    loadMyBadgeFacts(user.id),
  ]);

  return (
    <MyPageBadges
      heldCount={countBadges(records, new Date()).total}
      goal={nextBadgeGoal(badgeCounts(facts))}
      recent={heldBadges(records, new Date())
        .slice(0, RECENT_BADGE_COUNT)
        .map(({ key, name, emoji, look, monthKey }) => ({ key, name, emoji, look, monthKey }))}
    />
  );
}
