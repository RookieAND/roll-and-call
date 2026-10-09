import { Callout, VStack } from "@roll-and-call/ui";
import { CircleCheck } from "lucide-react";

import { FinishSelectionCard } from "@/features/adjust-roster";
import { formatDateTime } from "@/shared/lib";

import type { RosterSummary } from "../model/roster-summary";
import { DeadlineCard } from "./deadline-card";
import { RosterDateRow } from "./roster-date-row";

interface SelectionStatusProps {
  gameId: string;
  summary: RosterSummary;
}

export function SelectionStatus({ gameId, summary }: SelectionStatusProps) {
  if (summary.selectionFinishedAt) {
    return (
      <RosterDateRow
        icon={CircleCheck}
        iconClass="text-success-700"
        label="선발"
        value={formatDateTime(summary.selectionFinishedAt)}
        badge="완료"
        badgePalette="gray"
      />
    );
  }
  const hasPeople = summary.applicantCount + summary.confirmedCount > 0;
  const showEmpty = !hasPeople && !summary.deadlinePassed;
  return (
    <VStack gap="175">
      <DeadlineCard summary={summary} />
      {showEmpty ? (
        <Callout.Root colorPalette="gray" size="sm">
          <Callout.Icon />
          <Callout.Description>아직 참여 신청자가 없습니다</Callout.Description>
        </Callout.Root>
      ) : (
        <FinishSelectionCard
          gameId={gameId}
          confirmedCount={summary.confirmedCount}
          applicantCount={summary.applicantCount}
          isFull={summary.isFull}
          deadlinePassed={summary.deadlinePassed}
          minPlayers={summary.minPlayers}
          block={summary.finishBlock}
        />
      )}
    </VStack>
  );
}
