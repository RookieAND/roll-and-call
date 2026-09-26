import { describe, expect, it } from "vitest";

import { ROLL_GRADE, toRollGrade } from "./roll-grade";

describe("toRollGrade", () => {
  it("5 이하는 대성공, 6~19는 극단적 성공, 그 밖은 등급이 없다", () => {
    expect(toRollGrade(1)).toBe(ROLL_GRADE.critical);
    expect(toRollGrade(5)).toBe(ROLL_GRADE.critical);
    expect(toRollGrade(6)).toBe(ROLL_GRADE.extreme);
    expect(toRollGrade(19)).toBe(ROLL_GRADE.extreme);
    expect(toRollGrade(20)).toBeNull();
    expect(toRollGrade(null)).toBeNull();
  });
});
