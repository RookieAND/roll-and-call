import { Text } from "@roll-and-call/ui";
import { Check, Clock } from "lucide-react";

import type { ScheduleLine } from "../model/schedule-line";

// 아이콘은 글자색(currentColor)을 따른다. 확정 fg-success, 조율 중 fg-muted, 미정 fg-hint.
const SCHEDULE_ROW_TONE = {
  confirmed: { Icon: Check, foreground: "success", weight: "bold" },
  coordinating: { Icon: Clock, foreground: "muted", weight: "regular" },
  undecided: { Icon: Clock, foreground: "hint", weight: "regular" },
} as const;

function scheduleRowTone(line: ScheduleLine) {
  if (line.confirmed) return SCHEDULE_ROW_TONE.confirmed;
  if (line.undecided || line.finished) return SCHEDULE_ROW_TONE.undecided;
  return SCHEDULE_ROW_TONE.coordinating;
}

interface GameScheduleRowProps {
  line: ScheduleLine;
}

export function GameScheduleRow({ line }: GameScheduleRowProps) {
  const { Icon, foreground, weight } = scheduleRowTone(line);

  return (
    <Text render={<div />} foreground={foreground} className="flex items-center gap-075">
      <Icon size={13} strokeWidth={2.2} aria-hidden className="shrink-0" />
      <Text
        truncate
        typography="body4"
        foreground={foreground}
        weight={weight}
        className="min-w-0 flex-1"
      >
        {line.text}
      </Text>
    </Text>
  );
}
