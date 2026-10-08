import { and, eq, isNull } from "drizzle-orm";

import { db } from "#/client";
import { BADGE_LADDER } from "#/modules/badges/model/badge-ladder";
import { userBadges } from "#/schema";

import { applyBadgeWrites } from "./apply-badge-writes";

// 튜토리얼 퀘스트 4개를 모두 깬 사람에게 견습 모험가를 준다. 이미 받았으면 아무것도 하지 않는다(멱등).
export async function grantApprenticeBadge({
  serverId,
  userId,
  earnedAt,
}: {
  serverId: string;
  userId: string;
  earnedAt: Date;
}) {
  const [held] = await db
    .select({ badgeKey: userBadges.badgeKey })
    .from(userBadges)
    .where(
      and(
        eq(userBadges.serverId, serverId),
        eq(userBadges.userId, userId),
        eq(userBadges.badgeKey, BADGE_LADDER.apprentice),
        isNull(userBadges.revokedAt),
      ),
    );
  if (held) return false;
  await applyBadgeWrites({
    serverId,
    userId,
    writes: [
      {
        kind: "grant",
        badge: { badgeKey: BADGE_LADDER.apprentice, tier: 1, earnedAt, sourceGameId: null },
      },
    ],
    now: new Date(),
  });
  return true;
}
