import { randomInt } from "node:crypto";

export function rollDice(count: number, sides: number) {
  return Array.from({ length: count }, () => randomInt(1, sides + 1));
}
