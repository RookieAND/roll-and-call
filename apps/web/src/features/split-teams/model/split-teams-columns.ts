import type { Game, NewGame } from "@roll-and-call/database";
import {
  GAME_VISIBILITY,
  PRIVATE_GAME_COLUMNS,
  privateEndDate,
} from "@roll-and-call/database/games/model";
import { omit } from "es-toolkit";

import type { SplitTeamsScheduleColumns } from "./split-teams-schedule";

// 원 구인 행을 빼는 목록 방식으로 복사한다. 뒤에 칼럼이 늘어도 모집글 내용은 저절로 따라온다.
const DROPPED_COLUMNS = ["id", "serverId", "createdAt"] as const;

const CLEARED_COLUMNS = {
  minPlayersJudgedAt: null,
  discordThreadId: null,
  notifiedAt: null,
  startNotifiedAt: null,
  reviewNotifiedAt: null,
  drawnAt: null,
  selectionFinishedAt: null,
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

// 새 구인은 언제나 지정 모집이다. 제목과 모집글은 원 구인 그대로, 정원과 일정만 GM이 정한 값이다.
export function splitTeamsColumns({
  game,
  maxPlayers,
  schedule,
}: {
  game: Game;
  maxPlayers: number;
  schedule: SplitTeamsScheduleColumns;
}): Omit<NewGame, "serverId"> {
  return {
    ...omit(game, DROPPED_COLUMNS),
    ...CLEARED_COLUMNS,
    ...PRIVATE_GAME_COLUMNS,
    ...schedule,
    visibility: GAME_VISIBILITY.private,
    maxPlayers,
    endDate: privateEndDate({ ...schedule, endDate: game.endDate }),
  };
}
