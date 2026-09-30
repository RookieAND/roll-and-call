import type { BadgeStep } from "@roll-and-call/database/rules";

// 누적 사다리 메달을 잇는 금색 줄의 길이(%). 줄은 첫 메달 중심(10%)에서 끝 메달 중심(90%)까지 80%다.
export function ladderFill(steps: BadgeStep[], count: number): number {
  const tier = steps.filter((step) => step.threshold <= count).length;
  if (tier === 0) return 0;
  const reached = steps[tier - 1]!;
  const next = steps[tier];
  const partial = next ? (count - reached.threshold) / (next.threshold - reached.threshold) : 0;
  return (80 * (tier - 1 + partial)) / (steps.length - 1);
}
