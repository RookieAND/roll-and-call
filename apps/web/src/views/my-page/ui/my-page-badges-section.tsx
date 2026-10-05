import { badgeCounts, countBadges, nextBadgeGoal } from "@/entities/badge";
import { getCurrentServer, getCurrentSessionUser, getUserBadges } from "@/shared/server";

import { loadMyBadgeFacts } from "../api/load-my-badge-facts";
import { MyPageBadges } from "./my-page-badges";

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
    />
  );
}
