import { findTopCells } from "./find-top-cells";
import { TIME_SLOTS, WEEKDAYS } from "./time-grid";

// 가장 많은 칸에 같은 요일의 더 많은 이웃 시간대를 붙여 "목요일 20–24시"처럼 부른다.
export function openGridInsight(grid: number[][], early: boolean) {
  const [top] = findTopCells(grid);
  if (!top) return null;
  const row = grid[top.day]!;
  const before = row[top.slot - 1] ?? 0;
  const after = row[top.slot + 1] ?? 0;
  const neighbor = after >= before ? top.slot + 1 : top.slot - 1;
  const [from, to] = [top.slot, neighbor].toSorted((a, b) => a - b) as [number, number];
  const start = TIME_SLOTS[from];
  const end = TIME_SLOTS[to];
  const merged =
    (row[neighbor] ?? 0) > 0 && start && end && "start" in start && "end" in end
      ? { label: `${start.start}–${end.end}시`, count: row[from]! + row[to]! }
      : { label: TIME_SLOTS[top.slot]!.label, count: top.count };
  const subject = early ? "모집 중이거나 일정을 조율 중인 세션" : "모집 중인 세션";
  const lastCode = merged.label.charCodeAt(merged.label.length - 1) - 0xac00;
  const particle = lastCode >= 0 && lastCode % 28 !== 0 ? "을" : "를";
  return `${subject} 가운데 ${merged.count}건이 ${WEEKDAYS[top.day]}요일 ${merged.label}${particle} 희망하고 있습니다.`;
}
