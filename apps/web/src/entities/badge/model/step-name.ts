import type { BadgeStep } from "@roll-and-call/database/rules";

export function stepName({
  step,
  categoryName,
}: {
  step: BadgeStep;
  categoryName: string | null;
}): string {
  return categoryName ? `${categoryName} ${step.name}` : step.name;
}
