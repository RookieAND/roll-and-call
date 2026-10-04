import { isNil } from "es-toolkit";

import { isDeadlinePassed, PARTICIPANT_STATUS, SCHEDULE_MODE } from "@/entities/game";
import type { MonthSessionRow } from "@/shared/server";

export type CalendarSession = ReturnType<typeof toCalendarSessions>[number];

// 시간이 정해진 세션은 모집 중이어도 달력에 오른다. 일시 지정형이 아무도 없이 마감되면(무산) 세션 뒤에도 뺀다.
// 취소된 구인은 날짜 목록의 흐린 카드로만 쓰도록 cancelled로 표시해 넘긴다.
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
    const cancelled = !isNil(game.cancelledAt);
    const players = game.participants
      .filter((participant) => participant.status === PARTICIPANT_STATUS.confirmed)
      .map((participant) => participant.user);
    const lapsed =
      game.scheduleMode === SCHEDULE_MODE.fixed &&
      players.length === 0 &&
      isDeadlinePassed(game.endDate, now);
    if (!cancelled && lapsed) return [];

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
        cancelled,
      },
    ];
  });
}
