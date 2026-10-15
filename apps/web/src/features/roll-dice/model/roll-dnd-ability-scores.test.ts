import { describe, expect, it } from "vitest";

import { rollDndAbilityScores } from "./roll-dnd-ability-scores";

describe("rollDndAbilityScores", () => {
  it("여섯 능력치를 굴리고 가장 낮은 눈 하나를 버린다", () => {
    const scores = rollDndAbilityScores();
    expect(scores).toHaveLength(6);
    for (const { kept, dropped, total } of scores) {
      expect(kept).toHaveLength(3);
      expect(kept.every((value) => value >= dropped)).toBe(true);
      expect(total).toBe(kept[0]! + kept[1]! + kept[2]!);
      expect(total).toBeGreaterThanOrEqual(3);
      expect(total).toBeLessThanOrEqual(18);
    }
  });
});
