import { and, eq, isNull } from "drizzle-orm";

import { db } from "#/client";
import type { BadgeLadderKey } from "#/modules/badges/model/badge-ladder";
import { userBadges } from "#/schema";

import { applyBadgeWrites } from "./apply-badge-writes";

// 오너가 직접 주는 칭호(견습 모험가·작은 등불 등)를 준다. 이미 받았으면 아무것도 하지 않는다(멱등).
export async function grantSpecialBadge({
  serverId,
  userId,
  badgeKey,
  earnedAt = new Date(),
}: {
  serverId: string;
  userId: string;
  badgeKey: BadgeLadderKey;
  earnedAt?: Date;
}) {
  const [held] = await db
    .select({ badgeKey: userBadges.badgeKey })
    .from(userBadges)
    .where(
      and(
        eq(userBadges.serverId, serverId),
        eq(userBadges.userId, userId),
        eq(userBadges.badgeKey, badgeKey),
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
        badge: { badgeKey: badgeKey, tier: 1, earnedAt, sourceGameId: null },
      },
    ],
    now: new Date(),
  });
  return true;
}
