import { and, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";
import { uniq } from "es-toolkit";

import { db } from "#/client";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import { STAFF_CHANNEL_RELATED } from "#/modules/moderation/model/audit-actions";
import type { Actor } from "#/modules/moderation/model/types";
import { createNotifications } from "#/modules/notifications/commands/create-notifications";
import { NOTIFICATION_KIND } from "#/modules/notifications/model/notification-kind";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { rulebookLabel } from "#/modules/rulebooks/model/rulebook-label";
import { certApplications, certifications, profiles, rulebooks, servers } from "#/schema";

import { GRANT_SKIP_REASON, type GrantSkipReason } from "../model/grant-skip-reason";
import { supplementCoresOpened } from "../model/supplement-cores-opened";

export type GrantResult =
  | {
      ok: true;
      rulebookLabel: string;
      granted: { userId: string; nickname: string }[];
      skipped: { userId: string; nickname: string; reason: GrantSkipReason }[];
    }
  | { ok: false; notRequired: true };

// 사람마다 인증을 넣거나 되살리고, 그 사람의 대기 신청을 함께 승인하고, 「직접 인증」 기록 한 건과 cert_granted 알림을 남긴다.
// 이미 인증된 사람과 같은 판본 기본 룰북을 열지 않은 서플리먼트 대상은 건너뛴다. 운영진 채널 글은 부르는 쪽이 커밋 뒤에 올린다.
export async function grantCertifications({
  serverId,
  rulebookId,
  userIds,
  actor,
  evidence,
}: {
  serverId: string;
  rulebookId: string;
  userIds: string[];
  actor: Actor;
  evidence: string;
}): Promise<GrantResult> {
  return db.transaction(async (tx) => {
    const books = await tx
      .select({
        id: rulebooks.id,
        name: rulebooks.name,
        edition: rulebooks.edition,
        kind: rulebooks.kind,
        category: rulebooks.categoryId,
        certRequired: rulebooks.certRequired,
        supersedesId: rulebooks.supersedesId,
        hidden: rulebooks.hidden,
      })
      .from(rulebooks)
      .where(eq(rulebooks.serverId, serverId));
    const book = books.find((candidate) => candidate.id === rulebookId);
    if (!book) throw new Error("룰북을 찾을 수 없습니다");
    if (!book.certRequired) return { ok: false, notRequired: true };
    const label = rulebookLabel(book);
    const targets = uniq(userIds);
    if (targets.length === 0) return { ok: true, rulebookLabel: label, granted: [], skipped: [] };

    const [server] = await tx
      .select({ staffChannelId: servers.staffChannelId })
      .from(servers)
      .where(eq(servers.id, serverId));
    const people = await tx
      .select({ userId: profiles.id, nickname: memberNicknameSql(serverId) })
      .from(profiles)
      .where(inArray(profiles.id, targets));
    const certified = await tx
      .select({ userId: certifications.userId, rulebookId: certifications.rulebookId })
      .from(certifications)
      .where(
        and(
          eq(certifications.serverId, serverId),
          inArray(certifications.userId, targets),
          isNull(certifications.revokedAt),
        ),
      );
    const shownBooks = books.filter((candidate) => !candidate.hidden);

    const granted: { userId: string; nickname: string }[] = [];
    const skipped: { userId: string; nickname: string; reason: GrantSkipReason }[] = [];
    for (const { userId, nickname } of people) {
      const certifiedIds = new Set(
        certified.filter((row) => row.userId === userId).map((row) => row.rulebookId),
      );
      if (!supplementCoresOpened({ book, books: shownBooks, certifiedIds })) {
        skipped.push({ userId, nickname, reason: GRANT_SKIP_REASON.supplementBlocked });
        continue;
      }
      // 처음 인증이면 넣고, 취소됐던 인증이면 되살린다. 이미 유효한 인증이면 아무것도 돌려받지 못한다.
      const [inserted] = await tx
        .insert(certifications)
        .values({ serverId, userId, rulebookId, approvedBy: actor.id })
        .onConflictDoUpdate({
          target: [certifications.serverId, certifications.userId, certifications.rulebookId],
          set: {
            approvedBy: actor.id,
            approvedAt: sql`now()`,
            revokedAt: null,
            revokedBy: null,
            revokeReason: null,
            discardedAt: null,
          },
          setWhere: isNotNull(certifications.revokedAt),
        })
        .returning({ userId: certifications.userId });
      if (!inserted) {
        skipped.push({ userId, nickname, reason: GRANT_SKIP_REASON.alreadyCertified });
        continue;
      }
      const approvedApplications = await tx
        .update(certApplications)
        .set({ status: "approved", processedBy: actor.id, processedAt: sql`now()` })
        .where(
          and(
            eq(certApplications.serverId, serverId),
            eq(certApplications.userId, userId),
            eq(certApplications.rulebookId, rulebookId),
            eq(certApplications.status, "pending"),
          ),
        )
        .returning({ id: certApplications.id });
      await recordAudit({
        executor: tx,
        serverId,
        actor,
        entry: {
          action: "직접 인증",
          target: `${nickname} · ${label}`,
          targetUserId: userId,
          reason: "운영진 직접 추가",
          staffMemo: evidence,
          before: { label: approvedApplications.length ? "심사 대기" : "미인증" },
          after: { label: "인증됨" },
          related: [
            ...(approvedApplications.length
              ? [`대기 중인 심사 신청 ${approvedApplications.length}건 함께 승인`]
              : []),
            "당사자 알림 탭에 알림 보냄",
            server?.staffChannelId ? STAFF_CHANNEL_RELATED.posted : STAFF_CHANNEL_RELATED.missing,
          ],
        },
      });
      granted.push({ userId, nickname });
    }

    await createNotifications({
      executor: tx,
      serverId,
      actorId: actor.id,
      notifications: granted.map(({ userId }) => ({
        userId,
        kind: NOTIFICATION_KIND.certGranted,
        params: { rulebookId, rulebookName: label },
      })),
    });
    return { ok: true, rulebookLabel: label, granted, skipped };
  });
}
