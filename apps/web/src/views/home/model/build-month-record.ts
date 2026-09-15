import { rankPeople } from "./rank-people";
import type { CalendarSession } from "./to-calendar-sessions";

export type MonthRecord = ReturnType<typeof buildMonthRecord>;

// 연 글 수가 아니라 끝난 세션 수로 센다. 무산된 세션은 세지 않는다.
export function buildMonthRecord(sessions: CalendarSession[]) {
  const finished = sessions.filter((session) => session.finished);
  return {
    finishedCount: finished.length,
    gms: rankPeople(finished.map((session) => session.gm)),
    players: rankPeople(finished.flatMap((session) => session.players)),
  };
}
