import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { memberNicknameSql } from "#db/modules/profiles";
import { homebrewRuleApplications, profiles } from "#db/schema";

// 운영진 채널 글에 처리 결과를 반영할 때 읽는다.
export async function loadHomebrewNotice({ serverId, id }: { serverId: string; id: string }) {
  const [row] = await db
    .select({
      staffMessageId: homebrewRuleApplications.staffMessageId,
      status: homebrewRuleApplications.status,
      staffNickname: memberNicknameSql(serverId),
    })
    .from(homebrewRuleApplications)
    .leftJoin(profiles, eq(profiles.id, homebrewRuleApplications.processedBy))
    .where(
      and(eq(homebrewRuleApplications.serverId, serverId), eq(homebrewRuleApplications.id, id)),
    );
  return row ?? null;
}
