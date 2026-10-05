import { sessionEndAt } from "#/modules/games/model/session-timing";

import { type BadgeSession } from "./badge-facts";
import { isRecognizedSession } from "./is-recognized-session";
import { isTieSession } from "./is-tie-session";

type SessionRow = {
  gameId: string;
  title: string;
  confirmedAt: Date | null;
  playMinutes: number | null;
  endedAt: Date | null;
  attendanceConfirmedAt: Date | null;
  hiddenAt: Date | null;
  cancelledAt: Date | null;
  categoryId: string | null;
  categoryName: string | null;
  attendedCount: number;
  registeredAt: Date;
};

// 확정 참여자 수는 쿼리가 이미 1명 이상으로 걸렀다. 타이만(1:1)은 업적에서 뺀다.
export function toBadgeSessions(rows: SessionRow[], now: Date): BadgeSession[] {
  return rows.flatMap((row) => {
    if (
      !isRecognizedSession({ game: row, confirmedCount: 1, now }) ||
      isTieSession(row.attendedCount)
    )
      return [];
    return [
      {
        gameId: row.gameId,
        title: row.title,
        startsAt: row.confirmedAt!,
        endsAt: sessionEndAt(row)!,
        categoryId: row.categoryId,
        categoryName: row.categoryName,
        attendedCount: row.attendedCount,
        registeredAt: row.registeredAt,
      },
    ];
  });
}
