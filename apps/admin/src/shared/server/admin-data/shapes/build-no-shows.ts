import { ABSENCE_ADDED_TAG_LABEL } from "@roll-and-call/database/games/model";
import { isNull } from "es-toolkit";

import { isAbsenceAddedTag } from "@/shared/lib";

import { noShowId } from "../no-show-id";
import type { NoShow } from "../types";
import type { ShapeContext } from "./shape-context";

export function buildNoShows({ tables, nicknameOf }: ShapeContext): NoShow[] {
  const attendanceConfirmedAt = new Map(
    tables.gameRows.map((game) => [game.id, game.attendanceConfirmedAt]),
  );
  return tables.participantRows
    .filter((row) => row.absent && attendanceConfirmedAt.get(row.gameId))
    .map((row) => ({
      id: noShowId(row.gameId, row.userId),
      userId: row.userId,
      sessionId: row.gameId,
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
