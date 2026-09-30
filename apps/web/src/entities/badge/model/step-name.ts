import type { BadgeStep } from "@roll-and-call/database/rules";

// 룰별 뱃지는 "피아스코 애호가"처럼 룰 분류 이름 뒤에 단계어를 붙인다.
export function stepName(step: BadgeStep, categoryName: string | null): string {
  return categoryName ? `${categoryName} ${step.name}` : step.name;
}
