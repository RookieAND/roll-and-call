import { and, eq, isNotNull, or, sql } from "drizzle-orm";
import { isNull } from "es-toolkit";

import { db } from "#/client";
import {
  ABSENCE_ADDED_TAG,
  ABSENCE_ADDED_TAG_LABEL,
  type AbsenceAddedTag,
} from "#/modules/games/model/absence-added-tag";
import { isAbsenceActive } from "#/modules/games/model/absence-window";
import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import type { Actor } from "#/modules/moderation/model/types";
import { NOTIFICATION_KIND } from "#/modules/notifications/model/notification-kind";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { games, participants, profiles } from "#/schema";

import { loadNoShowParties } from "./load-no-show-parties";
import { NO_SHOW_NOTIFIED, notifyNoShowParties } from "./notify-no-show-parties";
import { recordAudit } from "./record-audit";

const REASON_MAX = 200;

export const ADD_NO_SHOW_FAILURE = { notEligible: "notEligible", conflict: "conflict" } as const;

export type AddNoShowResult =
  | { ok: true }
  | { ok: false; reason: typeof ADD_NO_SHOW_FAILURE.notEligible }
  | {
      ok: false;
      reason: typeof ADD_NO_SHOW_FAILURE.conflict;
      conflict: { by: string; byId: string | null; at: Date } | null;
    };

// 운영진이 참석으로 기록된 참여자를 불참으로 바꾼다(D209). 출석이 확정되고 세션 시작 30일 안인 구인만 된다.
// 불참이 취소된 사람도 다시 불참으로 남기고 취소 흔적은 지운다.
export async function addNoShow({
  serverId,
  gameId,
  userId,
  actor,
  tag,
  reason,
}: {
  serverId: string;
  gameId: string;
  userId: string;
  actor: Actor;
  tag: AbsenceAddedTag;
  reason: string;
}): Promise<AddNoShowResult> {
  const other = tag === ABSENCE_ADDED_TAG.other;
  if (!Object.values(ABSENCE_ADDED_TAG).includes(tag)) throw new Error("사유를 골라 주세요");
  if (other && !reason.trim()) throw new Error("사유를 입력해 주세요");
  if (reason.trim().length > REASON_MAX) throw new Error("사유는 200자까지 쓸 수 있습니다");
  const row = and(
    eq(participants.serverId, serverId),
    eq(participants.gameId, gameId),
    eq(participants.userId, userId),
  );
  return db.transaction(async (tx) => {
    const [game] = await tx
      .select({
        confirmedAt: games.confirmedAt,
        attendanceConfirmedAt: games.attendanceConfirmedAt,
      })
      .from(games)
      .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
    const [current] = await tx
      .select({ status: participants.status })
      .from(participants)
      .where(row);
    const eligible =
      game?.confirmedAt &&
      game.attendanceConfirmedAt &&
      isAbsenceActive({ sessionStartsAt: game.confirmedAt, now: new Date() }) &&
      current?.status === PARTICIPANT_STATUS.confirmed;
    if (!eligible) return { ok: false, reason: ADD_NO_SHOW_FAILURE.notEligible };

    const added = await tx
      .update(participants)
      .set({
        absent: true,
        absenceCancelledAt: null,
        absenceCancelledBy: null,
        absenceCancelReason: null,
        absenceAddedAt: sql`now()`,
        absenceAddedBy: actor.id,
        absenceAddedTag: tag,
        absenceAddedReason: other ? reason.trim() : null,
      })
      .where(
        and(
          row,
          eq(participants.status, PARTICIPANT_STATUS.confirmed),
          or(eq(participants.absent, false), isNotNull(participants.absenceCancelledAt)),
        ),
      )
      .returning({ userId: participants.userId });
    if (added.length === 0) {
      // 그사이 불참이 됐다. 운영진이 추가했으면 그 사람, 아니면 출석을 확정한 GM이 처리자다.
      const [state] = await tx
        .select({
          addedAt: participants.absenceAddedAt,
          addedBy: participants.absenceAddedBy,
          addedByName: memberNicknameSql(serverId),
        })
        .from(participants)
        .leftJoin(profiles, eq(profiles.id, participants.absenceAddedBy))
        .where(row);
      const addedConflict =
        state?.addedAt && !isNull(state.addedBy)
          ? { by: state.addedByName ?? "알 수 없음", byId: state.addedBy, at: state.addedAt }
          : null;
      return { ok: false, reason: ADD_NO_SHOW_FAILURE.conflict, conflict: addedConflict };
    }

    const parties = await loadNoShowParties({ tx, serverId, gameId, userId });
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "불참 기록 추가",
        target: `${parties.nickname} · ${parties.title}`,
        targetUserId: userId,
        targetGameId: gameId,
        reason: other ? reason.trim() : ABSENCE_ADDED_TAG_LABEL[tag],
        before: { label: "참석" },
        after: { label: "유효" },
        related: [NO_SHOW_NOTIFIED],
      },
    });
    await notifyNoShowParties({
      tx,
      serverId,
      actorId: actor.id,
      kind: NOTIFICATION_KIND.absenceAddedByStaff,
      gameId,
      gameTitle: parties.title,
      userId,
      gmId: parties.gmId,
    });
    return { ok: true };
  });
}
