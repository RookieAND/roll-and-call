import { findTopCells } from "./find-top-cells";
import { TIME_SLOTS, WEEKDAYS } from "./time-grid";

// 가장 많은 두 칸이 같은 시간대면 요일을 묶어 부른다.
export function finishedGridInsight(grid: number[][]) {
  const [first, second] = findTopCells(grid);
  if (!first) return null;
  const days =
    second && second.slot === first.slot
      ? `${WEEKDAYS[first.day]}요일·${WEEKDAYS[second.day]}요일`
      : `${WEEKDAYS[first.day]}요일`;
  return `${days} ${TIME_SLOTS[first.slot]!.label}에 진행 세션이 가장 많습니다.`;
}
