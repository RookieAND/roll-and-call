import { and, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";
import { uniq } from "es-toolkit";

import { db } from "#db/client";
import { recordAudit } from "#db/modules/audit";
import { STAFF_CHANNEL_RELATED } from "#db/modules/audit";
import type { Actor } from "#db/modules/audit";
import { createNotifications } from "#db/modules/notifications";
import { NOTIFICATION_KIND } from "#db/modules/notifications/model";
import { memberNicknameSql } from "#db/modules/profiles";
import { RULEBOOK_KIND } from "#db/modules/rulebooks/model";
import { rulebookLabel } from "#db/modules/rulebooks/model";
import { certApplications, certifications, profiles, rulebooks, servers } from "#db/schema";

import { GRANT_SKIP_REASON, type GrantSkipReason } from "../model/grant-skip-reason";
import { supplementCoresOpened } from "../model/supplement-cores-opened";

export interface GrantBookResult {
  rulebookId: string;
  rulebookLabel: string;
  granted: { userId: string; nickname: string }[];
  skipped: { userId: string; nickname: string; reason: GrantSkipReason }[];
}

export type GrantResult = { ok: true; books: GrantBookResult[] } | { ok: false; notRequired: true };

// 룰북마다, 사람마다 인증을 넣거나 되살리고, 그 사람의 대기 신청을 함께 승인하고, 「직접 인증」 기록 한 건과 cert_granted 알림을 남긴다.
// 이미 인증된 사람과 같은 판본 기본 룰북을 열지 않은 서플리먼트 대상은 건너뛴다.
// 기본 룰북을 서플리먼트보다 먼저 처리하므로 같은 요청에 함께 고른 기본 룰북은 서플리먼트 조건을 채운다.
// 모든 룰북을 한 트랜잭션에서 처리한다. 운영진 채널 글은 부르는 쪽이 커밋 뒤에 올린다.
export async function grantCertifications({
  serverId,
  rulebookIds,
  userIds,
  actor,
  evidence,
}: {
  serverId: string;
  rulebookIds: string[];
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
    const picked = uniq(rulebookIds).map((id) => {
      const book = books.find((candidate) => candidate.id === id);
      if (!book) throw new Error("룰북을 찾을 수 없습니다");
      return book;
    });
    if (picked.some((book) => !book.certRequired)) return { ok: false, notRequired: true };
    const ordered = [
      ...picked.filter((book) => book.kind !== RULEBOOK_KIND.supplement),
      ...picked.filter((book) => book.kind === RULEBOOK_KIND.supplement),
    ];
    const targets = uniq(userIds);
    if (targets.length === 0) {
      return {
        ok: true,
        books: ordered.map((book) => ({
          rulebookId: book.id,
          rulebookLabel: rulebookLabel(book),
          granted: [],
          skipped: [],
        })),
      };
    }

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
    const certifiedByUser = new Map<string, Set<string>>();
    for (const row of certified) {
      const ids = certifiedByUser.get(row.userId) ?? new Set<string>();
      ids.add(row.rulebookId);
      certifiedByUser.set(row.userId, ids);
    }
    const shownBooks = books.filter((candidate) => !candidate.hidden);

    const results: GrantBookResult[] = [];
    // 알림은 유저마다 한 건으로 묶는다. 받은 룰북이 여러 권이면 첫 룰북 외 N권으로 알린다.
    const grantedByUser = new Map<string, { rulebookId: string; rulebookName: string }[]>();
    for (const book of ordered) {
      const label = rulebookLabel(book);
      const granted: GrantBookResult["granted"] = [];
      const skipped: GrantBookResult["skipped"] = [];
      for (const { userId, nickname } of people) {
        const certifiedIds = certifiedByUser.get(userId) ?? new Set<string>();
        if (!supplementCoresOpened({ book, books: shownBooks, certifiedIds })) {
          skipped.push({ userId, nickname, reason: GRANT_SKIP_REASON.supplementBlocked });
          continue;
        }
        // 처음 인증이면 넣고, 취소됐던 인증이면 되살린다. 이미 유효한 인증이면 아무것도 돌려받지 못한다.
        const [inserted] = await tx
          .insert(certifications)
          .values({ serverId, userId, rulebookId: book.id, approvedBy: actor.id })
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
        certifiedByUser.set(userId, new Set([...certifiedIds, book.id]));
        const approvedApplications = await tx
          .update(certApplications)
          .set({ status: "approved", processedBy: actor.id, processedAt: sql`now()` })
          .where(
            and(
              eq(certApplications.serverId, serverId),
              eq(certApplications.userId, userId),
              eq(certApplications.rulebookId, book.id),
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
        grantedByUser.set(userId, [
          ...(grantedByUser.get(userId) ?? []),
          { rulebookId: book.id, rulebookName: label },
        ]);
      }
      results.push({ rulebookId: book.id, rulebookLabel: label, granted, skipped });
    }

    const notifications = [...grantedByUser].flatMap(([userId, grantedBooks]) => {
      const [first] = grantedBooks;
      if (!first) return [];
      return [
        {
          userId,
          kind: NOTIFICATION_KIND.certGranted,
          params: { ...first, otherCount: grantedBooks.length - 1 },
        },
      ];
    });
    await createNotifications({ executor: tx, serverId, actorId: actor.id, notifications });
    return { ok: true, books: results };
  });
}
