import "server-only";
import { auditLog, db, games, profiles, reports } from "@roll-and-call/database";
import { and, desc, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";

import type { AuditAction } from "./audit-actions";
import { recordAudit } from "./record-audit";
import type { Actor } from "./types";

export type PostModerationAction = "edit" | "hide" | "unhide" | "resolve";

export interface PostModeration {
  action: PostModerationAction;
  userReason: string;
  staffMemo: string;
}

export type PostModerationResult =
  | { ok: true }
  | { ok: false; conflict: { action: AuditAction; by: string; at: Date } | null };

const AUDIT_ACTION = {
  edit: "구인 수정 요청",
  hide: "구인 숨김",
  unhide: "구인 숨김 해제",
  resolve: "신고 처리 완료",
} as const satisfies Record<PostModerationAction, AuditAction>;

const POST_AUDIT_ACTIONS: AuditAction[] = Object.values(AUDIT_ACTION);

// 구인 조치 확정. 무엇을 확정하든 그 구인의 처리 안 된 신고는 모두 처리됨으로 바뀐다.
// 이미 상태가 바뀐 구인이면 아무것도 바꾸지 않고, 마지막으로 처리한 조치를 충돌로 돌려준다.
// ponytail: GM 알림(수정 요청·숨김)은 아직 보내지 않는다. 알림 경로가 정해지면 여기서 보낸다.
export async function moderatePost(
  id: string,
  actor: Actor,
  moderation: PostModeration,
): Promise<PostModerationResult> {
  return db.transaction(async (tx) => {
    // 같은 구인에 대한 조치를 한 줄로 세운다. 두 운영진이 동시에 눌러도 뒤의 사람은 바뀐 상태를 본다.
    const [game] = await tx
      .select({ title: games.title, hiddenAt: games.hiddenAt, gm: profiles.username })
      .from(games)
      .innerJoin(profiles, eq(profiles.id, games.gmId))
      .where(eq(games.id, id))
      .for("update", { of: games });
    if (!game) throw new Error("구인을 찾을 수 없습니다");
    const unresolved = await tx
      .select({ id: reports.id })
      .from(reports)
      .where(and(eq(reports.gameId, id), isNull(reports.resolvedAt)));
    const hidden = game.hiddenAt !== null;
    const stale =
      (moderation.action === "hide" && hidden) ||
      (moderation.action === "unhide" && !hidden) ||
      (moderation.action === "resolve" && unresolved.length === 0);
    if (stale) {
      const [latest] = await tx
        .select({ action: auditLog.action, at: auditLog.createdAt, by: profiles.username })
        .from(auditLog)
        .leftJoin(profiles, eq(profiles.id, auditLog.actorId))
        .where(and(eq(auditLog.targetGameId, id), inArray(auditLog.action, POST_AUDIT_ACTIONS)))
        .orderBy(desc(auditLog.createdAt))
        .limit(1);
      return {
        ok: false,
        conflict: latest
          ? { action: latest.action as AuditAction, by: latest.by ?? "알 수 없음", at: latest.at }
          : null,
      };
    }

    if (unresolved.length) {
      await tx
        .update(reports)
        .set({ resolvedBy: actor.id, resolvedAt: sql`now()` })
        .where(and(eq(reports.gameId, id), isNull(reports.resolvedAt)));
    }
    if (moderation.action === "edit") {
      await tx
        .update(games)
        .set({ editRequestedAt: sql`now()` })
        .where(eq(games.id, id));
    }
    if (moderation.action === "hide") {
      await tx
        .update(games)
        .set({ hiddenAt: sql`now()`, hiddenBy: actor.id, hiddenReason: moderation.userReason })
        .where(eq(games.id, id));
    }
    if (moderation.action === "unhide") {
      await tx
        .update(games)
        .set({ hiddenAt: null, hiddenBy: null, hiddenReason: null })
        .where(and(eq(games.id, id), isNotNull(games.hiddenAt)));
    }

    const hiddenAfter = moderation.action === "hide" || (hidden && moderation.action !== "unhide");
    await recordAudit(tx, actor, {
      action: AUDIT_ACTION[moderation.action],
      target: `${game.title} · GM ${game.gm}`,
      targetGameId: id,
      reason: moderation.userReason || moderation.staffMemo,
      staffMemo: moderation.userReason ? moderation.staffMemo || undefined : undefined,
      before: { label: hidden ? "숨김 중" : "공개" },
      after: { label: hiddenAfter ? "숨김 중" : "공개" },
      related: unresolved.length ? [`처리 안 된 신고 ${unresolved.length}건 처리됨`] : undefined,
    });
    return { ok: true };
  });
}
