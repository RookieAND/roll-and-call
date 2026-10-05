import { and, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { isNotNil } from "es-toolkit";

import { db } from "#/client";
import { cancelGame } from "#/modules/games/commands/cancel-game";
import { GAME_CANCEL_KIND } from "#/modules/games/model/game-cancel-kind";
import type { AuditAction } from "#/modules/moderation/model/audit-actions";
import type { ChosenReason } from "#/modules/moderation/model/chosen-reason";
import { CONTENT_REASON } from "#/modules/moderation/model/content-reason";
import { reasonLabel } from "#/modules/moderation/model/reason-label";
import type { Actor } from "#/modules/moderation/model/types";
import { createNotifications } from "#/modules/notifications/commands/create-notifications";
import { NOTIFICATION_KIND } from "#/modules/notifications/model/notification-kind";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { auditLog, games, profiles, type Game } from "#/schema";

import { recordAudit } from "./record-audit";

export type PostModerationAction = "hide" | "unhide" | "remove";

// 숨김 사유는 구인에 코드·글로 저장하고 GM 알림에 보이는 글로 넣는다. 구인 취소 사유는 활동 기록에만 남는다.
// 해제는 사유가 없다(null).
export interface PostModeration {
  action: PostModerationAction;
  reason: ChosenReason | null;
  staffMemo: string;
}

// 취소한 구인은 부르는 쪽이 구인 스레드에 알리도록 행을 돌려준다.
export type PostModerationResult =
  | { ok: true; cancelledGame: Game | null }
  | { ok: false; gone: true }
  | {
      ok: false;
      gone: false;
      conflict: { action: AuditAction; by: string; byId: string | null; at: Date } | null;
    };

const AUDIT_ACTION = {
  hide: "구인 숨김",
  unhide: "구인 숨김 해제",
  remove: "구인 취소",
} as const satisfies Record<PostModerationAction, AuditAction>;

const POST_AUDIT_ACTIONS: AuditAction[] = Object.values(AUDIT_ACTION);

// 구인 조치 확정. 이미 상태가 바뀐 구인이면 아무것도 바꾸지 않고, 마지막으로 처리한 조치를 충돌로 돌려준다.
// 숨김·해제는 GM의 알림 탭으로만 알린다(DM 없음). 구인 취소 알림은 cancelGame이 GM·확정자·대기자에게 만든다.
// 구인 취소는 구인을 운영진 취소로 바꾼다. 참여·대기·후기는 그대로 남는다. 끝난 세션은 취소하지 않는다.
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
  return db.transaction(async (tx) => {
    // 같은 구인에 대한 조치를 한 줄로 세운다. 두 운영진이 동시에 눌러도 뒤의 사람은 바뀐 상태를 본다.
    const [game] = await tx
      .select({
        title: games.title,
        gmId: games.gmId,
        hiddenAt: games.hiddenAt,
        cancelledAt: games.cancelledAt,
        gm: memberNicknameSql(serverId),
      })
      .from(games)
      .innerJoin(profiles, eq(profiles.id, games.gmId))
      .where(thisGame)
      .for("update", { of: games });
    if (!game) return { ok: false, gone: true };
    const hidden = isNotNil(game.hiddenAt);
    const stale =
      (moderation.action === "hide" && hidden) ||
      (moderation.action === "unhide" && !hidden) ||
      (moderation.action === "remove" && isNotNil(game.cancelledAt));
    if (stale) {
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
            eq(auditLog.targetGameId, id),
            inArray(auditLog.action, POST_AUDIT_ACTIONS),
          ),
        )
        .orderBy(desc(auditLog.createdAt))
        .limit(1);
      return {
        ok: false,
        gone: false,
        conflict: latest
          ? {
              action: latest.action as AuditAction,
              by: latest.by ?? "알 수 없음",
              byId: latest.byId,
              at: latest.at,
            }
          : null,
      };
    }

    const gameParams = { gameId: id, gameTitle: game.title };
    const reason = reasonLabel({
      code: moderation.reason?.code ?? null,
      text: moderation.reason?.text ?? null,
      reasons: CONTENT_REASON,
    });
    if (moderation.action === "hide") {
      await tx
        .update(games)
        .set({
          hiddenAt: sql`now()`,
          hiddenBy: actor.id,
          hiddenReasonCode: moderation.reason?.code,
          hiddenReasonText: moderation.reason?.text,
        })
        .where(thisGame);
      await createNotifications({
        executor: tx,
        serverId,
        actorId: actor.id,
        notifications: [
          {
            userId: game.gmId,
            kind: NOTIFICATION_KIND.gameHidden,
            params: { ...gameParams, reason },
          },
        ],
      });
    }
    if (moderation.action === "unhide") {
      await tx
        .update(games)
        .set({ hiddenAt: null, hiddenBy: null, hiddenReasonCode: null, hiddenReasonText: null })
        .where(and(thisGame, isNotNull(games.hiddenAt)));
      await createNotifications({
        executor: tx,
        serverId,
        actorId: actor.id,
        notifications: [
          { userId: game.gmId, kind: NOTIFICATION_KIND.gameUnhidden, params: gameParams },
        ],
      });
    }

    let cancelledGame: Game | null = null;
    let related: string[] | undefined;
    if (moderation.action === "remove") {
      const cancelled = await cancelGame({
        transaction: tx,
        serverId,
        gameId: id,
        kind: GAME_CANCEL_KIND.staff,
        actorId: actor.id,
        reason: null,
      });
      if (!cancelled.ok) return { ok: false, gone: false, conflict: null };
      cancelledGame = cancelled.game;
      related = [`GM·확정자·대기자 ${cancelled.notifiedCount}명 알림 탭에 알림 보냄`];
    }

    const hiddenAfter = moderation.action === "hide" || (hidden && moderation.action !== "unhide");
    const afterLabel = hiddenAfter ? "숨김 중" : "공개";
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: AUDIT_ACTION[moderation.action],
        target: `${game.title} · GM ${game.gm}`,
        targetGameId: id,
        reason: reason || moderation.staffMemo,
        staffMemo: reason ? moderation.staffMemo || undefined : undefined,
        before: { label: hidden ? "숨김 중" : "공개" },
        after: { label: moderation.action === "remove" ? "취소됨" : afterLabel },
        related,
      },
    });
    return { ok: true, cancelledGame };
  });
}
