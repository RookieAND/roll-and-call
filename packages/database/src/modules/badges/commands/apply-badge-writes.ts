import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import type { BadgeWrite } from "#/modules/badges/model/diff-badges";
import { userBadges } from "#/schema";

export async function applyBadgeWrites({
  serverId,
  userId,
  writes,
  now,
}: {
  serverId: string;
  userId: string;
  writes: BadgeWrite[];
  now: Date;
}) {
  if (writes.length === 0) return;
  await db.transaction(async (transaction) => {
    for (const write of writes) {
      if (write.kind === "revoke") {
        await transaction
          .update(userBadges)
          .set({ revokedAt: now })
          .where(
            and(
              eq(userBadges.serverId, serverId),
              eq(userBadges.userId, userId),
              eq(userBadges.badgeKey, write.badgeKey),
            ),
          );
        continue;
      }
      const { badgeKey, tier, earnedAt, sourceGameId } = write.badge;
      // 단계가 내려가면 조용히 고치고, 새로 받거나 오르면 획득 시트와 새 뱃지 점을 다시 켠다.
      const renotify = write.kind === "grant" ? { notifiedAt: null, seenAt: null } : {};
      await transaction
        .insert(userBadges)
        .values({ serverId, userId, badgeKey, tier, earnedAt, sourceGameId })
        .onConflictDoUpdate({
          target: [userBadges.serverId, userBadges.userId, userBadges.badgeKey],
          set: { tier, earnedAt, sourceGameId, revokedAt: null, ...renotify },
        });
    }
  });
}
