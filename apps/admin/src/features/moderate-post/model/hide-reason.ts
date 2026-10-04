import { isNull } from "es-toolkit";

import { OTHER_REASON } from "@/shared/lib";

// 숨김 사유로 저장하고 GM에게 보이는 글. 칩 이름이고, 기타면 「기타 · {입력}」(숨김 줄과 같은 모양)이다.
// 고르지 않았거나 기타 입력이 비었으면 빈 문자열이다.
export function hideReason({ chip, otherText }: { chip: string | null; otherText: string }) {
  if (isNull(chip)) return "";
  if (chip !== OTHER_REASON) return chip;
  const text = otherText.trim();
  return text ? `${OTHER_REASON} · ${text}` : "";
}
