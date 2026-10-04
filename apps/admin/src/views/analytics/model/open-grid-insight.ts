import { findTopCells } from "./find-top-cells";
import { TIME_SLOTS, WEEKDAYS } from "./time-grid";

export function openGridInsight(grid: number[][]) {
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
  return `시간이 정해진 예정 세션 가운데 ${merged.count}건이 ${WEEKDAYS[top.day]}요일 ${merged.label}에 열립니다.`;
}
