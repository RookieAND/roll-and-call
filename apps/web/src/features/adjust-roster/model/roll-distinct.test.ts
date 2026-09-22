import { randomInt } from "node:crypto";

import { describe, expect, it } from "vitest";

import { DIE_FACES } from "@/entities/game";

import { rollDistinct } from "./roll-distinct";

function scripted(sequence: number[]) {
  let index = 0;
  return () => sequence[index++]!;
}

describe("rollDistinct", () => {
  it("겹친 사람끼리만 다시 굴리고 나머지 값은 그대로 둔다", () => {
    expect(rollDistinct(3, scripted([12, 40, 12, 7, 55]))).toEqual([7, 40, 55]);
  });

  it("다시 굴린 값이 다른 사람과 겹치면 다시 굴린 쪽만 또 굴린다", () => {
    expect(rollDistinct(3, scripted([5, 5, 9, 9, 30, 9, 31]))).toEqual([31, 30, 9]);
  });

  it("면 수만큼 사람이 있어도 모두 다른 값이 나온다", () => {
    const values = rollDistinct(DIE_FACES, () => randomInt(1, DIE_FACES + 1));
    expect(new Set(values).size).toBe(DIE_FACES);
  });

  it("면 수보다 사람이 많으면 굴리지 않는다", () => {
    expect(() => rollDistinct(DIE_FACES + 1, () => 1)).toThrow(RangeError);
  });
});
