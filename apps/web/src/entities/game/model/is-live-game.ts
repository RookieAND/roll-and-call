import { GAME_STATUS, type GameStatus } from "@/shared/lib";

// 구인 목록 "진행 중" 탭의 기준(서버 game-bucket-sql과 같다): 지금 신청할 수 있고 세션이 끝나지 않았다.
export function isLiveGame({ status, ended }: { status: GameStatus; ended: boolean }) {
  return !ended && (status === GAME_STATUS.recruiting || status === GAME_STATUS.confirmed);
}
