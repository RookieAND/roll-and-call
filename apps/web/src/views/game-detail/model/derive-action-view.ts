export const GAME_ACTION_VIEW = {
  confirmed: "confirmed",
  confirmedWaiting: "confirmed-waiting",
  gmCoordinate: "gm-coordinate",
  gmFixed: "gm-fixed",
  gmConfirm: "gm-confirm",
  waiting: "waiting",
  joined: "joined",
  closed: "closed",
  anon: "anon",
  joinable: "joinable",
} as const;
export type GameActionView = (typeof GAME_ACTION_VIEW)[keyof typeof GAME_ACTION_VIEW];

// 순서가 곧 우선순위: 확정 > GM > 대기 > 참여중 > 마감 > 비로그인 > 참여가능.
// 이미 들어와 있는 뷰어(대기·참여)는 모집이 마감돼도 일정 조율을 이어가야 하므로 마감보다 앞선다.
export function deriveActionView({
  sessionConfirmed,
  isGm,
  isCoordinate,
  deadlinePassed,
  isWaiting,
  isClosed,
  isSignedIn,
  viewerConfirmed,
}: {
  sessionConfirmed: boolean;
  isGm: boolean;
  isCoordinate: boolean;
  deadlinePassed: boolean;
  isWaiting: boolean;
  isClosed: boolean;
  isSignedIn: boolean;
  viewerConfirmed: boolean;
}): GameActionView {
  if (sessionConfirmed) {
    return isWaiting ? GAME_ACTION_VIEW.confirmedWaiting : GAME_ACTION_VIEW.confirmed;
  }
  if (isGm) {
    if (!isCoordinate) return GAME_ACTION_VIEW.gmFixed;
    return deadlinePassed ? GAME_ACTION_VIEW.gmConfirm : GAME_ACTION_VIEW.gmCoordinate;
  }
  if (isWaiting) return GAME_ACTION_VIEW.waiting;
  if (viewerConfirmed) return GAME_ACTION_VIEW.joined;
  if (isClosed) return GAME_ACTION_VIEW.closed;
  if (!isSignedIn) return GAME_ACTION_VIEW.anon;
  return GAME_ACTION_VIEW.joinable;
}
