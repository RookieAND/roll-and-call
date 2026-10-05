import { and, eq, or, sql } from "drizzle-orm";

import { db } from "#/client";
import {
  drawResults,
  games,
  participants,
  serverMembers,
  sessionReviews,
  userBadges,
} from "#/schema";

// 기록(참가·진행·추첨·후기)이나 받은 뱃지가 하나도 없는 멤버는 다시 계산해도 결과가 늘 비어 있다.
export async function loadBadgeCandidateIds(serverId: string): Promise<string[]> {
  const rows = await db
    .select({ userId: serverMembers.userId })
    .from(serverMembers)
    .where(
      and(
        eq(serverMembers.serverId, serverId),
        or(
          sql`exists (select 1 from ${participants} where ${participants.serverId} = ${serverId} and ${participants.userId} = ${serverMembers.userId})`,
          sql`exists (select 1 from ${games} where ${games.serverId} = ${serverId} and ${games.gmId} = ${serverMembers.userId})`,
          sql`exists (select 1 from ${drawResults} where ${drawResults.serverId} = ${serverId} and ${drawResults.userId} = ${serverMembers.userId})`,
          sql`exists (select 1 from ${sessionReviews} where ${sessionReviews.serverId} = ${serverId} and ${sessionReviews.authorId} = ${serverMembers.userId})`,
          sql`exists (select 1 from ${userBadges} where ${userBadges.serverId} = ${serverId} and ${userBadges.userId} = ${serverMembers.userId} and ${userBadges.revokedAt} is null)`,
        ),
      ),
    );
  return rows.map((row) => row.userId);
}
