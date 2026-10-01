import type { BadgeLook, BadgeStep } from "@roll-and-call/database/badges/model";

export function stepLook(step: BadgeStep): BadgeLook {
  return step.look ?? step.grade;
}
