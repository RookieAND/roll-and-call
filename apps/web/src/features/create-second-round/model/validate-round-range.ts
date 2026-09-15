import { DAY_MS, SECOND_ROUND_MAX_DAYS, type SecondRoundInput } from "./second-round";

export function validateRoundRange({ rangeStart, rangeEnd }: SecondRoundInput): string | null {
  if (!rangeStart || !rangeEnd) return "조율 기간을 입력하세요.";
  if (rangeEnd <= rangeStart) return "종료일은 시작일보다 이후여야 합니다.";
  if ((Date.parse(rangeEnd) - Date.parse(rangeStart)) / DAY_MS > SECOND_ROUND_MAX_DAYS) {
    return `조율 기간은 최대 ${SECOND_ROUND_MAX_DAYS}일까지 설정할 수 있습니다.`;
  }
  return null;
}
