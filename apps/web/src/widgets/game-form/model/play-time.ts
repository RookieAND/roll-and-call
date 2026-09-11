// 플레이타임은 DB에 "3시간 30분" 같은 자유 문자열로 저장된다.
// 입력은 시/분 두 칸으로 받으므로 여기서 서로 변환한다.
const DEFAULT_HOURS = "3";
const DEFAULT_MINUTES = "0";

export function parsePlayTime(value?: string | null) {
  return {
    hours: value?.match(/(\d+)\s*시간/)?.[1] ?? "",
    minutes: value?.match(/(\d+)\s*분/)?.[1] ?? "",
  };
}

// 저장된 값이 없으면 가장 흔한 3시간을 기본값으로 제안한다.
export function initialPlayTime(value?: string | null) {
  return value ? parsePlayTime(value) : { hours: DEFAULT_HOURS, minutes: DEFAULT_MINUTES };
}

export function formatPlayTime(hours: string, minutes: string): string {
  const parts = [];
  if (hours) parts.push(`${hours}시간`);
  if (minutes && minutes !== "0") parts.push(`${minutes}분`);
  return parts.join(" ");
}
