import { Text, VStack } from "@roll-and-call/ui";
import { Calendar } from "lucide-react";

import { formatDateTime } from "@/shared/lib";

import type { RosterSummary } from "../model/roster-summary";
import { RosterDateRow } from "./roster-date-row";

interface DeadlineCardProps {
  summary: RosterSummary;
  showNote?: boolean;
}

export function DeadlineCard({ summary, showNote = false }: DeadlineCardProps) {
  const badgePalette = summary.deadlinePassed ? "gray" : "primary";
  return (
    <VStack gap="100">
      <RosterDateRow
        icon={Calendar}
        label="모집 마감"
        value={formatDateTime(summary.deadlineAt)}
        badge={summary.deadlineLabel}
        badgePalette={badgePalette}
      />
      {showNote && (
        <Text typography="body4" foreground="hint" render={<p />}>
          기한이 지나도 명단은 세션이 끝날 때까지 고칠 수 있습니다.
        </Text>
      )}
    </VStack>
  );
}
