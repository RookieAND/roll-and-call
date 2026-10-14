import type { GameSupplement } from "@roll-and-call/database";

export function manualSupplementNames(supplements: GameSupplement[]) {
  return supplements.filter((item) => item.rulebookId === null).map((item) => item.name);
}
