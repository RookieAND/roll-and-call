import { randomInt } from "node:crypto";

import { range } from "es-toolkit";

export function rollDice({ count, sides }: { count: number; sides: number }) {
  return range(count).map(() => randomInt(1, sides + 1));
}
