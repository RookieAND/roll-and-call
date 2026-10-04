import { and, eq, isNull, lt, or } from "drizzle-orm";

import { db } from "#/client";
import { servers } from "#/schema";

// 월간 발표를 보내기 전에 그 달을 먼저 적는다. 적었으면 true. 실패해도 다시 보내지 않는다(R6).
export async function claimMonthlyAnnouncement({
  serverId,
  month,
}: {
  serverId: string;
  month: string;
}): Promise<boolean> {
  const claimed = await db
    .update(servers)
    .set({ monthlyAnnouncedMonth: month })
    .where(
      and(
        eq(servers.id, serverId),
        or(isNull(servers.monthlyAnnouncedMonth), lt(servers.monthlyAnnouncedMonth, month)),
      ),
    )
    .returning({ id: servers.id });
  return claimed.length > 0;
}
