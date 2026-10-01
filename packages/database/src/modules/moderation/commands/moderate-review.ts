import { and, desc, eq, inArray, isNull, like, sql } from "drizzle-orm";

import { db } from "../../../client";
import { auditLog, games, profiles, reviewReports, sessionReviews } from "../../../schema";
import type { AuditAction } from "../model/audit-actions";
import type { Actor } from "../model/types";
import { recordAudit } from "./record-audit";

export type ReviewModerationAction = "hide" | "unhide" | "remove" | "dismiss";

// reasonLabel은 화면에 보이는 사유 이름이다. 사유가 없는 조치면 빈 문자열.
export interface ReviewModerationInput {
  action: ReviewModerationAction;
  reasonLabel: string;
  staffMemo: string;
}

export type ReviewModerationResult =
  | { ok: true }
  | { ok: false; gone: true }
  | { ok: false; gone: false; conflict: { action: AuditAction; by: string; at: Date } | null };

const AUDIT_ACTION = {
  hide: "후기 숨김",
  unhide: "후기 숨김 해제",
  remove: "후기 제거",
  dismiss: "후기 신고 기각",
} as const satisfies Record<ReviewModerationAction, AuditAction>;

const REVIEW_AUDIT_ACTIONS: AuditAction[] = Object.values(AUDIT_ACTION);

const REPORT_OUTCOME = { hide: "hidden", remove: "removed", dismiss: "dismissed" } as const;

// ponytail: 제거해도 review-photos 파일은 남는다. 어드민에 service-role 키가 생기면 커밋 뒤 photoUrls 경로를 지운다.
// ponytail: 작성자·운영진 알림은 아직 보내지 않는다. 알림 경로가 정해지면 여기서 보낸다.
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
  const openReports = and(
    eq(reviewReports.serverId, serverId),
    eq(reviewReports.reviewId, id),
    isNull(reviewReports.outcome),
  );
  return db.transaction(async (tx) => {
    const [review] = await tx
      .select({
        gameId: sessionReviews.gameId,
        authorId: sessionReviews.authorId,
        hiddenAt: sessionReviews.hiddenAt,
        removedAt: sessionReviews.removedAt,
        removedBy: sessionReviews.removedBy,
        author: profiles.username,
        title: games.title,
      })
      .from(sessionReviews)
      .innerJoin(profiles, eq(profiles.id, sessionReviews.authorId))
      .innerJoin(games, and(eq(games.serverId, serverId), eq(games.id, sessionReviews.gameId)))
      .where(thisReview)
      .for("update", { of: sessionReviews });
    // 작성자가 지운 후기(removed_by 없음)도 찾을 수 없는 것으로 본다.
    if (!review || (review.removedAt && !review.removedBy)) return { ok: false, gone: true };
    const target = `${review.author}의 후기 · ${review.title}`;
    const unresolved = await tx
      .select({ id: reviewReports.id })
      .from(reviewReports)
      .where(openReports);
    const hidden = review.hiddenAt !== null;
    const removed = review.removedAt !== null;
    const stale =
      removed ||
      (moderation.action === "hide" && hidden) ||
      (moderation.action === "unhide" && !hidden) ||
      (moderation.action === "dismiss" && unresolved.length === 0);
    if (stale) {
      const [latest] = await tx
        .select({ action: auditLog.action, at: auditLog.createdAt, by: profiles.username })
        .from(auditLog)
        .leftJoin(profiles, eq(profiles.id, auditLog.actorId))
        .where(
          and(
            eq(auditLog.serverId, serverId),
            eq(auditLog.targetGameId, review.gameId),
            eq(auditLog.targetUserId, review.authorId),
            like(auditLog.target, `${review.author}의 후기%`),
            inArray(auditLog.action, REVIEW_AUDIT_ACTIONS),
          ),
        )
        .orderBy(desc(auditLog.createdAt))
        .limit(1);
      if (!latest) return { ok: false, gone: true };
      return {
        ok: false,
        gone: false,
        conflict: {
          action: latest.action as AuditAction,
          by: latest.by ?? "알 수 없음",
          at: latest.at,
        },
      };
    }

    const { reasonLabel } = moderation;
    if (moderation.action !== "unhide" && unresolved.length) {
      await tx
        .update(reviewReports)
        .set({
          outcome: REPORT_OUTCOME[moderation.action],
          resolvedBy: actor.id,
          resolvedAt: sql`now()`,
        })
        .where(openReports);
    }
    if (moderation.action === "hide") {
      await tx
        .update(sessionReviews)
        .set({ hiddenAt: sql`now()`, hiddenBy: actor.id, hiddenReason: reasonLabel })
        .where(thisReview);
    }
    if (moderation.action === "unhide") {
      await tx
        .update(sessionReviews)
        .set({ hiddenAt: null, hiddenBy: null, hiddenReason: null })
        .where(thisReview);
    }
    if (moderation.action === "remove") {
      await tx
        .update(sessionReviews)
        .set({
          removedAt: sql`now()`,
          removedBy: actor.id,
          removedReason: reasonLabel,
          body: "",
          photoUrls: [],
        })
        .where(thisReview);
    }

    const stateLabel = hidden ? "숨김 중" : "공개";
    const afterLabel = {
      hide: "숨김 중",
      unhide: "공개",
      remove: "제거됨",
      dismiss: stateLabel,
    }[moderation.action];
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: AUDIT_ACTION[moderation.action],
        target,
        targetUserId: review.authorId,
        targetGameId: review.gameId,
        reason: reasonLabel || moderation.staffMemo,
        staffMemo: reasonLabel ? moderation.staffMemo || undefined : undefined,
        before: { label: stateLabel },
        after: { label: afterLabel },
        related:
          unresolved.length && moderation.action !== "unhide"
            ? [`처리 안 된 신고 ${unresolved.length}건 처리됨`]
            : undefined,
      },
    });
    return { ok: true };
  });
}
