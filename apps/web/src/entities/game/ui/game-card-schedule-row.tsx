import { Text } from "@roll-and-call/ui";
import { CalendarDays } from "lucide-react";

interface GameCardScheduleRowProps {
  text: string;
}

// 카드에서는 일정 상태를 색으로 가르지 않는다. 상태는 배지가 말한다.
export function GameCardScheduleRow({ text }: GameCardScheduleRowProps) {
  return (
    <Text render={<div />} foreground="hint" className="flex items-center gap-075">
      <CalendarDays size={14} strokeWidth={2.2} aria-hidden className="shrink-0" />
      <Text
        truncate
        typography="body3"
        foreground="muted"
        weight="medium"
        className="min-w-0 flex-1"
      >
        {text}
      </Text>
    </Text>
  );
}
