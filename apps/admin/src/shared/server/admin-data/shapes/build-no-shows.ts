import { ABSENCE_ADDED_TAG_LABEL } from "@roll-and-call/database/games/model";
import { isRoundKickAbsence } from "@roll-and-call/database/games/model";
import { isNull } from "es-toolkit";

import { isAbsenceAddedTag } from "@/shared/lib";

import { noShowId } from "../no-show-id";
import type { NoShow } from "../types";
import type { ShapeContext } from "./shape-context";

export function buildNoShows({ tables, nicknameOf }: ShapeContext): NoShow[] {
  const gameOf = new Map(tables.gameRows.map((game) => [game.id, game]));
  // 다회차는 출석 확정과 상관없이 불참으로 내보낸 기록만, 단발은 출석이 확정된 불참만 센다.
  const counts = (row: (typeof tables.participantRows)[number]) => {
    const game = gameOf.get(row.gameId);
    if (!game) return false;
    if (game.roundCount > 1) return isRoundKickAbsence({ ...row, absenceCancelledAt: null });
    return row.absent && Boolean(game.attendanceConfirmedAt);
  };
  return tables.participantRows.filter(counts).map((row) => ({
    id: noShowId(row.gameId, row.userId),
    userId: row.userId,
    sessionId: row.gameId,
    absenceAt: row.absenceAt ?? undefined,
    cancelled: !isNull(row.absenceCancelledAt),
    cancelledBy: row.absenceCancelledBy ? nicknameOf(row.absenceCancelledBy) : undefined,
    cancelledAt: row.absenceCancelledAt ?? undefined,
    cancelReason: row.absenceCancelReason ?? undefined,
    gmReason: row.absenceReason ?? undefined,
    added: row.absenceAddedAt
      ? {
          by: nicknameOf(row.absenceAddedBy),
          at: row.absenceAddedAt,
          reason:
            row.absenceAddedReason ??
            (isAbsenceAddedTag(row.absenceAddedTag)
              ? ABSENCE_ADDED_TAG_LABEL[row.absenceAddedTag]
              : ""),
        }
      : undefined,
  }));
}
