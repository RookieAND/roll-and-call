// CoC 1d100 판정처럼 낮을수록 좋다. 1은 대성공, 2~5는 극단적 성공.
export const ROLL_GRADE = {
  critical: "critical",
  extreme: "extreme",
} as const;

export type RollGrade = (typeof ROLL_GRADE)[keyof typeof ROLL_GRADE];

const EXTREME_MAX = 5;

export function toRollGrade(roll: number | null): RollGrade | null {
  if (roll === 1) return ROLL_GRADE.critical;
  if (roll !== null && roll <= EXTREME_MAX) return ROLL_GRADE.extreme;
  return null;
}
