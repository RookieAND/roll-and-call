import type { HOMEBREW_FIELD } from "./homebrew-field";

type HomebrewField = (typeof HOMEBREW_FIELD)[keyof typeof HOMEBREW_FIELD];

export const HOMEBREW_STEPS = [
  { number: 1, label: "룰북 정보" },
  { number: 2, label: "심사 자료" },
] as const;

const FIRST_STEP_FIELDS: readonly HomebrewField[] = ["name", "summary", "description"];

// 서버가 알려 준 오류 칸이 어느 단계에 있는지.
export function homebrewStepOfField(field: HomebrewField): number {
  return FIRST_STEP_FIELDS.includes(field) ? 0 : 1;
}
