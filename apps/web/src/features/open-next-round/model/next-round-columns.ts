import type { Game, NewGame } from "@roll-and-call/database";
import { omit } from "es-toolkit";

// 원 구인 행을 빼는 목록 방식으로 복사한다. 뒤에 칼럼이 늘어도 구인 정보는 저절로 따라온다.
const DROPPED_COLUMNS = ["id", "serverId", "createdAt"] as const;

const CLEARED_COLUMNS = {
  discordThreadId: null,
  notifiedAt: null,
  drawnAt: null,
  attendanceConfirmedAt: null,
  attendanceFirstConfirmedAt: null,
  endedAt: null,
  capacityRaisedAt: null,
  hiddenAt: null,
  hiddenBy: null,
  hiddenReason: null,
  cancelledAt: null,
  cancelledBy: null,
  cancelKind: null,
  cancelReason: null,
} as const satisfies Partial<NewGame>;

export function nextRoundColumns({
  game,
  endDate,
  rangeStart,
  rangeEnd,
  confirmedAt,
}: {
  game: Game;
  endDate: Date;
  rangeStart: string | null;
  rangeEnd: string | null;
  confirmedAt: Date | null;
}): Omit<NewGame, "serverId"> {
  return {
    ...omit(game, DROPPED_COLUMNS),
    ...CLEARED_COLUMNS,
    endDate,
    rangeStart,
    rangeEnd,
    confirmedAt,
  };
}
