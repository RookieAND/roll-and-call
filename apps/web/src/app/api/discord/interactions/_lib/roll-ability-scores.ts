import { range, sum } from "es-toolkit";

import { rollDice } from "./roll-dice";

// 크툴루 7판: 3d6×5, 크기·지능·교육만 (2d6+6)×5.
const ABILITIES = [
  { label: "근력", diceCount: 3, bonus: 0 },
  { label: "건강", diceCount: 3, bonus: 0 },
  { label: "크기", diceCount: 2, bonus: 6 },
  { label: "민첩", diceCount: 3, bonus: 0 },
  { label: "외모", diceCount: 3, bonus: 0 },
  { label: "지능", diceCount: 2, bonus: 6 },
  { label: "정신", diceCount: 3, bonus: 0 },
  { label: "교육", diceCount: 2, bonus: 6 },
  { label: "행운", diceCount: 3, bonus: 0 },
] as const;

const COLUMN_COUNT = 3;

export function rollAbilityScores() {
  return ABILITIES.map(({ label, diceCount, bonus }) => ({
    label,
    columns: range(COLUMN_COUNT).map(() => (sum(rollDice(diceCount, 6)) + bonus) * 5),
  }));
}
