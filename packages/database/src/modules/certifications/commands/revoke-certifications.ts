import { and, desc, eq, isNull, sql } from "drizzle-orm";

import { db } from "#/client";
import { cancelGame } from "#/modules/games/commands/cancel-game";
import { GAME_CANCEL_KIND } from "#/modules/games/model/game-cancel-kind";
import type { ModerationConflict } from "#/modules/moderation/commands/moderation-conflict";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import { STAFF_CHANNEL_RELATED } from "#/modules/moderation/model/audit-actions";
import type { Actor } from "#/modules/moderation/model/types";
import { createNotifications } from "#/modules/notifications/commands/create-notifications";
import { NOTIFICATION_KIND } from "#/modules/notifications/model/notification-kind";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { rulebookLabel } from "#/modules/rulebooks/model/rulebook-label";
import {
  certApplications,
  certifications,
  profiles,
  rulebooks,
  servers,
  type Game,
} from "#/schema";

import { loadRevokeCancelTargets } from "../queries/load-revoke-cancel-targets";

export type RevokeResult =
  | { ok: true; nickname: string; rulebookLabel: string; cancelledGames: Game[] }
  | { ok: false; conflict: ModerationConflict | null };

// 책 한 권의 인증을 지우고, 마지막 승인 신청을 반려로 바꾼다. 신청 없이 직접 준 인증이면 반려 기록을 새로 만든다.
// 증빙 이미지(사진·구매 캡처·영수증) URL을 비우면 어느 행도 가리키지 않게 되어 하루 한 번 도는 정리 작업(0041)이 파일을 지운다.
// 그 판본으로 연 시작 전 구인은 운영진 취소로 닫는다(알림은 cancelGame). 운영진 채널 글은 부르는 쪽이 커밋 뒤에 올린다.
export async function revokeCertifications({
  serverId,
  userId,
  rulebookId,
  actor,
  userReason,
  staffMemo,
}: {
  serverId: string;
  userId: string;
  rulebookId: string;
  actor: Actor;
  userReason: string;
  staffMemo: string;
}): Promise<RevokeResult> {
  const thisCertification = and(
    eq(certifications.serverId, serverId),
    eq(certifications.userId, userId),
    eq(certifications.rulebookId, rulebookId),
  );
  const thisBook = and(
    eq(certApplications.serverId, serverId),
    eq(certApplications.userId, userId),
    eq(certApplications.rulebookId, rulebookId),
  );
  return db.transaction(async (tx) => {
    const [revoked] = await tx
      .delete(certifications)
      .where(and(thisCertification, isNull(certifications.revokedAt)))
      .returning({ rulebookId: certifications.rulebookId });
    if (!revoked) {
      const [latest] = await tx
        .select({
          byId: certApplications.processedBy,
          by: memberNicknameSql(serverId),
          at: certApplications.processedAt,
        })
        .from(certApplications)
        .leftJoin(profiles, eq(profiles.id, certApplications.processedBy))
        .where(and(thisBook, eq(certApplications.status, "rejected")))
        .orderBy(desc(certApplications.processedAt))
        .limit(1);
      const conflict =
        latest?.byId && latest.by && latest.at
          ? { byId: latest.byId, by: latest.by, at: latest.at }
          : null;
      return { ok: false, conflict };
    }

    const rejection = {
      status: "rejected" as const,
      rejectReason: userReason,
      flaggedShots: [],
      photoUrls: {},
      purchaseCaptureUrl: null,
      receiptUrl: null,
      processedBy: actor.id,
      processedAt: sql`now()`,
    };
    const [approved] = await tx
      .select({ id: certApplications.id })
      .from(certApplications)
      .where(and(thisBook, eq(certApplications.status, "approved")))
      .orderBy(desc(certApplications.createdAt))
      .limit(1);
    if (approved) {
      await tx
        .update(certApplications)
        .set(rejection)
        .where(and(eq(certApplications.serverId, serverId), eq(certApplications.id, approved.id)));
    } else {
      await tx
        .insert(certApplications)
        .values({ serverId, userId, rulebookId, direct: true, ...rejection });
    }

    const now = new Date();
    const targets = await loadRevokeCancelTargets({
      executor: tx,
      serverId,
      userId,
      rulebookId,
      now,
    });
    const cancelledGames: Game[] = [];
    for (const { game } of targets) {
      const cancelled = await cancelGame({
        transaction: tx,
        serverId,
        gameId: game.id,
        kind: GAME_CANCEL_KIND.staff,
        actorId: actor.id,
        reason: null,
        now,
      });
      if (cancelled.ok) cancelledGames.push(cancelled.game);
    }

    const [names] = await tx
      .select({
        nickname: memberNicknameSql(serverId),
        name: rulebooks.name,
        edition: rulebooks.edition,
        staffChannelId: servers.staffChannelId,
      })
      .from(profiles)
      .innerJoin(rulebooks, and(eq(rulebooks.serverId, serverId), eq(rulebooks.id, rulebookId)))
      .innerJoin(servers, eq(servers.id, serverId))
      .where(eq(profiles.id, userId));
    if (!names) throw new Error("유저나 룰북을 찾을 수 없습니다");
    const label = rulebookLabel(names);

    await createNotifications({
      executor: tx,
      serverId,
      actorId: actor.id,
      notifications: [
        {
          userId,
          kind: NOTIFICATION_KIND.certRevoked,
          params: { rulebookId, rulebookName: label, cancelledGameCount: cancelledGames.length },
        },
      ],
    });
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "반려로 돌림",
        target: `${names.nickname} · ${label}`,
        targetUserId: userId,
        reason: userReason,
        staffMemo: staffMemo || undefined,
        before: { label: "인증됨" },
        after: { label: "반려됨" },
        related: [
          ...(cancelledGames.length > 0
            ? [
                `취소된 구인 ${cancelledGames.length}개`,
                ...cancelledGames.map((game) => game.title),
              ]
            : []),
          "당사자 알림 탭에 알림 보냄",
          names.staffChannelId ? STAFF_CHANNEL_RELATED.posted : STAFF_CHANNEL_RELATED.missing,
        ],
      },
    });
    return { ok: true, nickname: names.nickname, rulebookLabel: label, cancelledGames };
  });
}
