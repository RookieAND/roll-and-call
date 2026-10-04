import { isNull } from "es-toolkit";

import { OTHER_REASON } from "./user-action-reason";

// 사유 칩에서 고른 값을 저장할 사유로 바꾼다. 고르지 않았거나 기타 입력이 비었으면 빈 문자열이다.
export function chosenReason({ chip, otherText }: { chip: string | null; otherText: string }) {
  if (isNull(chip)) return "";
  return chip === OTHER_REASON ? otherText.trim() : chip;
}
