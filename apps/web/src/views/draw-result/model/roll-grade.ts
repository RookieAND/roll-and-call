// CoC 1d100 판정처럼 낮을수록 좋다. 1은 대성공, 2~10은 극단적 성공.
export const ROLL_GRADE = {
  critical: "critical",
  extreme: "extreme",
} as const;

export type RollGrade = (typeof ROLL_GRADE)[keyof typeof ROLL_GRADE];

const CRITICAL_MAX = 1;
const EXTREME_MAX = 10;

export function toRollGrade(roll: number | null): RollGrade | null {
  if (roll === null) return null;
  if (roll <= CRITICAL_MAX) return ROLL_GRADE.critical;
  if (roll <= EXTREME_MAX) return ROLL_GRADE.extreme;
  return null;
}
