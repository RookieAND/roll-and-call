import { Text } from "@roll-and-call/ui";
import { Clock } from "lucide-react";

interface UnsubmittedNoteProps {
  count: number;
}

export function UnsubmittedNote({ count }: UnsubmittedNoteProps) {
  return (
    <Text
      typography="body4"
      foreground="warning"
      render={<p />}
      className="flex items-center gap-075"
    >
      <Clock size={14} strokeWidth={2.2} aria-hidden className="shrink-0" />
      {count}명이 아직 가능 시간을 내지 않았습니다.
    </Text>
  );
}
