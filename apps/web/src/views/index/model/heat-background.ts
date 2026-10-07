// 0은 빈 칸. 히트맵 단계 색은 :root 변수라 유틸리티 대신 인라인으로 읽는다.
export function heatBackground(step: number) {
  return step === 0 ? "var(--rc-color-bg-secondary)" : `var(--rc-color-heat-${step})`;
}
