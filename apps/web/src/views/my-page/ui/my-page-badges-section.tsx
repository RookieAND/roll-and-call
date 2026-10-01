import { isNull } from "es-toolkit";

import { badgeCounts, heldBadges, nextBadgeGoal } from "@/entities/badge";
import { getCurrentSessionUser, getUserBadges, getCurrentServer } from "@/shared/server";

import { loadMyBadgeFacts } from "../api/load-my-badge-facts";
import { MyPageBadges } from "./my-page-badges";

export async function MyPageBadgesSection() {
  const user = (await getCurrentSessionUser())!;
  const server = await getCurrentServer();
  const [records, facts] = await Promise.all([
    getUserBadges(server.id, user.id),
    loadMyBadgeFacts(user.id),
  ]);
  const held = heldBadges(records);
  return (
    <MyPageBadges
      heldCount={held.length}
      hasNew={held.some((badge) => isNull(badge.record.seenAt))}
      goal={nextBadgeGoal(badgeCounts(facts))}
    />
  );
}
