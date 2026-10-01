import { GAME_STATUS, type GameStatus } from "@roll-and-call/database/rules";

// 서버 game-bucket-sql과 같은 기준이어야 한다.
export function isLiveGame({ status, ended }: { status: GameStatus; ended: boolean }) {
  return !ended && (status === GAME_STATUS.recruiting || status === GAME_STATUS.confirmed);
}
