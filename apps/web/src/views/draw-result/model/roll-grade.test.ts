import { describe, expect, it } from "vitest";

import { ROLL_GRADE, toRollGrade } from "./roll-grade";

describe("toRollGrade", () => {
  it("1은 대성공, 2~10은 극단적 성공, 95~99는 극단적 실패, 100은 대실패, 그 밖은 등급이 없다", () => {
    expect(toRollGrade(1)).toBe(ROLL_GRADE.critical);
    expect(toRollGrade(2)).toBe(ROLL_GRADE.extreme);
    expect(toRollGrade(10)).toBe(ROLL_GRADE.extreme);
    expect(toRollGrade(11)).toBeNull();
    expect(toRollGrade(94)).toBeNull();
    expect(toRollGrade(95)).toBe(ROLL_GRADE.extremeFailure);
    expect(toRollGrade(99)).toBe(ROLL_GRADE.extremeFailure);
    expect(toRollGrade(100)).toBe(ROLL_GRADE.criticalFailure);
    expect(toRollGrade(null)).toBeNull();
  });
});
