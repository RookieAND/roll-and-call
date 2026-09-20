import { Badge, Card, HStack, Text, VStack } from "@trpg/ui";
import { Clock } from "lucide-react";

import type { RosterSummary } from "../model/roster-summary";

interface DeadlineCardProps {
  summary: RosterSummary;
  locked: boolean;
}

// 기한은 신청을 닫는 선이지 명단을 잠그는 선이 아니다. 그 사실을 카드 아래 한 줄로 못박는다.
export function DeadlineCard({ summary, locked }: DeadlineCardProps) {
  const note = locked
    ? "세션이 확정되어 명단을 바꿀 수 없습니다."
    : "기한이 지나도 명단은 계속 고칠 수 있습니다.";

  return (
    <VStack gap="100">
      <Card padding="none" className="rounded-500 px-175 py-150">
        <HStack align="center" gap="100">
          <Clock size={15} strokeWidth={2.2} aria-hidden className="shrink-0 text-gray-600" />
          <Text typography="body4" foreground="muted" className="min-w-0 flex-1">
            모집 마감
          </Text>
          <Text numeric typography="subtitle2" className="shrink-0">
            {summary.deadlineAt}
          </Text>
          <Badge
            color={summary.deadlinePassed ? "gray" : "primary"}
            className="shrink-0 tabular-nums"
          >
            {summary.deadlineLabel}
          </Badge>
        </HStack>
      </Card>
      <Text typography="body4" foreground="hint" render={<p />}>
        {note}
      </Text>
    </VStack>
  );
}
