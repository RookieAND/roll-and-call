import type { CoordinationWindow } from "@roll-and-call/database/games/model";

export function coordinationWindowOf(game: {
  windowStartHour: number;
  windowEndHour: number;
}): CoordinationWindow {
  return { startHour: game.windowStartHour, endHour: game.windowEndHour };
}
