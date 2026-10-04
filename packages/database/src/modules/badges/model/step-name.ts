import type { BadgeStep } from "./badge-ladder";

export function stepName({
  step,
  categoryName,
}: {
  step: BadgeStep;
  categoryName: string | null;
}): string {
  return categoryName ? `${categoryName} ${step.name}` : step.name;
}
