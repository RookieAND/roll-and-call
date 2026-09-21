import { Card, HStack, Text } from "@trpg/ui";
import { CircleCheck } from "lucide-react";

export function AttendanceDoneRow() {
  return (
    <Card padding="none" className="rounded-500 px-175 py-150">
      <HStack align="center" gap="100">
        <CircleCheck
          size={15}
          strokeWidth={2.2}
          aria-hidden
          className="shrink-0 text-success-600"
        />
        <Text typography="body4" foreground="muted" className="min-w-0 flex-1">
          출석 확인
        </Text>
        <Text typography="subtitle2" className="shrink-0">
          마침
        </Text>
      </HStack>
    </Card>
  );
}
