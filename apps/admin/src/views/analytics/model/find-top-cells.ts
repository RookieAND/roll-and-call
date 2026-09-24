export interface GridCell {
  day: number;
  slot: number;
  count: number;
}

// 값이 큰 칸부터. 같으면 이른 요일·이른 시간대가 먼저다.
export function findTopCells(grid: number[][]): GridCell[] {
  return grid
    .flatMap((row, day) => row.map((count, slot) => ({ day, slot, count })))
    .filter((cell) => cell.count > 0)
    .toSorted((a, b) => b.count - a.count);
}
