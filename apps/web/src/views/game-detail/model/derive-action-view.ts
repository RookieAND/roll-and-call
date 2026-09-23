export const GAME_ACTION_VIEW = {
  anon: "anon",
  joinable: "joinable",
  full: "full",
  applied: "applied",
  waiting: "waiting",
  joined: "joined",
  scheduled: "scheduled",
  outsider: "outsider",
  gm: "gm",
  ended: "ended",
  endedOutsider: "endedOutsider",
  endedGm: "endedGm",
} as const;
export type GameActionView = (typeof GAME_ACTION_VIEW)[keyof typeof GAME_ACTION_VIEW];

// 순서가 곧 우선순위: GM > 세션 종료 > 대기 > 일정 확정 > 참여 > 마감 > 비로그인 > 정원 참 > 접수 가능.
// 이미 들어와 있는 뷰어(대기·참여)는 모집이 마감돼도 자기 상태를 이어 가므로 마감보다 앞선다.
// 일정 확정 안내는 그 세션에 낀 사람의 것이다. 안 낀 사람에게는 끝난 모집이다.
export function deriveActionView({
  isGm,
  isSignedIn,
  viewerConfirmed,
  viewerWaiting,
  isLottery,
  drawn,
  canLeave,
  sessionConfirmed,
  sessionEnded,
  isClosed,
  isFull,
}: {
  isGm: boolean;
  isSignedIn: boolean;
  viewerConfirmed: boolean;
  viewerWaiting: boolean;
  isLottery: boolean;
  drawn: boolean;
  // leaveGame과 같은 규칙: 확정자는 정원 충족·기한 경과 뒤 스스로 취소할 수 없다.
  canLeave: boolean;
  sessionConfirmed: boolean;
  sessionEnded: boolean;
  isClosed: boolean;
  isFull: boolean;
}): GameActionView {
  if (isGm) return sessionEnded ? GAME_ACTION_VIEW.endedGm : GAME_ACTION_VIEW.gm;
  // 끝난 세션에 대기로 남아 있던 사람은 참여하지 않은 사람과 같다.
  if (sessionEnded)
    return viewerConfirmed ? GAME_ACTION_VIEW.ended : GAME_ACTION_VIEW.endedOutsider;
  // 추첨 발표 전 신청자는 대기로 저장되지만 순번이 없다.
  if (viewerWaiting) {
    return isLottery && !drawn ? GAME_ACTION_VIEW.applied : GAME_ACTION_VIEW.waiting;
  }
  if (sessionConfirmed) {
    return viewerConfirmed ? GAME_ACTION_VIEW.scheduled : GAME_ACTION_VIEW.outsider;
  }
  if (viewerConfirmed) return canLeave ? GAME_ACTION_VIEW.applied : GAME_ACTION_VIEW.joined;
  if (isClosed) return GAME_ACTION_VIEW.outsider;
  if (!isSignedIn) return GAME_ACTION_VIEW.anon;
  // 추첨은 정원과 무관하게 마감까지 신청을 받아 정원 참 상태가 없다.
  if (isFull && !isLottery) return GAME_ACTION_VIEW.full;
  return GAME_ACTION_VIEW.joinable;
}
