import { Ban, ScrollText, X } from "lucide-react";

import { actionTone } from "@/entities/audit";

export function actionIcon(action: string) {
  if (action === "제재" || action === "추방") return Ban;
  if (actionTone(action) === "danger") return X;
  return ScrollText;
}
