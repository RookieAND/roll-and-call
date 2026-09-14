export type GameActionView =
  | "confirmed" // 세션 확정됨
  | "waiting" // 뷰어가 대기자
  | "joined" // 뷰어 참여 확정
  | "closed" // 모집 마감(기한 경과)
  | "anon" // 비로그인
  | "joinable"; // 참여(정원 초과면 대기) 신청 가능

// 액션 존에서 무엇을 보여줄지 결정하는 우선순위 체인.
// 순서가 곧 우선순위다(확정 > 대기 > 참여중 > 마감 > 비로그인 > 참여가능).
// 이미 들어와 있는 뷰어(대기·참여)는 모집이 마감돼도 일정 조율을 이어가야 하므로 마감보다 앞선다.
export function deriveActionView({
  sessionConfirmed,
  isWaiting,
  isClosed,
  isSignedIn,
  viewerConfirmed,
}: {
  sessionConfirmed: boolean;
  isWaiting: boolean;
  isClosed: boolean;
  isSignedIn: boolean;
  viewerConfirmed: boolean;
}): GameActionView {
  if (sessionConfirmed) return "confirmed";
  if (isWaiting) return "waiting";
  if (viewerConfirmed) return "joined";
  if (isClosed) return "closed";
  if (!isSignedIn) return "anon";
  return "joinable";
}
