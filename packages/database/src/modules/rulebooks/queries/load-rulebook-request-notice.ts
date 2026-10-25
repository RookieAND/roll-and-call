import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { memberNicknameSql } from "#db/modules/profiles";
import { profiles, rulebookRequests } from "#db/schema";

// 운영진 채널의 요청 알림에 결과를 반영하는 데 필요한 값. 처리한 운영진은 그 서버 닉네임이다.
export async function loadRulebookRequestNotice({
  serverId,
  id,
}: {
  serverId: string;
  id: string;
}) {
  const [row] = await db
    .select({
      staffMessageId: rulebookRequests.staffMessageId,
      outcome: rulebookRequests.outcome,
      staffNickname: memberNicknameSql(serverId),
    })
    .from(rulebookRequests)
    .leftJoin(profiles, eq(profiles.id, rulebookRequests.processedBy))
    .where(and(eq(rulebookRequests.serverId, serverId), eq(rulebookRequests.id, id)));
  return row;
}
