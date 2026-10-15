import { randomInt } from "node:crypto";

export function pickRandomOption(options: string[]) {
  return options[randomInt(0, options.length)]!;
}
