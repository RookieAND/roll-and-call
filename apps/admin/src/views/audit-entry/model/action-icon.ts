import { Ban, Check, ScrollText, X } from "lucide-react";

import { actionTone } from "@/shared/lib";

// 요약 카드 아이콘. 제재는 금지 표시, 나머지는 태그 색을 따라 인정·불리·그 밖으로 나눈다.
export function actionIcon(action: string) {
  if (action.includes("제재") && !action.includes("해제")) return Ban;
  const tone = actionTone(action);
  if (tone === "success") return Check;
  if (tone === "danger") return X;
  return ScrollText;
}
