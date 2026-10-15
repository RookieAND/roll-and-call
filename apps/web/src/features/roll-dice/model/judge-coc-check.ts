export const COC_CHECK_LEVEL = {
  criticalSuccess: "대성공",
  extremeSuccess: "극단적 성공",
  hardSuccess: "어려운 성공",
  success: "성공",
  failure: "실패",
  fumble: "대실패",
} as const;

export type CocCheckLevel = (typeof COC_CHECK_LEVEL)[keyof typeof COC_CHECK_LEVEL];

const FUMBLE_FROM_LOW_TARGET = 96;

// 크툴루 7판: 1은 대성공, 목표값이 50 미만이면 96 이상·아니면 100이 대실패다.
export function judgeCocCheck({ roll, target }: { roll: number; target: number }): CocCheckLevel {
  if (roll === 1) return COC_CHECK_LEVEL.criticalSuccess;
  const fumbleFrom = target < 50 ? FUMBLE_FROM_LOW_TARGET : 100;
  if (roll >= fumbleFrom) return COC_CHECK_LEVEL.fumble;
  if (roll <= Math.floor(target / 5)) return COC_CHECK_LEVEL.extremeSuccess;
  if (roll <= Math.floor(target / 2)) return COC_CHECK_LEVEL.hardSuccess;
  if (roll <= target) return COC_CHECK_LEVEL.success;
  return COC_CHECK_LEVEL.failure;
}
