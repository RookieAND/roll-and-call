import { Text } from "@roll-and-call/ui";

import type { ScheduleLine } from "../model/schedule-line";
import { scheduleRowTone } from "./schedule-row-tone";

const ROW_SCALE = {
  card: { typography: "body4", iconSize: 13 },
  header: { typography: "body3", iconSize: 14 },
} as const;

interface GameScheduleRowProps {
  line: ScheduleLine;
  scale?: keyof typeof ROW_SCALE;
}

export function GameScheduleRow({ line, scale = "card" }: GameScheduleRowProps) {
  const { Icon, foreground, weight } = scheduleRowTone(line);
  const { typography, iconSize } = ROW_SCALE[scale];

  return (
    <Text render={<div />} foreground={foreground} className="flex items-center gap-075">
      <Icon size={iconSize} strokeWidth={2.2} aria-hidden className="shrink-0" />
      <Text
        truncate
        typography={typography}
        foreground={foreground}
        weight={weight}
        className="min-w-0 flex-1"
      >
        {line.text}
      </Text>
    </Text>
  );
}
