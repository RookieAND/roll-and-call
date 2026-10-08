import { sql } from "drizzle-orm";

import { db } from "#/client";
import { grantApprenticeBadge } from "#/modules/badges/commands/grant-apprentice-badge";
import { BADGE_LADDER } from "#/modules/badges/model/badge-ladder";
import { ONBOARDING_QUESTS } from "#/modules/onboarding/model/quests";
import { onboardingQuestClears, userBadges } from "#/schema";

// 클리어 기록이 4건인데 칭호가 빠진 사람을 채운다(지급 실패 복구). 매일 크론이 부른다.
export async function syncApprenticeBadges() {
  const rows = await db
    .select({
      serverId: onboardingQuestClears.serverId,
      userId: onboardingQuestClears.userId,
      lastClearedAt: sql<Date>`max(${onboardingQuestClears.clearedAt})`.mapWith(
        (value) => new Date(value),
      ),
    })
    .from(onboardingQuestClears)
    .where(
      sql`not exists (select 1 from ${userBadges} where ${userBadges.serverId} = ${onboardingQuestClears.serverId} and ${userBadges.userId} = ${onboardingQuestClears.userId} and ${userBadges.badgeKey} = ${BADGE_LADDER.apprentice} and ${userBadges.revokedAt} is null)`,
    )
    .groupBy(onboardingQuestClears.serverId, onboardingQuestClears.userId)
    .having(sql`count(*) >= ${ONBOARDING_QUESTS.length}`);
  for (const { serverId, userId, lastClearedAt } of rows) {
    await grantApprenticeBadge({ serverId, userId, earnedAt: lastClearedAt });
  }
  return rows.length;
}
