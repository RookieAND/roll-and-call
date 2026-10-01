import type { BadgeStep } from "@roll-and-call/database/rules";

export function nextStep({
  steps,
  count,
}: {
  steps: BadgeStep[];
  count: number;
}): BadgeStep | null {
  return steps.find((step) => step.threshold > count) ?? null;
}
