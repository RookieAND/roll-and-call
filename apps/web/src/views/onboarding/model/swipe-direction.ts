const MIN_DISTANCE_PX = 48;

export type SwipeDirection = "next" | "previous" | null;

// 세로로 더 많이 움직였으면 스크롤이지 넘김이 아니다.
export function swipeDirection(deltaX: number, deltaY: number): SwipeDirection {
  if (Math.abs(deltaX) < MIN_DISTANCE_PX || Math.abs(deltaX) <= Math.abs(deltaY)) return null;
  return deltaX < 0 ? "next" : "previous";
}
