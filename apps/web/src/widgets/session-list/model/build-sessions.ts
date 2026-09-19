import { SESSION_ROLE, type SessionRole } from "@/entities/game";

import {
  SESSION_CHIP,
  type MySessions,
  type SessionContext,
  type SessionGame,
} from "./session-card-model";
import { toSessionCard } from "./to-session-card";

// 진행 중은 가까운 것부터, 종료은 그 뒤에 최근 것부터(종료 카드의 sortKey는 부호가 뒤집혀 있다).
export function buildSessions({
  hosted,
  joined,
  ...context
}: SessionContext & { hosted: SessionGame[]; joined: SessionGame[] }): MySessions {
  const byRole = (games: SessionGame[], role: SessionRole) =>
    games
      .map((game) => toSessionCard(game, role, context))
      .toSorted(
        (left, right) =>
          Number(left.chip === SESSION_CHIP.ended) - Number(right.chip === SESSION_CHIP.ended) ||
          left.sortKey - right.sortKey,
      );

  return {
    [SESSION_ROLE.player]: byRole(joined, SESSION_ROLE.player),
    [SESSION_ROLE.host]: byRole(hosted, SESSION_ROLE.host),
  };
}
