// 겹침 인원(0→5+) 색 단계. 시안은 초록 그라데이션이 아니라 채도 단계를 쓴다.
const HEAT_LIGHT = ["#FFFFFF", "#EDEEFC", "#D8DAFA", "#B7BAF5", "#8E92EF", "#5B60E4"] as const;

export const HEAT_STEPS = [0, 1, 2, 3, 4, 5] as const;

export function heatColor(count: number): string {
  return HEAT_LIGHT[Math.min(5, Math.max(0, count))]!;
}

// 칸이 충분히 어두워지면 숫자를 흰색으로, 아니면 진한 남보라로 읽힌다.
export function heatTextColor(count: number): string {
  return count >= 3 ? "#FFFFFF" : "#5B60E4";
}
