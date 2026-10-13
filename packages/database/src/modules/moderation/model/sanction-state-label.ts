import { formatDate } from "./format-date";

// 활동 기록 전후 상자의 보조 줄. 기한이 없으면 무기한이다.
export function sanctionStateSub(until: Date | null) {
  return until ? `${formatDate(until)}까지` : "무기한";
}
