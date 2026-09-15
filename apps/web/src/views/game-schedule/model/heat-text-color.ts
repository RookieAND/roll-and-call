import { HEAT_MAX_STEP } from "./heat-step";

// 가장 진한 칸에서만 흰 숫자를 쓴다. 중간 단계에 흰 글씨를 얹으면 라이트에서 안 읽힌다.
export function heatTextColor(step: number): string {
  return `var(--color-heat-ink${step >= HEAT_MAX_STEP ? "-strong" : ""})`;
}
