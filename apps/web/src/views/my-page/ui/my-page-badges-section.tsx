import { badgeCounts, heldBadges, nextBadgeGoal } from "@/entities/badge";
import { getCurrentSessionUser, getUserBadges } from "@/shared/server";

import { loadMyBadgeFacts } from "../api/load-my-badge-facts";
import { MyPageBadges } from "./my-page-badges";

export async function MyPageBadgesSection() {
  const user = (await getCurrentSessionUser())!;
  const [records, facts] = await Promise.all([getUserBadges(user.id), loadMyBadgeFacts(user.id)]);
  const held = heldBadges(records);
  return (
    <MyPageBadges
      heldCount={held.length}
      hasNew={held.some((badge) => badge.record.seenAt === null)}
      goal={nextBadgeGoal(badgeCounts(facts))}
    />
  );
}
