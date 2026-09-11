// 겹침 인원(0→5+) 색 단계. 실제 값은 packages/ui의 --color-heat-* 토큰이 갖고
// 있어서 다크 모드에서 같은 이름이 어두운 램프를 가리킨다.
const MAX_STEP = 5;

export const HEAT_STEPS = [0, 1, 2, 3, 4, 5] as const;

export function heatColor(count: number): string {
  const step = Math.min(MAX_STEP, Math.max(0, count));
  return `var(--color-heat-${step})`;
}

// 칸이 충분히 진해지면 숫자를 흰색으로, 아니면 잉크색으로 읽는다.
export function heatTextColor(count: number): string {
  return `var(--color-heat-ink${count >= 3 ? "-strong" : ""})`;
}
