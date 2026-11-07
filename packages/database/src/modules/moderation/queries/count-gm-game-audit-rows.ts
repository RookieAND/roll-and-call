import { and, count, eq, inArray } from "drizzle-orm";

import { db } from "#db/client";
import { auditActionsLabeled } from "#db/modules/audit/model";
import { auditLog, games } from "#db/schema";

// 그 GM이 연 구인에 남은 조치 수. actions는 화면 이름이다.
export async function countGmGameAuditRows({
  serverId,
  gmId,
  actions,
}: {
  serverId: string;
  gmId: string;
  actions: readonly string[];
}) {
  const [row] = await db
    .select({ count: count() })
    .from(auditLog)
    .where(
      and(
        eq(auditLog.serverId, serverId),
        inArray(auditLog.action, auditActionsLabeled(actions)),
        inArray(
          auditLog.targetGameId,
          db
            .select({ id: games.id })
            .from(games)
            .where(and(eq(games.serverId, serverId), eq(games.gmId, gmId))),
        ),
      ),
    );
  return row?.count ?? 0;
}
