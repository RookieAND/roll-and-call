import { rankPeople } from "./rank-people";
import type { CalendarSession } from "./to-calendar-sessions";

export type MonthRecord = ReturnType<typeof buildMonthRecord>;

// 끝난 세션만이 아니라 이 달에 열린 세션 전부로 센다. 무산된 세션은 달력에서 이미 빠져 있다.
export function buildMonthRecord(sessions: CalendarSession[]) {
  return {
    sessionCount: sessions.length,
    gms: rankPeople(sessions.map((session) => session.gm)),
    players: rankPeople(sessions.flatMap((session) => session.players)),
  };
}
