import type { BadgeLook, BadgeStep } from "@roll-and-call/database/rules";

export function stepLook(step: BadgeStep): BadgeLook {
  return step.look ?? step.grade;
}
