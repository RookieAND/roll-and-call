export const MAX_PLAY_MINUTES = 720;

export const PLAY_TIME_ERROR = {
  zero: "세션 플레이타임은 반드시 0분보다 커야 합니다.",
  tooLong: "플레이타임은 12시간까지 정할 수 있습니다.",
  minOverMax: "최소 플레이타임이 최대보다 길 수 없습니다.",
} as const;

// 최소(필수)와 최대(선택)를 검사한다. 최대가 없으면 최소와 같은 값으로 본다.
export function playTimeError({
  min,
  max,
}: {
  min: number;
  max: number | null;
}): { field: "playMinutesMin" | "playMinutes"; message: string } | null {
  if (min < 1) return { field: "playMinutesMin", message: PLAY_TIME_ERROR.zero };
  if (min > MAX_PLAY_MINUTES) return { field: "playMinutesMin", message: PLAY_TIME_ERROR.tooLong };
  if (max === null) return null;
  if (max > MAX_PLAY_MINUTES) return { field: "playMinutes", message: PLAY_TIME_ERROR.tooLong };
  if (min > max) return { field: "playMinutes", message: PLAY_TIME_ERROR.minOverMax };
  return null;
}
