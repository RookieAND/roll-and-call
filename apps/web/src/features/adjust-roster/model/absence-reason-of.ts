import { isString } from "es-toolkit";

export const ABSENCE_REASON_MAX_LENGTH = 200;

// 앞뒤 공백을 빼고 비었으면 null.
export function absenceReasonOf(
  input: string | undefined,
): { error: string } | { value: string | null } {
  const value = isString(input) ? input.trim() : "";
  if (value.length > ABSENCE_REASON_MAX_LENGTH) {
    return { error: `불참 사유는 ${ABSENCE_REASON_MAX_LENGTH}자까지 적을 수 있습니다.` };
  }
  return { value: value || null };
}
