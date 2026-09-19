import { VStack } from "@trpg/ui";

import { ConfirmedSessionNotice } from "@/entities/game";

import { ACTION_SECONDARY_CLASS } from "./action-class-names";
import { ActionHint } from "./action-hint";
import { ScheduleLink } from "./schedule-link";

export function ConfirmedActions({
  gameId,
  confirmedAt,
  canSchedule,
}: {
  gameId: string;
  confirmedAt: Date;
  canSchedule: boolean;
}) {
  return (
    <VStack gap={2}>
      <ConfirmedSessionNotice confirmedAt={confirmedAt} />
      <ActionHint>시작 1시간 전 디스코드로 알려드립니다.</ActionHint>
      {canSchedule && <ScheduleLink gameId={gameId} className={ACTION_SECONDARY_CLASS} />}
    </VStack>
  );
}
