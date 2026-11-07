import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { memberNicknameSql } from "#db/modules/profiles";
import { homebrewRuleApplications, homebrewRules, profiles } from "#db/schema";

// 어드민 룰북 상세의 「자작 룰 정보」와 심사 자료. 자료는 승인된 신청 행이 그 룰의 현재 자료다.
// 제작자가 지워졌으면 makerId·makerNickname이 null이다(「알 수 없음」).
export async function loadHomebrewRuleInfo({
  serverId,
  rulebookId,
}: {
  serverId: string;
  rulebookId: string;
}) {
  const [row] = await db
    .select({
      makerId: homebrewRules.makerId,
      makerNickname: memberNicknameSql(serverId),
      makerAvatarUrl: profiles.avatarUrl,
      scope: homebrewRules.scope,
      summary: homebrewRules.summary,
      approvedAt: homebrewRules.createdAt,
      applicationId: homebrewRuleApplications.id,
      links: homebrewRuleApplications.links,
      imageUrls: homebrewRuleApplications.imageUrls,
    })
    .from(homebrewRules)
    .leftJoin(profiles, eq(profiles.id, homebrewRules.makerId))
    .leftJoin(
      homebrewRuleApplications,
      eq(homebrewRuleApplications.rulebookId, homebrewRules.rulebookId),
    )
    .where(and(eq(homebrewRules.serverId, serverId), eq(homebrewRules.rulebookId, rulebookId)));
  if (!row) return null;
  return {
    ...row,
    makerNickname: row.makerId ? row.makerNickname : null,
    links: row.links ?? [],
    imageUrls: row.imageUrls ?? [],
  };
}
