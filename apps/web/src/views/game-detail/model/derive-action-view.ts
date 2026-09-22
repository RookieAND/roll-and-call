export const GAME_ACTION_VIEW = {
  confirmed: "confirmed",
  gm: "gm",
  waiting: "waiting",
  joined: "joined",
  closed: "closed",
  anon: "anon",
  joinable: "joinable",
} as const;
export type GameActionView = (typeof GAME_ACTION_VIEW)[keyof typeof GAME_ACTION_VIEW];

// 순서가 곧 우선순위: GM > 대기 > 확정 > 참여중 > 마감 > 비로그인 > 참여가능.
// GM은 확정 뒤에도 운영 관리로 가야 하고, 이미 들어와 있는 뷰어(대기·참여)는 모집이 마감돼도
// 일정 조율을 이어가야 하므로 마감보다 앞선다.
// "확정"은 그 세션에 낀 사람에게만 해당한다. 안 낀 사람에게 확정 안내를 띄우면
// 오지도 않을 알림을 약속하게 되고, 새로 신청할 수 없다는 사실도 가려진다.
export function deriveActionView({
  sessionConfirmed,
  isGm,
  isWaiting,
  isClosed,
  isSignedIn,
  viewerConfirmed,
}: {
  sessionConfirmed: boolean;
  isGm: boolean;
  isWaiting: boolean;
  isClosed: boolean;
  isSignedIn: boolean;
  viewerConfirmed: boolean;
}): GameActionView {
  if (isGm) return GAME_ACTION_VIEW.gm;
  // 대기자는 세션이 확정돼도 같은 대기 바를 본다. 순번과 대기 취소는 그대로다.
  if (isWaiting) return GAME_ACTION_VIEW.waiting;
  if (sessionConfirmed) {
    return viewerConfirmed ? GAME_ACTION_VIEW.confirmed : GAME_ACTION_VIEW.closed;
  }
  if (viewerConfirmed) return GAME_ACTION_VIEW.joined;
  if (isClosed) return GAME_ACTION_VIEW.closed;
  if (!isSignedIn) return GAME_ACTION_VIEW.anon;
  return GAME_ACTION_VIEW.joinable;
}
