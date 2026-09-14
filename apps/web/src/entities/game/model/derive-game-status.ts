import type { Game } from "@/shared/server";
import { GAME_STATUS, type GameStatus } from "./status";

// 확정 = 정원이 다 찬 상태(사람이 다 모임), 세션 시간 확정(confirmedAt)과는 별개.
// 마감 = 모집 기한이 지난 상태. 기한 경과가 정원보다 우선한다.
// 가득 참 = 대기 신청을 끈 게임이 정원을 채운 상태. 신청은 막히지만 기한 전이라 목록·조율은 그대로다.
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
