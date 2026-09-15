import type { Game } from "@/shared/server";

import { GAME_STATUS, type GameStatus } from "./status";

// confirmed는 정원 충족이지 세션 시간 확정(confirmedAt)이 아니다. 기한 경과가 정원보다 우선하고, 대기 신청을 끈 게임의 정원 충족은 full.
export function deriveGameStatus({
  maxPlayers,
  endDate,
  participantCount,
  waitlistEnabled,
}: {
  maxPlayers: Game["maxPlayers"];
  endDate: Game["endDate"];
  participantCount: number;
  waitlistEnabled: Game["waitlistEnabled"];
}): GameStatus {
  const expired = new Date(endDate).getTime() < Date.now();
  if (expired) return GAME_STATUS.closed;
  const full = participantCount >= maxPlayers;
  if (!full) return GAME_STATUS.recruiting;
  return waitlistEnabled ? GAME_STATUS.confirmed : GAME_STATUS.full;
}
