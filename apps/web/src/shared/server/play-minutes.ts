// 플레이타임이 비었거나 읽을 수 없으면 흔한 길이(3시간)만큼 막는다.
const DEFAULT_PLAY_MINUTES = 180;

// "3시간 30분" → 210
export function playMinutes(playTime: string | null): number {
  if (!playTime) return DEFAULT_PLAY_MINUTES;
  const hours = Number(playTime.match(/(\d+)\s*시간/)?.[1] ?? 0);
  const minutes = Number(playTime.match(/(\d+)\s*분/)?.[1] ?? 0);
  return hours * 60 + minutes || DEFAULT_PLAY_MINUTES;
}
