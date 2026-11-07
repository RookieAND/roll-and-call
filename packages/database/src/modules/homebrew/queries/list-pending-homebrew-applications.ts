import { and, asc, eq } from "drizzle-orm";

import { db } from "#db/client";
import { memberNicknameSql } from "#db/modules/profiles";
import { homebrewRuleApplications, profiles } from "#db/schema";

// 어드민 자작 룰 대기열. 오래된 신청부터 보이고 처리된 신청은 빠진다.
export async function listPendingHomebrewApplications({ serverId }: { serverId: string }) {
  return db
    .select({
      id: homebrewRuleApplications.id,
      name: homebrewRuleApplications.name,
      edition: homebrewRuleApplications.edition,
      appliedAt: homebrewRuleApplications.createdAt,
      applicantId: homebrewRuleApplications.userId,
      applicantNickname: memberNicknameSql(serverId),
      applicantAvatarUrl: profiles.avatarUrl,
    })
    .from(homebrewRuleApplications)
    .innerJoin(profiles, eq(profiles.id, homebrewRuleApplications.userId))
    .where(
      and(
        eq(homebrewRuleApplications.serverId, serverId),
        eq(homebrewRuleApplications.status, "pending"),
      ),
    )
    .orderBy(asc(homebrewRuleApplications.createdAt));
}
