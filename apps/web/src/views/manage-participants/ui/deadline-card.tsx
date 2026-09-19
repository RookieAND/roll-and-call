import { Card, HStack, Text, VStack, cn } from "@trpg/ui";

import type { RosterSummary } from "../model/roster-summary";

// 기한은 신청을 닫는 선이지 명단을 잠그는 선이 아니다. 그 사실을 카드 아래 한 줄로 못박는다.
export function DeadlineCard({ summary, locked }: { summary: RosterSummary; locked: boolean }) {
  const note = locked
    ? "세션이 확정되어 명단을 바꿀 수 없습니다."
    : "기한이 지나도 명단은 계속 고칠 수 있습니다.";

  return (
    <VStack gap={2}>
      <Card padding="none" className="rounded-xl px-3.5 py-3">
        <HStack align="center" gap={2}>
          <Text typography="body4" foreground="muted" className="shrink-0">
            모집 마감
          </Text>
          <Text typography="subtitle2" className="min-w-0 flex-1 truncate">
            {summary.deadlineAt}
          </Text>
          <Text
            typography="body4"
            className={cn("shrink-0 font-bold", summary.deadlineWarn && "text-warning-600")}
            foreground={summary.deadlineWarn ? undefined : "muted"}
          >
            {summary.deadlineLabel}
          </Text>
        </HStack>
      </Card>
      <Text typography="body4" foreground="hint" render={<p />}>
        {note}
      </Text>
    </VStack>
  );
}
