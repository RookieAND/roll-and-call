import { formatPlayTimeMinutes } from "./format-play-time-minutes";

const STEP_MINUTES = 30;
const MAX_HOURS = 12;

export const DEFAULT_PLAY_TIME = "3시간";

export const PLAY_TIME_OPTIONS = Array.from(
  { length: (MAX_HOURS * 60) / STEP_MINUTES },
  (_, index) => formatPlayTimeMinutes((index + 1) * STEP_MINUTES),
);

// DB에 문자열로 저장된 예전 값("2시간 15분" 등)도 고를 수 있게 앞에 끼워 둔다.
export function playTimeOptions(current?: string | null): string[] {
  return current && !PLAY_TIME_OPTIONS.includes(current)
    ? [current, ...PLAY_TIME_OPTIONS]
    : PLAY_TIME_OPTIONS;
}
