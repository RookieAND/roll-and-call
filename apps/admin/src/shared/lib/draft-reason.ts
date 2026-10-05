import { OTHER_REASON_CODE, type ChosenReason } from "@roll-and-call/database/moderation/model";
import { isNull } from "es-toolkit";

// 조치 창에서 고른 사유. 고르지 않았거나 기타 입력이 비었으면 null이라 확정을 막는다.
export function draftReason({
  code,
  otherText,
}: {
  code: string | null;
  otherText: string;
}): ChosenReason | null {
  if (isNull(code)) return null;
  if (code !== OTHER_REASON_CODE) return { code, text: null };
  const text = otherText.trim();
  return text ? { code, text } : null;
}
