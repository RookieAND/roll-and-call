import type { GameSupplement } from "@roll-and-call/database";
import { isNull } from "es-toolkit";

export function manualSupplementNames(supplements: GameSupplement[]) {
  return supplements.filter((item) => isNull(item.rulebookId)).map((item) => item.name);
}
