import { Badge, Card, HStack, Text } from "@trpg/ui";
import { Clock } from "lucide-react";

import { formatDateTime } from "@/shared/lib";

export function SessionEndedCard({ confirmedAt }: { confirmedAt: Date }) {
  return (
    <Card padding="none" className="rounded-500 px-175 py-150">
      <HStack align="center" gap="100">
        <Clock size={15} strokeWidth={2.2} aria-hidden className="shrink-0 text-gray-600" />
        <Text typography="body4" foreground="muted" className="min-w-0 flex-1">
          세션
        </Text>
        <Text numeric typography="subtitle2" className="shrink-0">
          {formatDateTime(confirmedAt)}
        </Text>
        <Badge color="gray" className="shrink-0">
          끝남
        </Badge>
      </HStack>
    </Card>
  );
}
