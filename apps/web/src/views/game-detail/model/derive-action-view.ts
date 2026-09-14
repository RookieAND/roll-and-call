export type GameActionView =
  | "confirmed" // 1: 세션 확정(누구든)
  | "confirmed-waiting" // 1-w: 세션 확정 + 뷰어가 대기자
  | "gm-coordinate" // GM-a: 범위 조율 · 잠기기 전
  | "gm-fixed" // GM-b: 일시 지정 · 세션 전
  | "gm-confirm" // GM-c: 범위 조율 · 기한 지남 · 미확정
  | "waiting" // 2: 대기자 · 확정 전
  | "joined" // 3/4: 참여 확정
  | "closed" // 5: 미신청 · 신청이 막힘
  | "anon" // 6: 비로그인
  | "joinable"; // 7: 참여(정원 초과면 대기) 신청 가능

// 하단 액션 바에서 무엇을 보여줄지 결정하는 우선순위 체인. 순서가 곧 우선순위다.
// 확정 > GM > 대기 > 참여중 > 마감 > 비로그인 > 참여가능.
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
  if (sessionConfirmed) return isWaiting ? "confirmed-waiting" : "confirmed";
  if (isGm) {
    if (!isCoordinate) return "gm-fixed";
    return deadlinePassed ? "gm-confirm" : "gm-coordinate";
  }
  if (isWaiting) return "waiting";
  if (viewerConfirmed) return "joined";
  if (isClosed) return "closed";
  if (!isSignedIn) return "anon";
  return "joinable";
}
