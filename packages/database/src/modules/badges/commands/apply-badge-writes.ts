import { and, eq, inArray, sql } from "drizzle-orm";

import { db } from "#/client";
import { BADGE_LADDERS } from "#/modules/badges/model/badge-ladders";
import type { BadgeWrite } from "#/modules/badges/model/diff-badges";
import { parseBadgeKey } from "#/modules/badges/model/parse-badge-key";
import { planBadgeNotices } from "#/modules/badges/model/plan-badge-notices";
import { createNotifications } from "#/modules/notifications/commands/create-notifications";
import { rulebookCategories, userBadges } from "#/schema";

type Grant = Extract<BadgeWrite, { kind: "grant" }>;

function ruleCategoryIds(grants: Grant[]): string[] {
  return grants.flatMap((write) => {
    const parsed = parseBadgeKey(write.badge.badgeKey);
    return parsed && BADGE_LADDERS[parsed.ladder].perRule && parsed.subject ? [parsed.subject] : [];
  });
}

// 1. 회수·단계 내림(revoke·lower)은 알림도 시트도 없다.
// 2. 새로 받거나 오른 단계(grant)는 그 키로 알린 단계(notified_tier)보다 높을 때만 알림 줄을 만든다(planBadgeNotices).
// 3. 이번 grant에 시트 대상(첫 뱃지·숨겨진 칭호·출시 소급분)이 있으면 모든 grant를 시트 대기(notified_at null)로, 없으면 알린 것(now)으로 둔다.
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
  const grants = writes.filter((write): write is Grant => write.kind === "grant");
  await db.transaction(async (transaction) => {
    const grantKeys = grants.map((write) => write.badge.badgeKey);
    const categoryIds = ruleCategoryIds(grants);
    const [stored, categories] = await Promise.all([
      grantKeys.length > 0
        ? transaction
            .select({ badgeKey: userBadges.badgeKey, notifiedTier: userBadges.notifiedTier })
            .from(userBadges)
            .where(
              and(
                eq(userBadges.serverId, serverId),
                eq(userBadges.userId, userId),
                inArray(userBadges.badgeKey, grantKeys),
              ),
            )
        : [],
      categoryIds.length > 0
        ? transaction
            .select({
              id: sql<string>`${rulebookCategories.id}::text`,
              name: rulebookCategories.name,
            })
            .from(rulebookCategories)
            .where(
              and(
                eq(rulebookCategories.serverId, serverId),
                inArray(sql`${rulebookCategories.id}::text`, categoryIds),
              ),
            )
        : [],
    ]);
    const notifiedTierByKey = new Map(stored.map((row) => [row.badgeKey, row.notifiedTier]));
    const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));
    const plan = planBadgeNotices({
      grants: grants.map((write) => ({
        badge: write.badge,
        notifiedTier: notifiedTierByKey.get(write.badge.badgeKey) ?? null,
        categoryName:
          categoryNameById.get(parseBadgeKey(write.badge.badgeKey)?.subject ?? "") ?? null,
      })),
      now,
    });
    const notifiedAt = plan.sheet ? null : now;

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
      const notice =
        write.kind === "grant"
          ? { notifiedAt, notifiedTier: sql`greatest(${userBadges.notifiedTier}, ${tier})` }
          : {};
      await transaction
        .insert(userBadges)
        .values({
          serverId,
          userId,
          badgeKey,
          tier,
          earnedAt,
          sourceGameId,
          ...(write.kind === "grant" ? { notifiedAt, notifiedTier: tier } : {}),
        })
        .onConflictDoUpdate({
          target: [userBadges.serverId, userBadges.userId, userBadges.badgeKey],
          set: { tier, earnedAt, sourceGameId, revokedAt: null, ...notice },
        });
    }

    await createNotifications({
      executor: transaction,
      serverId,
      actorId: null,
      notifications: plan.notifications.map((notification) => ({ ...notification, userId })),
    });
  });
}
