import { sessionEndAt } from "@roll-and-call/database/games/model";
import { groupBy, isNull } from "es-toolkit";

import { gameStartsAt } from "../game-starts-at";
import type { CountingSession } from "../types";
import { confirmedRoundsOf } from "./confirmed-rounds-of";
import type { ShapeContext } from "./shape-context";

// 참여 세션·불참 수를 셀 때만 필요한 가벼운 세션. 룰북·닉네임·알림 대상 같은 화면용 값은 만들지 않는다.
export function buildCountingSessions({ tables }: ShapeContext): CountingSession[] {
  const confirmedOf = groupBy(
    tables.participantRows.filter((row) => row.status === "confirmed"),
    (row) => row.gameId,
  );
  const attendanceOf = groupBy(tables.roundAttendanceRows, (row) => row.gameId);
  return tables.gameRows.map((game) => ({
    id: game.id,
    memberIds: (confirmedOf[game.id] ?? []).map((row) => row.userId),
    roundCount: game.roundCount,
    confirmedRounds: confirmedRoundsOf({
      roundCount: game.roundCount,
      rows: attendanceOf[game.id] ?? [],
    }),
    startsAt: gameStartsAt(game),
    endsAt: sessionEndAt(game),
    cancelled: !isNull(game.cancelledAt),
    hidden: game.hiddenAt ? true : undefined,
  }));
}
