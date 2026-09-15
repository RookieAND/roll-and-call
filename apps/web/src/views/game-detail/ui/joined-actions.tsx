import { VStack } from "@trpg/ui";

import { LeaveGameButton } from "@/features/join-game";
import { StatusNotice } from "@/shared/ui";

import { ACTION_PRIMARY_CLASS, ACTION_SECONDARY_CLASS } from "./action-class-names";
import { ActionHint } from "./action-hint";
import { ScheduleLink } from "./schedule-link";

export function JoinedActions({
  gameId,
  canSchedule,
  canLeave,
  expired,
  viewerResponded,
}: {
  gameId: string;
  canSchedule: boolean;
  canLeave: boolean;
  expired: boolean;
  viewerResponded: boolean;
}) {
  const leaveLockedMessage = expired
    ? "참여가 확정되었습니다 · 모집이 마감되어 취소는 GM에게 문의해야 합니다"
    : "참여가 확정되었습니다 · 정원이 차서 취소는 GM에게 문의해야 합니다";
  const needsResponse = canSchedule && !viewerResponded;

  return (
    <VStack gap={2}>
      {!canLeave && <StatusNotice tone="muted">{leaveLockedMessage}</StatusNotice>}
      {needsResponse && <ActionHint>아직 가능 시간을 내지 않았습니다.</ActionHint>}
      {canSchedule && <ScheduleLink gameId={gameId} className={ACTION_PRIMARY_CLASS} />}
      {canLeave && (
        <LeaveGameButton gameId={gameId} className={ACTION_SECONDARY_CLASS}>
          참여 취소
        </LeaveGameButton>
      )}
    </VStack>
  );
}
