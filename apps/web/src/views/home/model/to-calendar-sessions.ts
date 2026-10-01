import { countsAsAttended } from "@roll-and-call/database/rules";

import { deriveSessionState, PARTICIPANT_STATUS, SESSION_STATE } from "@/entities/game";
import type { MonthSessionRow } from "@/shared/server";

export type CalendarSession = ReturnType<typeof toCalendarSessions>[number];

// 시간이 정해진 세션은 모집 중이어도 달력에 오른다. 아무도 오지 않고 마감된 세션만 뺀다.
export function toCalendarSessions({
  rows,
  viewerId,
  now = new Date(),
}: {
  rows: MonthSessionRow[];
  viewerId: string | null;
  now?: Date;
}) {
  return rows.flatMap((game) => {
    if (!game.confirmedAt) return [];
    const confirmed = game.participants.filter(
      (participant) => participant.status === PARTICIPANT_STATUS.confirmed,
    );
    const players = confirmed.map((participant) => participant.user);
    // 이 달의 기록은 뱃지와 같이 출석 확인에서 불참으로 적힌 사람을 세지 않는다.
    const attendees = confirmed.filter(countsAsAttended).map((participant) => participant.user);
    const state = deriveSessionState({ ...game, confirmedCount: players.length }, now);
    if (state === SESSION_STATE.closed) return [];

    return [
      {
        id: game.id,
        title: game.title,
        rule: game.rule,
        startsAt: game.confirmedAt,
        maxPlayers: game.maxPlayers,
        gm: game.gm,
        players,
        attendees,
        mine: viewerId === game.gmId || players.some((player) => player.id === viewerId),
        finished: state === SESSION_STATE.finished && players.length > 0,
      },
    ];
  });
}
