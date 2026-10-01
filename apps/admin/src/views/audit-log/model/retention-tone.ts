import { isNull } from "es-toolkit";

export function retentionTone(daysLeft: number | null) {
  if (isNull(daysLeft)) return "muted";
  if (daysLeft <= 7) return "danger";
  return "hint";
}
