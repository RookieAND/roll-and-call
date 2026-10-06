import type { Game, NewGame } from "@roll-and-call/database";
import { omit } from "es-toolkit";

// 원 구인 행을 빼는 목록 방식으로 복사한다. 뒤에 칼럼이 늘어도 구인 정보는 저절로 따라온다.
const DROPPED_COLUMNS = ["id", "serverId", "createdAt"] as const;

const CLEARED_COLUMNS = {
  // 새 회차는 최소 인원 없이 시작한다. 이전 회차의 값과 판정 표시를 이어받지 않는다.
  minPlayers: null,
  minPlayersJudgedAt: null,
  discordThreadId: null,
  notifiedAt: null,
  drawnAt: null,
  attendanceConfirmedAt: null,
  attendanceFirstConfirmedAt: null,
  endedAt: null,
  capacityRaisedAt: null,
  hiddenAt: null,
  hiddenBy: null,
  hiddenReasonCode: null,
  hiddenReasonText: null,
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
