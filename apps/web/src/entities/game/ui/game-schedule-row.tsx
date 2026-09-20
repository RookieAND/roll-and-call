import { HStack, Text } from "@trpg/ui";
import { Check, Clock } from "lucide-react";

import type { ScheduleLine } from "../model/schedule-line";

const SCHEDULE_ROW_TONE = {
  confirmed: { Icon: Check, iconClass: "", foreground: "success", weight: "bold" },
  expired: { Icon: Clock, iconClass: "text-gray-500", foreground: "muted", weight: "regular" },
  open: { Icon: Clock, iconClass: "text-primary-ink", foreground: "normal", weight: "regular" },
} as const;

function scheduleRowTone(line: ScheduleLine) {
  if (line.deadlinePassed) return SCHEDULE_ROW_TONE.expired;
  return line.confirmed ? SCHEDULE_ROW_TONE.confirmed : SCHEDULE_ROW_TONE.open;
}

export function GameScheduleRow({ line }: { line: ScheduleLine }) {
  const { Icon, iconClass, foreground, weight } = scheduleRowTone(line);

  return (
    <HStack align="center" className="gap-075">
      <Icon size={13} strokeWidth={2.2} aria-hidden className={`shrink-0 ${iconClass}`} />
      <Text
        truncate
        typography="body4"
        foreground={foreground}
        weight={weight}
        className="min-w-0 flex-1"
      >
        {line.text}
      </Text>
    </HStack>
  );
}
