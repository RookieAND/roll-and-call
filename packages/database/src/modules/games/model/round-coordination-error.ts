export const ROUND_COORDINATION_MAX_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

// start·end·today는 KST 날짜 문자열(YYYY-MM-DD). 기본 길이 7일은 화면이 채운다.
export function roundCoordinationError({
  start,
  end,
  today,
}: {
  start: string;
  end: string;
  today: string;
}): string | null {
  if (start < today) return "지난 날짜로는 열 수 없습니다.";
  if (end < start) return "끝나는 날은 시작하는 날보다 앞설 수 없습니다.";
  const days = (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / DAY_MS + 1;
  if (days > ROUND_COORDINATION_MAX_DAYS) {
    return `조율 기간은 ${ROUND_COORDINATION_MAX_DAYS}일을 넘을 수 없습니다.`;
  }
  return null;
}
