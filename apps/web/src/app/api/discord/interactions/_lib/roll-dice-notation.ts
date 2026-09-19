import { rollDice } from "./roll-dice";

const NOTATION_PATTERN = /^[+-]?(?:\d*d\d+|\d+)(?:[+-](?:\d*d\d+|\d+))*$/;
const TERM_PATTERN = /([+-]?)(?:(\d*)d(\d+)|(\d+))/g;
const MAX_DICE_COUNT = 100;
const MAX_DICE_SIDES = 1000;

// "1d10", "3d6+2", "2d6+1d4-1" 처럼 주사위와 상수를 더하고 빼는 식만 받는다.
export function rollDiceNotation(notation: string) {
  const expression = notation.replace(/\s+/g, "").toLowerCase();
  if (!NOTATION_PATTERN.test(expression)) return null;

  let total = 0;
  let detail = "";
  for (const [, sign, diceCount, diceSides, constant] of expression.matchAll(TERM_PATTERN)) {
    let value = Number(constant);
    let text = constant;
    if (constant === undefined) {
      const count = diceCount === "" ? 1 : Number(diceCount);
      const sides = Number(diceSides);
      if (count < 1 || count > MAX_DICE_COUNT || sides < 1 || sides > MAX_DICE_SIDES) return null;
      const rolls = rollDice(count, sides);
      value = rolls.reduce((sum, roll) => sum + roll, 0);
      text = `[${rolls.join(", ")}]`;
    }
    total += sign === "-" ? -value : value;
    detail += detail === "" ? `${sign === "-" ? "-" : ""}${text}` : ` ${sign || "+"} ${text}`;
  }
  return { expression, detail, total };
}
