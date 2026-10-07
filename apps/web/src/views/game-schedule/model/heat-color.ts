// 실제 색은 --color-heat-* 토큰이 갖고 있어서 다크 모드에서 같은 이름이 어두운 램프를 가리킨다.
export function heatColor(step: number): string {
  return `var(--color-heat-${step})`;
}
