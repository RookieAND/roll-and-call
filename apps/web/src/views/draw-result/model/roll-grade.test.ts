import { describe, expect, it } from "vitest";

import { ROLL_GRADE, toRollGrade } from "./roll-grade";

describe("toRollGrade", () => {
  it("1은 대성공, 2~10은 극단적 성공, 그 밖은 등급이 없다", () => {
    expect(toRollGrade(1)).toBe(ROLL_GRADE.critical);
    expect(toRollGrade(2)).toBe(ROLL_GRADE.extreme);
    expect(toRollGrade(10)).toBe(ROLL_GRADE.extreme);
    expect(toRollGrade(11)).toBeNull();
    expect(toRollGrade(null)).toBeNull();
  });
});
