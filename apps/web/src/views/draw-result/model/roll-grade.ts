import { isNull } from "es-toolkit";
// CoC 1d100 판정처럼 낮을수록 좋다. 1은 대성공, 2~10은 극단적 성공, 95~99는 극단적 실패, 100은 대실패.
export const ROLL_GRADE = {
  critical: "critical",
  extreme: "extreme",
  extremeFailure: "extremeFailure",
  criticalFailure: "criticalFailure",
} as const;

export type RollGrade = (typeof ROLL_GRADE)[keyof typeof ROLL_GRADE];

const CRITICAL_MAX = 1;
const EXTREME_MAX = 10;
const EXTREME_FAILURE_MIN = 95;
const CRITICAL_FAILURE_MIN = 100;

export function toRollGrade(roll: number | null): RollGrade | null {
  if (isNull(roll)) return null;
  if (roll <= CRITICAL_MAX) return ROLL_GRADE.critical;
  if (roll <= EXTREME_MAX) return ROLL_GRADE.extreme;
  if (roll >= CRITICAL_FAILURE_MIN) return ROLL_GRADE.criticalFailure;
  if (roll >= EXTREME_FAILURE_MIN) return ROLL_GRADE.extremeFailure;
  return null;
}
