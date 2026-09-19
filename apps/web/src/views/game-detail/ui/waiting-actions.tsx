import { VStack } from "@trpg/ui";

import { LeaveGameButton } from "@/features/join-game";
import { formatDateTime } from "@/shared/lib";
import { StatusNotice } from "@/shared/ui";

import { ACTION_SECONDARY_CLASS } from "./action-class-names";
import { ActionHint } from "./action-hint";
import { ActionPair } from "./action-pair";
import { ScheduleLink } from "./schedule-link";

export function WaitingActions({
  gameId,
  canSchedule,
  waitlistRank,
  waitingCount,
  endDate,
}: {
  gameId: string;
  canSchedule: boolean;
  waitlistRank: number | null;
  waitingCount: number;
  endDate: Date;
}) {
  const leaveButton = (
    <LeaveGameButton gameId={gameId} className={ACTION_SECONDARY_CLASS}>
      대기 취소
    </LeaveGameButton>
  );

  return (
    <VStack gap={2}>
      <StatusNotice tone="muted">
        대기로 접수됐습니다 · 자리가 나면 순서대로 확정됩니다.
      </StatusNotice>
      <ActionHint>
        대기 {waitlistRank}번 · 총 {waitingCount}명 · 마감 {formatDateTime(endDate)}
      </ActionHint>
      {canSchedule ? (
        <ActionPair>
          {leaveButton}
          <ScheduleLink gameId={gameId} className={ACTION_SECONDARY_CLASS} />
        </ActionPair>
      ) : (
        leaveButton
      )}
    </VStack>
  );
}
