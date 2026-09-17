export const DEFAULT_PLAY_TIME = "3시간";

export const MAX_PLAY_HOURS = 12;

export const PLAY_HOUR_OPTIONS = Array.from({ length: MAX_PLAY_HOURS + 1 }, (_, index) => index);

export const PLAY_MINUTE_OPTIONS = [0, 10, 20, 30, 40, 50] as const;

// "3시간 30분" → { hours: 3, minutes: 30 }
export function splitPlayTime(playTime?: string | null) {
  return {
    hours: Number(playTime?.match(/(\d+)\s*시간/)?.[1] ?? 0),
    minutes: Number(playTime?.match(/(\d+)\s*분/)?.[1] ?? 0),
  };
}
