import { HStack, Text } from "@trpg/ui";
import { CircleAlert } from "lucide-react";

interface UnsubmittedNoteProps {
  count: number;
}

export function UnsubmittedNote({ count }: UnsubmittedNoteProps) {
  return (
    <HStack align="center" gap="100" className="text-warning-600">
      <CircleAlert size={14} strokeWidth={2.2} aria-hidden className="shrink-0" />
      <Text typography="body4" foreground="inherit" render={<p />}>
        {count}명이 아직 가능 시간을 내지 않았습니다.
      </Text>
    </HStack>
  );
}
