const MIN_DISTANCE_PX = 48;

export type SwipeDirection = "next" | "previous" | null;

export function swipeDirection({
  deltaX,
  deltaY,
}: {
  deltaX: number;
  deltaY: number;
}): SwipeDirection {
  if (Math.abs(deltaX) < MIN_DISTANCE_PX || Math.abs(deltaX) <= Math.abs(deltaY)) return null;
  return deltaX < 0 ? "next" : "previous";
}
