import { Text, VStack } from "@roll-and-call/ui";
import { Calendar } from "lucide-react";

import type { RosterSummary } from "../model/roster-summary";
import { RosterDateRow } from "./roster-date-row";

interface DeadlineCardProps {
  summary: RosterSummary;
  locked: boolean;
  // 추첨 글은 기한 아래에 추첨 카드나 추첨 완료 줄이 서서 안내 한 줄을 빼 둔다.
  showNote?: boolean;
}

// 기한은 신청을 닫는 선이지 명단을 잠그는 선이 아니다. 그 사실을 카드 아래 한 줄로 못박는다.
export function DeadlineCard({ summary, locked, showNote = true }: DeadlineCardProps) {
  const note = locked
    ? "세션이 확정되어 명단을 바꿀 수 없습니다."
    : "기한이 지나도 명단은 계속 고칠 수 있습니다.";

  return (
    <VStack gap="100">
      <RosterDateRow
        icon={Calendar}
        label="모집 마감"
        value={summary.deadlineAt}
        badge={summary.deadlineLabel}
        badgePalette={summary.deadlinePassed ? "gray" : "primary"}
      />
      {showNote && (
        <Text typography="body4" foreground="hint" render={<p />}>
          {note}
        </Text>
      )}
    </VStack>
  );
}
