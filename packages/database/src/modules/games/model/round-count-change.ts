import { ROUND_COUNT_MAX } from "./round-limits";

export type RoundCountChange = "invalid" | "same" | "finish" | "set";

// 예정 회차 수를 바꿀 때의 판정. 이미 시작한 회차 수보다 적게는 못 줄이고, 같게 줄이면 조기 종결이다.
export function roundCountChange({
  current,
  next,
  startedCount,
}: {
  current: number;
  next: number;
  startedCount: number;
}): RoundCountChange {
  if (!Number.isInteger(next) || next < startedCount || next > ROUND_COUNT_MAX) return "invalid";
  if (next === current) return "same";
  if (next === startedCount) return "finish";
  return "set";
}
