// 길이를 모르면 흔한 길이(3시간)만큼 막는다.
export const DEFAULT_PLAY_MINUTES = 180;

export function playMinutes(minutes: number | null): number {
  return minutes || DEFAULT_PLAY_MINUTES;
}
