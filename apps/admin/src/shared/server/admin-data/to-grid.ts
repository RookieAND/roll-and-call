import { gridCell } from "./grid-cell";
import type { Session } from "./types";

export function toGrid(sessions: Session[]) {
  const grid = Array.from({ length: 7 }, () => Array.from({ length: 7 }, () => 0));
  for (const session of sessions) {
    const { day, slot } = gridCell(session.startsAt);
    grid[day]![slot]!++;
  }
  return grid;
}
