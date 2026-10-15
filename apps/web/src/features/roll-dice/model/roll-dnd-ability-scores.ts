import { sum } from "es-toolkit";

import { rollDice } from "./roll-dice";

const ABILITY_LABELS = ["근력", "민첩", "건강", "지능", "지혜", "매력"] as const;

// 4d6에서 가장 낮은 눈 하나를 버린다.
export function rollDndAbilityScores() {
  return ABILITY_LABELS.map((label) => {
    const [dropped = 0, ...ascending] = rollDice({ count: 4, sides: 6 }).toSorted(
      (first, second) => first - second,
    );
    return { label, kept: ascending.toReversed(), dropped, total: sum(ascending) };
  });
}
