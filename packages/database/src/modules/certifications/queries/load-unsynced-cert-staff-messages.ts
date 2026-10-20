import { and, eq, inArray, isNotNull, isNull, lt, ne, or } from "drizzle-orm";
import { groupBy } from "es-toolkit";

import { db } from "#db/client";
import { memberNicknameSql } from "#db/modules/profiles";
import { rulebookLabel } from "#db/modules/rulebooks/model";
import { certApplications, profiles, rulebooks } from "#db/schema";

// 이 신청자의 신청 알림 중 결과를 아직 반영하지 않은 메시지와, 그 메시지를 나눠 쓰는 신청 전부.
// 묶음 일부만 결정됐어도 메시지 색·결과는 묶음 전체를 보고 정한다.
export async function loadUnsyncedCertStaffMessages({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}) {
  const unsynced = await db
    .selectDistinct({ messageId: certApplications.staffMessageId })
    .from(certApplications)
    .where(
      and(
        eq(certApplications.serverId, serverId),
        eq(certApplications.userId, userId),
        isNotNull(certApplications.staffMessageId),
        ne(certApplications.status, "pending"),
        or(
          isNull(certApplications.staffMessageSyncedAt),
          lt(certApplications.staffMessageSyncedAt, certApplications.processedAt),
        ),
      ),
    );
  const messageIds = unsynced.flatMap(({ messageId }) => (messageId ? [messageId] : []));
  if (messageIds.length === 0) return [];
  const rows = await db
    .select({
      id: certApplications.id,
      messageId: certApplications.staffMessageId,
      status: certApplications.status,
      processedAt: certApplications.processedAt,
      syncedAt: certApplications.staffMessageSyncedAt,
      staffNickname: memberNicknameSql(serverId),
      name: rulebooks.name,
      edition: rulebooks.edition,
    })
    .from(certApplications)
    .innerJoin(rulebooks, eq(rulebooks.id, certApplications.rulebookId))
    .leftJoin(profiles, eq(profiles.id, certApplications.processedBy))
    .where(
      and(
        eq(certApplications.serverId, serverId),
        inArray(certApplications.staffMessageId, messageIds),
      ),
    )
    .orderBy(certApplications.createdAt);
  const byMessage = groupBy(rows, (row) => row.messageId!);
  return Object.entries(byMessage).map(([messageId, applications]) => ({
    messageId,
    applications: applications.map(({ name, edition, processedAt, syncedAt, ...row }) => ({
      ...row,
      rulebookLabel: rulebookLabel({ name, edition }),
      pendingSync:
        row.status !== "pending" && (!syncedAt || (!!processedAt && syncedAt < processedAt)),
    })),
  }));
}
