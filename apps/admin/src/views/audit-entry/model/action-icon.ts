import { Ban, Check, ScrollText, X } from "lucide-react";

import { actionTone } from "@/shared/lib";

export function actionIcon(action: string) {
  if (action.includes("제재") && !action.includes("해제")) return Ban;
  const tone = actionTone(action);
  if (tone === "success") return Check;
  if (tone === "danger") return X;
  return ScrollText;
}
