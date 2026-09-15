import { deriveSessionState, PARTICIPANT_STATUS, SESSION_STATE } from "@/entities/game";
import type { MonthSessionRow } from "@/shared/server";

export type CalendarSession = ReturnType<typeof toCalendarSessions>[number];

// 확정 일시가 있는 세션만 달력에 오른다. 아무도 오지 않고 마감된 세션은 뺀다.
export function toCalendarSessions(
  rows: MonthSessionRow[],
  viewerId: string | null,
  now: Date = new Date(),
) {
  return rows.flatMap((game) => {
    if (!game.confirmedAt) return [];
    const players = game.participants
      .filter((participant) => participant.status === PARTICIPANT_STATUS.confirmed)
      .map((participant) => participant.user);
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
        mine: viewerId === game.gmId || players.some((player) => player.id === viewerId),
        finished: state === SESSION_STATE.finished && players.length > 0,
      },
    ];
  });
}
