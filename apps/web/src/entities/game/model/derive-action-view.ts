export type GameActionView =
  | "confirmed" // 세션 확정됨
  | "waiting" // 뷰어가 대기자
  | "closed" // 모집 마감
  | "anon" // 비로그인
  | "joined" // 뷰어 참여 확정
  | "joinable"; // 참여 가능

// 액션 존에서 무엇을 보여줄지 결정하는 우선순위 체인.
// 순서가 곧 우선순위다(확정 > 대기 > 마감 > 비로그인 > 참여중 > 참여가능).
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
  if (isClosed) return "closed";
  if (!isSignedIn) return "anon";
  if (viewerConfirmed) return "joined";
  return "joinable";
}
