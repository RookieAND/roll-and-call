import { LeaveGameButton } from "@/features/join-game";

import { ACTION_SECONDARY_CLASS } from "./action-class-names";
import { ActionPair } from "./action-pair";
import { ScheduleLink } from "./schedule-link";

// 순번·마감 등 대기 상세는 참여자 아래 대기 섹션이 맡는다. 액션 바에는 한 줄만.
export function WaitingActions({ gameId, canSchedule }: { gameId: string; canSchedule: boolean }) {
  const leaveButton = (
    <LeaveGameButton gameId={gameId} className={ACTION_SECONDARY_CLASS}>
      대기 취소
    </LeaveGameButton>
  );

  if (!canSchedule) return leaveButton;

  return (
    <ActionPair>
      <ScheduleLink gameId={gameId} className={ACTION_SECONDARY_CLASS} />
      {leaveButton}
    </ActionPair>
  );
}
