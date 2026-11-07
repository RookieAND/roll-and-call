import "server-only";
import {
  getAdminGameTitle,
  listAdminAuditActors,
  listAdminMemberNicknames,
} from "@roll-and-call/database/moderation";
import { compact, isNull, uniq } from "es-toolkit";

import {
  getCurrentServer,
  loadAuditEntries,
  MISSING_NAME,
  requireStaff,
  SYSTEM_ACTOR_NAME,
} from "@/shared/server";

import { auditLogPeriod } from "../model/audit-log-period";
import { filterAuditLog, type AuditLogFilter } from "../model/filter-audit-log";

// 조건은 SQL로 먼저 좁히고, 같은 조건을 filterAuditLog로 한 번 더 걸어 정렬한다.
// ponytail: 데스크톱 쪽 나누기·CSV·모바일 목록이 거른 전체를 쓰므로 쪽 단위로 읽지 않는다. 기본 기간(7일)이 양을 막는다.
export async function listAuditLog(filter: AuditLogFilter) {
  await requireStaff();
  const server = await getCurrentServer();
  const now = Date.now();
  const { since } = auditLogPeriod({ filter, now });
  // 「알 수 없음」은 닉네임이 없는 행이라 SQL로 고르지 않는다.
  const actor =
    filter.actor && filter.actor !== MISSING_NAME
      ? { nickname: filter.actor, system: filter.actor === SYSTEM_ACTOR_NAME }
      : undefined;
  const entries = await loadAuditEntries({
    since: isNull(since) ? null : new Date(since),
    actor,
    actions: filter.actions,
    targetUserId: filter.targetUser,
    targetGameId: filter.targetGame,
    targetName: filter.target,
    keyword: filter.q,
  });
  const { rows, period } = filterAuditLog({ entries, filter, now });
  const actorRows = await listAdminAuditActors({ serverId: server.id });
  const actors = uniq(
    actorRows.map((row) =>
      row.actorKind === "system" ? SYSTEM_ACTOR_NAME : (row.actorNickname ?? MISSING_NAME),
    ),
  );
  const [targetUser] = filter.targetUser
    ? await listAdminMemberNicknames({ serverId: server.id, userIds: [filter.targetUser] })
    : [];
  const targetGameTitle = filter.targetGame
    ? await getAdminGameTitle({ serverId: server.id, id: filter.targetGame })
    : undefined;
  const targetNames = compact([targetUser?.nickname, targetGameTitle, filter.target]);
  return { rows, actors, period, targetName: targetNames.join(" · ") || undefined };
}
