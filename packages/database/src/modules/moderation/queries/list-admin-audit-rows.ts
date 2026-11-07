import { and, desc, eq, getTableColumns, gte, inArray, like, ne, or, sql } from "drizzle-orm";
import { compact } from "es-toolkit";

import { db } from "#db/client";
import { auditActionsLabeled } from "#db/modules/audit/model";
import { auditLog, serverMembers, sessionReviews } from "#db/schema";

import { isUuid } from "./is-uuid";

// 그 닉네임 멤버의 조치. system이면 시스템 조치도 함께 고른다.
export interface AdminAuditActorFilter {
  nickname: string;
  system: boolean;
}

// 어드민 활동 기록을 조건으로 좁혀 최신순으로 읽는다. 행위자 닉네임과, 후기 조치면 그 후기 ID를 붙인다(같은 구인·작성자의 후기는 하나뿐이다).
// targetName은 「 · 」 앞 이름이 같은 기록, keyword는 대상에 그 글자가 든 기록이다. actions는 화면 이름이다.
export async function listAdminAuditRows({
  serverId,
  id,
  since,
  actor,
  actions,
  targetUserId,
  targetGameId,
  targetName,
  keyword,
}: {
  serverId: string;
  id?: string;
  since?: Date | null;
  actor?: AdminAuditActorFilter;
  actions?: readonly string[];
  targetUserId?: string;
  targetGameId?: string;
  targetName?: string;
  keyword?: string;
}) {
  if (compact([id, targetUserId, targetGameId]).some((value) => !isUuid(value))) return [];
  const actorWhere = actor
    ? or(
        actor.system ? eq(auditLog.actorKind, "system") : undefined,
        and(ne(auditLog.actorKind, "system"), eq(serverMembers.nickname, actor.nickname)),
      )
    : undefined;
  return db
    .select({
      ...getTableColumns(auditLog),
      actorNickname: serverMembers.nickname,
      reviewId: sessionReviews.id,
    })
    .from(auditLog)
    .leftJoin(
      serverMembers,
      and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, auditLog.actorId)),
    )
    .leftJoin(
      sessionReviews,
      and(
        like(auditLog.action, "후기%"),
        eq(sessionReviews.serverId, serverId),
        eq(sessionReviews.gameId, auditLog.targetGameId),
        eq(sessionReviews.authorId, auditLog.targetUserId),
      ),
    )
    .where(
      and(
        eq(auditLog.serverId, serverId),
        id ? eq(auditLog.id, id) : undefined,
        since ? gte(auditLog.createdAt, since) : undefined,
        actorWhere,
        actions?.length ? inArray(auditLog.action, auditActionsLabeled(actions)) : undefined,
        targetUserId ? eq(auditLog.targetUserId, targetUserId) : undefined,
        targetGameId ? eq(auditLog.targetGameId, targetGameId) : undefined,
        targetName ? sql`split_part(${auditLog.target}, ' · ', 1) = ${targetName}` : undefined,
        keyword ? sql`strpos(lower(${auditLog.target}), lower(${keyword}::text)) > 0` : undefined,
      ),
    )
    .orderBy(desc(auditLog.createdAt));
}

export type AdminAuditRow = Awaited<ReturnType<typeof listAdminAuditRows>>[number];
