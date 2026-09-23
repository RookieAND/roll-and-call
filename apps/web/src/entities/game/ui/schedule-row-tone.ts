import { Check, Clock } from "lucide-react";

import type { ScheduleLine } from "../model/schedule-line";

// 아이콘은 글자색(currentColor)을 따른다. 확정 fg-success, 조율 중 fg-muted, 미정·지난 일 fg-hint.
const SCHEDULE_ROW_TONE = {
  confirmed: { Icon: Check, foreground: "success", weight: "bold" },
  coordinating: { Icon: Clock, foreground: "muted", weight: "medium" },
  undecided: { Icon: Clock, foreground: "hint", weight: "medium" },
} as const;

export function scheduleRowTone(line: ScheduleLine) {
  if (line.finished || line.undecided) return SCHEDULE_ROW_TONE.undecided;
  if (line.confirmed || line.dated) return SCHEDULE_ROW_TONE.confirmed;
  return SCHEDULE_ROW_TONE.coordinating;
}
