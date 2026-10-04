import { isNull } from "es-toolkit";

import { GAME_CANCEL_KIND } from "#/modules/games/model/game-cancel-kind";
import { gameCancelledRecipients } from "#/modules/games/model/game-cancelled-recipients";
import {
  PARTICIPANT_STATUS,
  type ParticipantStatus,
} from "#/modules/games/model/participant-status";
import { isSessionStarted } from "#/modules/games/model/session-timing";
import type { Game } from "#/schema";

import type { OngoingRole } from "./ongoing-role";
import { ongoingRoleOf } from "./ongoing-role-of";

export interface MemberOngoing {
  game: Game;
  gmNickname: string;
  role: OngoingRole;
  confirmedCount: number;
  // 구인을 취소하면 알림 탭으로 알림을 받는 확정자·대기자 수(당사자인 GM은 뺀다).
  notifiedCount: number;
}

type RosterRow = { gameId: string; userId: string; status: ParticipantStatus };

// 제재·추방이 손대는 진행 중인 활동: 취소되지 않았고 세션이 시작하지 않은(일시 미정 포함) 구인 중 GM이거나 확정·대기인 것.
// 제재 페이지와 추방 영향이 이 목록을 함께 써서 두 화면 숫자가 같다.
export function pickMemberOngoing({
  userId,
  games,
  roster,
  now,
}: {
  userId: string;
  games: (Game & { gmNickname: string })[];
  roster: readonly RosterRow[];
  now: Date;
}): MemberOngoing[] {
  return games
    .filter((game) => isNull(game.cancelledAt) && !isSessionStarted(game, now))
    .flatMap(({ gmNickname, ...game }) => {
      const rows = roster.filter((row) => row.gameId === game.id);
      const own = rows.find((row) => row.userId === userId);
      const role = ongoingRoleOf({ hosted: game.gmId === userId, status: own?.status });
      if (isNull(role)) return [];
      const notified = gameCancelledRecipients({
        game,
        kind: GAME_CANCEL_KIND.staff,
        roster: rows,
      });
      return [
        {
          game,
          gmNickname,
          role,
          confirmedCount: rows.filter((row) => row.status === PARTICIPANT_STATUS.confirmed).length,
          notifiedCount: notified.filter((id) => id !== userId).length,
        },
      ];
    })
    .toSorted(
      (a, b) =>
        (a.game.confirmedAt ?? a.game.endDate).getTime() -
        (b.game.confirmedAt ?? b.game.endDate).getTime(),
    );
}
