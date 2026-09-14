// 겹침 색 단계(0~5). 절대 인원이 아니라 정원 기준으로 나눠, 2인 게임도 모두 가능하면 가장 진하게 칠한다.
// 실제 색은 packages/ui의 --color-heat-* 토큰이 갖고 있어서 다크 모드에서 같은 이름이 어두운 램프를 가리킨다.
const MAX_STEP = 5;

export function heatStep(count: number, capacity: number): number {
  if (count <= 0) return 0;
  const ratio = count / Math.max(1, capacity);
  return Math.min(MAX_STEP, Math.max(1, Math.ceil(ratio * MAX_STEP)));
}

export function heatColor(step: number): string {
  return `var(--color-heat-${step})`;
}

// 가장 진한 칸에서만 흰 숫자를 쓴다. 중간 단계에 흰 글씨를 얹으면 라이트에서 안 읽힌다.
export function heatTextColor(step: number): string {
  return `var(--color-heat-ink${step >= MAX_STEP ? "-strong" : ""})`;
}

// 범례 칸: 정원이 5명 이하면 인원마다 한 칸, 넘으면 단계마다 대표 인원 한 칸.
export function heatLegend(capacity: number): { count: number; step: number }[] {
  const cap = Math.max(1, capacity);
  if (cap <= MAX_STEP) {
    return Array.from({ length: cap + 1 }, (_, count) => ({ count, step: heatStep(count, cap) }));
  }
  return Array.from({ length: MAX_STEP + 1 }, (_, step) => ({
    count: step === 0 ? 0 : Math.round((step / MAX_STEP) * cap),
    step,
  }));
}
