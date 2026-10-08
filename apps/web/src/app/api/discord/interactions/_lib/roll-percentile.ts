import { randomInt } from "node:crypto";

import { range } from "es-toolkit";

const TENS_DIGITS = 10;

// 1d100. 보정이 양수면 보너스 주사위, 음수면 페널티 주사위 개수만큼 십의 자리를 더 굴려 고른다.
export function rollPercentile(modifier = 0) {
  const units = randomInt(0, 10);
  const tens = range(Math.abs(modifier) + 1).map(() => randomInt(0, TENS_DIGITS));
  const candidates = tens.map((digit) => (digit * 10 + units === 0 ? 100 : digit * 10 + units));
  const roll = modifier < 0 ? Math.max(...candidates) : Math.min(...candidates);
  return { roll, candidates };
}
