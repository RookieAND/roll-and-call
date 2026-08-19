import type { Game } from "@/shared/api/db";
import { GAME_STATUS, type GameStatus } from "./status";

// 확정 = 정원이 다 찬 상태(사람이 다 모임), 세션 시간 확정(confirmedAt)과는 별개.
// 마감 = 모집 기한이 지난 상태. 기한 경과가 정원보다 우선한다.
export function deriveGameStatus({
  maxPlayers,
  endDate,
  participantCount,
}: {
  maxPlayers: Game["maxPlayers"];
  endDate: Game["endDate"];
  participantCount: number;
}): GameStatus {
  const expired = new Date(endDate).getTime() < Date.now();
  if (expired) return GAME_STATUS.closed;
  const full = participantCount >= maxPlayers;
  return full ? GAME_STATUS.confirmed : GAME_STATUS.recruiting;
}
