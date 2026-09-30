import { and, eq } from "drizzle-orm";

import { db } from "../client";
import { BADGE_ROLE, isRecognizedSession, type MonthlyAppearance } from "../rules";
import { games, participants } from "../schema";
import { attendedWhere } from "./attended-where";
import { recognizedGamesWhere } from "./recognized-games-where";

// ponytail: 전체 인정 세션을 한 번에 읽는다. 세션이 수만 건이 되면 달 단위 집계 쿼리로 바꾼다.
export async function loadMonthlyAppearances(now: Date = new Date()): Promise<MonthlyAppearance[]> {
  const gameColumns = {
    confirmedAt: games.confirmedAt,
    playMinutes: games.playMinutes,
    attendanceConfirmedAt: games.attendanceConfirmedAt,
    hiddenAt: games.hiddenAt,
  };
  const [hosted, played] = await Promise.all([
    db
      .select({ userId: games.gmId, ...gameColumns })
      .from(games)
      .where(recognizedGamesWhere),
    db
      .select({ userId: participants.userId, ...gameColumns })
      .from(participants)
      .innerJoin(games, eq(games.id, participants.gameId))
      .where(and(attendedWhere, recognizedGamesWhere)),
  ]);
  const toAppearances = (rows: typeof hosted, role: MonthlyAppearance["role"]) =>
    rows
      .filter((row) => isRecognizedSession(row, 1, now))
      .map((row) => ({ userId: row.userId, role, startsAt: row.confirmedAt! }));
  return [...toAppearances(hosted, BADGE_ROLE.gm), ...toAppearances(played, BADGE_ROLE.player)];
}
