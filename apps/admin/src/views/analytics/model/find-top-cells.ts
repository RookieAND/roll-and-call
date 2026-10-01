export interface GridCell {
  day: number;
  slot: number;
  count: number;
}

export function findTopCells(grid: number[][]): GridCell[] {
  return grid
    .flatMap((row, day) => row.map((count, slot) => ({ day, slot, count })))
    .filter((cell) => cell.count > 0)
    .toSorted((a, b) => b.count - a.count);
}
