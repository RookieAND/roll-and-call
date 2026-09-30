import type { BadgeStep } from "@roll-and-call/database/rules";

// 아직 못 받은 가장 낮은 단계. 끝 단계까지 받았으면 null.
export function nextStep(steps: BadgeStep[], count: number): BadgeStep | null {
  return steps.find((step) => step.threshold > count) ?? null;
}
