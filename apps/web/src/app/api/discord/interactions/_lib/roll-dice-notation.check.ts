import assert from "node:assert/strict";

import { rollDiceNotation } from "./roll-dice-notation";

for (const notation of ["", "d", "1d", "d6+", "2x6", "1d6++2", "0d6", "101d6", "1d1001"]) {
  assert.equal(rollDiceNotation(notation), null, notation);
}

const single = rollDiceNotation(" 1D10 ");
assert.equal(single?.expression, "1d10");
assert.ok(single && single.total >= 1 && single.total <= 10);
assert.match(single.detail, /^\[\d+\]$/);

const withBonus = rollDiceNotation("3d6+2");
assert.ok(withBonus && withBonus.total >= 5 && withBonus.total <= 20);
assert.match(withBonus.detail, /^\[\d+, \d+, \d+\] \+ 2$/);

const mixed = rollDiceNotation("2d6+1d4-1");
assert.ok(mixed && mixed.total >= 2 && mixed.total <= 15);
assert.match(mixed.detail, /^\[\d+, \d+\] \+ \[\d+\] - 1$/);

assert.equal(rollDiceNotation("d6")?.detail.split(",").length, 1);
assert.equal(rollDiceNotation("7")?.total, 7);

console.log("roll-dice-notation.check ok");
