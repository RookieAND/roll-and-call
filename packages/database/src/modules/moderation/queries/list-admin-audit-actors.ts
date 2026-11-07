import { and, desc, eq, max } from "drizzle-orm";

import { db } from "#db/client";
import { auditLog, serverMembers } from "#db/schema";

// 활동 기록에 남은 행위자와 닉네임. 마지막으로 조치한 순서다.
export function listAdminAuditActors({ serverId }: { serverId: string }) {
  return db
    .select({
      actorKind: auditLog.actorKind,
      actorNickname: serverMembers.nickname,
    })
    .from(auditLog)
    .leftJoin(
      serverMembers,
      and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, auditLog.actorId)),
    )
    .where(eq(auditLog.serverId, serverId))
    .groupBy(auditLog.actorKind, auditLog.actorId, serverMembers.nickname)
    .orderBy(desc(max(auditLog.createdAt)));
}
