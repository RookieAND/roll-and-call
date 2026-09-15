import { VStack } from "@trpg/ui";

import { ACTION_SECONDARY_CLASS } from "./action-class-names";
import { ActionHint } from "./action-hint";
import { ManageParticipantsLink } from "./manage-participants-link";
import { ScheduleLink } from "./schedule-link";

export function GmCoordinateActions({
  gameId,
  respondedConfirmed,
  confirmedCount,
}: {
  gameId: string;
  respondedConfirmed: number;
  confirmedCount: number;
}) {
  return (
    <VStack gap={2}>
      <ManageParticipantsLink gameId={gameId} />
      <ScheduleLink gameId={gameId} className={ACTION_SECONDARY_CLASS} />
      <ActionHint>
        응답 {respondedConfirmed}/{confirmedCount} · 겹치는 시간에서 확정할 수 있습니다.
      </ActionHint>
    </VStack>
  );
}
