// 길이를 모르면 흔한 길이(3시간)로 본다.
export const DEFAULT_PLAY_MINUTES = 180;

export function sessionEndsAt(startsAt: Date, playMinutes: number | null): Date {
  return new Date(startsAt.getTime() + (playMinutes || DEFAULT_PLAY_MINUTES) * 60 * 1000);
}
