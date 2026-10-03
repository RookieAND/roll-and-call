import { sessionEndsAt } from "../../games/model/session-ends-at";
import { type BadgeSession } from "./badge-facts";
import { isRecognizedSession } from "./is-recognized-session";

type SessionRow = {
  gameId: string;
  title: string;
  confirmedAt: Date | null;
  playMinutes: number | null;
  attendanceConfirmedAt: Date | null;
  hiddenAt: Date | null;
  cancelledAt: Date | null;
  categoryId: string | null;
  categoryName: string | null;
};

// 확정 참여자 수는 쿼리가 이미 1명 이상으로 걸렀다.
export function toBadgeSessions(rows: SessionRow[], now: Date): BadgeSession[] {
  return rows.flatMap((row) => {
    if (!isRecognizedSession({ game: row, confirmedCount: 1, now })) return [];
    return [
      {
        gameId: row.gameId,
        title: row.title,
        startsAt: row.confirmedAt!,
        endsAt: sessionEndsAt({ startsAt: row.confirmedAt!, playMinutes: row.playMinutes }),
        categoryId: row.categoryId,
        categoryName: row.categoryName,
      },
    ];
  });
}
