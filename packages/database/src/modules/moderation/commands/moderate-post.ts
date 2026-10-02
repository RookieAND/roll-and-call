import { and, desc, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";
import { isNotNil } from "es-toolkit";

import { db } from "../../../client";
import { auditLog, games, profiles, reports } from "../../../schema";
import type { AuditAction } from "../model/audit-actions";
import type { Actor } from "../model/types";
import { recordAudit } from "./record-audit";

export type PostModerationAction = "hide" | "unhide" | "resolve" | "remove";

// 제거의 userReason은 고른 사유 이름이다.
export interface PostModeration {
  action: PostModerationAction;
  userReason: string;
  staffMemo: string;
}

export type PostModerationResult =
  | { ok: true }
  | { ok: false; conflict: { action: AuditAction; by: string; at: Date } | null };

const AUDIT_ACTION = {
  hide: "구인 숨김",
  unhide: "구인 숨김 해제",
  resolve: "신고 처리 완료",
  remove: "구인 제거",
} as const satisfies Record<PostModerationAction, AuditAction>;

const POST_AUDIT_ACTIONS: AuditAction[] = Object.values(AUDIT_ACTION);

// 구인 조치 확정. 무엇을 확정하든 그 구인의 처리 안 된 신고는 모두 처리됨으로 바뀐다.
// 이미 상태가 바뀐 구인이면 아무것도 바꾸지 않고, 마지막으로 처리한 조치를 충돌로 돌려준다.
// 제거는 구인 행을 지워 참여·대기·후기·신고가 cascade로 함께 지워진다. 활동 기록은 target 글자로 남는다.
// ponytail: GM 알림(숨김·제거)은 아직 보내지 않는다. 알림 경로가 정해지면 여기서 보낸다.
export async function moderatePost({
  serverId,
  id,
  actor,
  moderation,
}: {
  serverId: string;
  id: string;
  actor: Actor;
  moderation: PostModeration;
}): Promise<PostModerationResult> {
  const thisGame = and(eq(games.serverId, serverId), eq(games.id, id));
  const openReports = and(
    eq(reports.serverId, serverId),
    eq(reports.gameId, id),
    isNull(reports.resolvedAt),
  );
  return db.transaction(async (tx) => {
    // 같은 구인에 대한 조치를 한 줄로 세운다. 두 운영진이 동시에 눌러도 뒤의 사람은 바뀐 상태를 본다.
    const [game] = await tx
      .select({ title: games.title, hiddenAt: games.hiddenAt, gm: profiles.username })
      .from(games)
      .innerJoin(profiles, eq(profiles.id, games.gmId))
      .where(thisGame)
      .for("update", { of: games });
    // 다른 운영진이 먼저 제거했으면 구인 행이 없다.
    if (!game) return { ok: false, conflict: null };
    const unresolved = await tx.select({ id: reports.id }).from(reports).where(openReports);
    const hidden = isNotNil(game.hiddenAt);
    const stale =
      (moderation.action === "hide" && hidden) ||
      (moderation.action === "unhide" && !hidden) ||
      (moderation.action === "resolve" && unresolved.length === 0);
    if (stale) {
      const [latest] = await tx
        .select({ action: auditLog.action, at: auditLog.createdAt, by: profiles.username })
        .from(auditLog)
        .leftJoin(profiles, eq(profiles.id, auditLog.actorId))
        .where(
          and(
            eq(auditLog.serverId, serverId),
            eq(auditLog.targetGameId, id),
            inArray(auditLog.action, POST_AUDIT_ACTIONS),
          ),
        )
        .orderBy(desc(auditLog.createdAt))
        .limit(1);
      return {
        ok: false,
        conflict: latest
          ? { action: latest.action as AuditAction, by: latest.by ?? "알 수 없음", at: latest.at }
          : null,
      };
    }

    if (unresolved.length && moderation.action !== "remove") {
      await tx
        .update(reports)
        .set({ resolvedBy: actor.id, resolvedAt: sql`now()` })
        .where(openReports);
    }
    if (moderation.action === "hide") {
      await tx
        .update(games)
        .set({ hiddenAt: sql`now()`, hiddenBy: actor.id, hiddenReason: moderation.userReason })
        .where(thisGame);
    }
    if (moderation.action === "unhide") {
      await tx
        .update(games)
        .set({ hiddenAt: null, hiddenBy: null, hiddenReason: null })
        .where(and(thisGame, isNotNull(games.hiddenAt)));
    }

    const hiddenAfter = moderation.action === "hide" || (hidden && moderation.action !== "unhide");
    const afterLabel = hiddenAfter ? "숨김 중" : "공개";
    // 제거하면 구인 행이 사라져 target_game_id는 FK(on delete set null)로 비워진다.
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: AUDIT_ACTION[moderation.action],
        target: `${game.title} · GM ${game.gm}`,
        targetGameId: id,
        reason: moderation.userReason || moderation.staffMemo,
        staffMemo: moderation.userReason ? moderation.staffMemo || undefined : undefined,
        before: { label: hidden ? "숨김 중" : "공개" },
        after: { label: moderation.action === "remove" ? "제거됨" : afterLabel },
        related: unresolved.length ? [`처리 안 된 신고 ${unresolved.length}건 처리됨`] : undefined,
      },
    });
    if (moderation.action === "remove") await tx.delete(games).where(thisGame);
    return { ok: true };
  });
}
