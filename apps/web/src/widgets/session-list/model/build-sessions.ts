import { isNull } from "es-toolkit";

import { PARTICIPANT_STATUS, SESSION_ROLE, type SessionRole } from "@/entities/game";

import {
  SESSION_CHIP,
  type MySessions,
  type SessionContext,
  type SessionGame,
} from "./session-card-model";
import { toSessionCard } from "./to-session-card";

// 종료 카드의 sortKey는 부호가 뒤집혀 있다.
export function buildSessions({
  hosted,
  joined,
  ...context
}: SessionContext & { hosted: SessionGame[]; joined: SessionGame[] }): MySessions {
  const now = context.now ?? new Date();
  // 세션이 시작됐는데 아직 대기라면 끝내 참여하지 못한 것이라 이력에 남기지 않는다.
  const missed = (game: SessionGame) =>
    !isNull(game.confirmedAt) &&
    new Date(game.confirmedAt) <= now &&
    game.participants.some(
      (participant) =>
        participant.userId === context.viewerId &&
        participant.status === PARTICIPANT_STATUS.waiting,
    );
  const byRole = (games: SessionGame[], role: SessionRole) =>
    games
      .map((game) => toSessionCard({ game, role, context }))
      .toSorted(
        (left, right) =>
          Number(left.chip === SESSION_CHIP.ended) - Number(right.chip === SESSION_CHIP.ended) ||
          left.sortKey - right.sortKey,
      );

  return {
    [SESSION_ROLE.player]: byRole(
      joined.filter((game) => !missed(game)),
      SESSION_ROLE.player,
    ),
    [SESSION_ROLE.host]: byRole(hosted, SESSION_ROLE.host),
  };
}
