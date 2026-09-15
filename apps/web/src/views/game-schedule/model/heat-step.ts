export const HEAT_MAX_STEP = 5;

// 절대 인원이 아니라 정원 기준으로 나눠, 2인 게임도 모두 가능하면 가장 진하게 칠한다.
export function heatStep(count: number, capacity: number): number {
  if (count <= 0) return 0;
  const ratio = count / Math.max(1, capacity);
  return Math.min(HEAT_MAX_STEP, Math.max(1, Math.ceil(ratio * HEAT_MAX_STEP)));
}
