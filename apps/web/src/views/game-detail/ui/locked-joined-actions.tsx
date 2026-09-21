import { VStack } from "@trpg/ui";

import { LEAVE_LOCKED_REASON, type LeaveLock } from "../model/leave-locked-reason";
import { ACTION_PRIMARY_CLASS } from "./action-class-names";
import { ActionNotice } from "./action-notice";
import { ScheduleLink } from "./schedule-link";

interface LockedJoinedActionsProps {
  gameId: string;
  canSchedule: boolean;
  lock: LeaveLock;
}

// 취소할 수 없으면 왜 취소가 없는지 먼저 알리고, 그 아래에 조율 버튼 하나만 둔다.
export function LockedJoinedActions({ gameId, canSchedule, lock }: LockedJoinedActionsProps) {
  return (
    <VStack gap="125">
      <ActionNotice>
        {LEAVE_LOCKED_REASON[lock]} 신청을 취소할 수 없습니다.
        <br />
        참여를 취소하려면 GM에게 직접 문의해 주세요.
      </ActionNotice>
      {canSchedule && <ScheduleLink gameId={gameId} className={ACTION_PRIMARY_CLASS} />}
    </VStack>
  );
}
