import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { isNotNil } from "es-toolkit";

import { db } from "#/client";
import type { AuditAction } from "#/modules/moderation/model/audit-actions";
import type { ChosenReason } from "#/modules/moderation/model/chosen-reason";
import { CONTENT_REASON } from "#/modules/moderation/model/content-reason";
import { isAuditAction } from "#/modules/moderation/model/is-audit-action";
import { reasonLabel } from "#/modules/moderation/model/reason-label";
import type { Actor } from "#/modules/moderation/model/types";
import { createNotifications } from "#/modules/notifications/commands/create-notifications";
import { NOTIFICATION_KIND } from "#/modules/notifications/model/notification-kind";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { auditLog, games, profiles, sessionReviews } from "#/schema";

import { recordAudit } from "./record-audit";

export type ReviewModerationAction = "hide" | "unhide" | "remove";

// 숨김·제거 사유는 후기에 코드·글로 저장하고 알림·활동 기록에는 보이는 글로 넣는다. 해제는 사유가 없다(null).
// note는 해제의 활동 기록 사유(되돌리기면 「숨김 되돌리기」)다.
export interface ReviewModerationInput {
  action: ReviewModerationAction;
  reason: ChosenReason | null;
  note?: string;
}

export type ReviewModerationResult =
  | { ok: true }
  | { ok: false; gone: true; deleted: { author: string; at: Date } | null }
  | {
      ok: false;
      gone: false;
      conflict: { action: AuditAction; by: string; byId: string | null; at: Date } | null;
    };

const AUDIT_ACTION = {
  hide: "후기 숨김",
  unhide: "후기 숨김 해제",
  remove: "후기 제거",
} as const satisfies Record<ReviewModerationAction, AuditAction>;

const REVIEW_AUDIT_ACTIONS: AuditAction[] = Object.values(AUDIT_ACTION);

const AFTER_LABEL = {
  hide: "숨김 중",
  unhide: "공개",
  remove: "제거됨",
} as const satisfies Record<ReviewModerationAction, string>;

// 후기 조치 확정. 작성자에게 알림 탭 알림 한 건을 같은 트랜잭션에서 남긴다(디스코드 DM 없음).
// 제거하면 photo_urls를 비운다. 파일은 하루 한 번 도는 파일 정리(0041_purge_orphan_files.sql의 orphan_storage_objects)가 지운다.
export async function moderateReview({
  serverId,
  id,
  actor,
  moderation,
}: {
  serverId: string;
  id: string;
  actor: Actor;
  moderation: ReviewModerationInput;
}): Promise<ReviewModerationResult> {
  const thisReview = and(eq(sessionReviews.serverId, serverId), eq(sessionReviews.id, id));
  return db.transaction(async (tx) => {
    const [review] = await tx
      .select({
        gameId: sessionReviews.gameId,
        authorId: sessionReviews.authorId,
        hiddenAt: sessionReviews.hiddenAt,
        removedAt: sessionReviews.removedAt,
        removedBy: sessionReviews.removedBy,
        author: memberNicknameSql(serverId),
        title: games.title,
      })
      .from(sessionReviews)
      .innerJoin(profiles, eq(profiles.id, sessionReviews.authorId))
      .innerJoin(games, and(eq(games.serverId, serverId), eq(games.id, sessionReviews.gameId)))
      .where(thisReview)
      .for("update", { of: sessionReviews });
    if (!review) return { ok: false, gone: true, deleted: null };
    // 작성자가 지운 후기(removed_by 없음)는 찾을 수 없는 것으로 본다.
    if (review.removedAt && !review.removedBy) {
      return { ok: false, gone: true, deleted: { author: review.author, at: review.removedAt } };
    }
    const hidden = isNotNil(review.hiddenAt);
    const stale =
      isNotNil(review.removedAt) ||
      (moderation.action === "hide" && hidden) ||
      (moderation.action === "unhide" && !hidden);
    if (stale) {
      // 작성자·구인 id로 찾으므로 작성자가 닉네임을 바꿔도 마지막 조치를 찾는다.
      const [latest] = await tx
        .select({
          action: auditLog.action,
          at: auditLog.createdAt,
          by: memberNicknameSql(serverId),
          byId: auditLog.actorId,
        })
        .from(auditLog)
        .leftJoin(profiles, eq(profiles.id, auditLog.actorId))
        .where(
          and(
            eq(auditLog.serverId, serverId),
            eq(auditLog.targetGameId, review.gameId),
            eq(auditLog.targetUserId, review.authorId),
            inArray(auditLog.action, REVIEW_AUDIT_ACTIONS),
          ),
        )
        .orderBy(desc(auditLog.createdAt))
        .limit(1);
      return {
        ok: false,
        gone: false,
        conflict:
          latest && isAuditAction(latest.action)
            ? {
                action: latest.action,
                by: latest.by ?? "알 수 없음",
                byId: latest.byId,
                at: latest.at,
              }
            : null,
      };
    }

    const { action } = moderation;
    const reasonCode = moderation.reason?.code ?? null;
    const reasonText = moderation.reason?.text ?? null;
    const reason = reasonLabel({ code: reasonCode, text: reasonText, reasons: CONTENT_REASON });
    const gameParams = { gameId: review.gameId, gameTitle: review.title };
    if (action === "hide") {
      await tx
        .update(sessionReviews)
        .set({
          hiddenAt: sql`now()`,
          hiddenBy: actor.id,
          hiddenReasonCode: reasonCode,
          hiddenReasonText: reasonText,
        })
        .where(thisReview);
    }
    if (action === "unhide") {
      await tx
        .update(sessionReviews)
        .set({ hiddenAt: null, hiddenBy: null, hiddenReasonCode: null, hiddenReasonText: null })
        .where(thisReview);
    }
    if (action === "remove") {
      await tx
        .update(sessionReviews)
        .set({
          removedAt: sql`now()`,
          removedBy: actor.id,
          removedReasonCode: reasonCode,
          removedReasonText: reasonText,
          body: "",
          photoUrls: [],
        })
        .where(thisReview);
    }
    const notification = {
      hide: { kind: NOTIFICATION_KIND.reviewHidden, params: { ...gameParams, reason } },
      unhide: { kind: NOTIFICATION_KIND.reviewUnhidden, params: gameParams },
      remove: { kind: NOTIFICATION_KIND.reviewDeleted, params: { ...gameParams, reason } },
    }[action];
    await createNotifications({
      executor: tx,
      serverId,
      actorId: actor.id,
      notifications: [{ userId: review.authorId, ...notification }],
    });

    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: AUDIT_ACTION[action],
        target: `${review.author}의 후기 · ${review.title}`,
        targetUserId: review.authorId,
        targetGameId: review.gameId,
        reason: reason || (moderation.note ?? ""),
        before: { label: hidden ? "숨김 중" : "공개" },
        after: { label: AFTER_LABEL[action] },
      },
    });
    return { ok: true };
  });
}
