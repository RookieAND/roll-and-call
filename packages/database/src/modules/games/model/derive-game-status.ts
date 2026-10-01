import { GAME_STATUS, type GameStatus } from "./game-status";

// confirmed는 정원 충족이지 세션 시간 확정(confirmedAt)이 아니다. 조율형은 일정을 확정하면 정원·기한과 상관없이 신청을 막아(isSessionLocked) scheduled가 가장 앞선다.
// 일시 지정형의 confirmedAt은 등록 때부터 있는 시각이라 보지 않는다. 기한 경과가 정원보다 우선하고, 대기 신청을 끈 게임의 정원 충족은 full.
export function deriveGameStatus({
  maxPlayers,
  endDate,
  participantCount,
  waitlistEnabled,
  scheduleMode,
  confirmedAt,
}: {
  maxPlayers: number;
  endDate: Date | string;
  participantCount: number;
  waitlistEnabled: boolean;
  scheduleMode: "fixed" | "coordinate";
  confirmedAt: Date | string | null;
}): GameStatus {
  if (scheduleMode === "coordinate" && confirmedAt !== null) return GAME_STATUS.scheduled;
  const expired = new Date(endDate).getTime() < Date.now();
  if (expired) return GAME_STATUS.closed;
  const full = participantCount >= maxPlayers;
  if (!full) return GAME_STATUS.recruiting;
  return waitlistEnabled ? GAME_STATUS.confirmed : GAME_STATUS.full;
}
