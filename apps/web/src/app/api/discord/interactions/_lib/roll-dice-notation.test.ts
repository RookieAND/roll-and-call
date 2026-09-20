import { describe, expect, it } from "vitest";

import { rollDiceNotation } from "./roll-dice-notation";

describe("rollDiceNotation", () => {
  it.each(["", "d", "1d", "d6+", "2x6", "1d6++2", "0d6", "101d6", "1d1001"])(
    "읽을 수 없는 표기는 거절한다: %s",
    (notation) => {
      expect(rollDiceNotation(notation)).toBeNull();
    },
  );

  it("앞뒤 공백과 대문자를 다듬어 읽는다", () => {
    const single = rollDiceNotation(" 1D10 ");
    expect(single?.expression).toBe("1d10");
    expect(single!.total).toBeGreaterThanOrEqual(1);
    expect(single!.total).toBeLessThanOrEqual(10);
    expect(single!.detail).toMatch(/^\[\d+\]$/);
  });

  it("보정치를 더한다", () => {
    const withBonus = rollDiceNotation("3d6+2");
    expect(withBonus!.total).toBeGreaterThanOrEqual(5);
    expect(withBonus!.total).toBeLessThanOrEqual(20);
    expect(withBonus!.detail).toMatch(/^\[\d+, \d+, \d+\] \+ 2$/);
  });

  it("주사위를 섞어 던지고 빼기도 한다", () => {
    const mixed = rollDiceNotation("2d6+1d4-1");
    expect(mixed!.total).toBeGreaterThanOrEqual(2);
    expect(mixed!.total).toBeLessThanOrEqual(15);
    expect(mixed!.detail).toMatch(/^\[\d+, \d+\] \+ \[\d+\] - 1$/);
  });

  it("개수를 생략하면 한 개, 주사위가 없으면 그 수 그대로다", () => {
    expect(rollDiceNotation("d6")?.detail.split(",")).toHaveLength(1);
    expect(rollDiceNotation("7")?.total).toBe(7);
  });
});
