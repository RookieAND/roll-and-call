import { Badge, Card, HStack, Text } from "@trpg/ui";
import { Clock } from "lucide-react";

import { formatDateTime } from "@/shared/lib";

interface AttendanceSessionTimeProps {
  confirmedAt: Date;
}

export function AttendanceSessionTime({ confirmedAt }: AttendanceSessionTimeProps) {
  return (
    <Card radius={500} background="none" padding="none" className="px-175 py-150">
      <HStack align="center" gap="125" className="text-hint">
        <Clock size={15} strokeWidth={2.2} aria-hidden className="flex-none" />
        <Text typography="body4" foreground="hint" className="flex-1">
          세션 시각
        </Text>
        <Text numeric typography="subtitle2">
          {formatDateTime(confirmedAt)}
        </Text>
        <Badge color="gray" className="flex-none">
          끝남
        </Badge>
      </HStack>
    </Card>
  );
}
