// 플레이타임은 DB에 "3시간 30분" 같은 문자열로 저장된다. 입력은 30분 단위 한 칸(최대 12시간).
const STEP_MINUTES = 30;
const MAX_HOURS = 12;

export const DEFAULT_PLAY_TIME = "3시간";

export function formatPlayTimeMinutes(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return [hours ? `${hours}시간` : "", minutes ? `${minutes}분` : ""].filter(Boolean).join(" ");
}

export const PLAY_TIME_OPTIONS = Array.from({ length: (MAX_HOURS * 60) / STEP_MINUTES }, (_, i) =>
  formatPlayTimeMinutes((i + 1) * STEP_MINUTES),
);

// 목록에 없는 예전 값("2시간 15분" 등)도 그대로 고를 수 있게 앞에 끼워 둔다.
export function playTimeOptions(current?: string | null): string[] {
  return current && !PLAY_TIME_OPTIONS.includes(current)
    ? [current, ...PLAY_TIME_OPTIONS]
    : PLAY_TIME_OPTIONS;
}
