import { VStack } from "@roll-and-call/ui";
import { Check } from "lucide-react";

import { LEAVE_LOCKED_REASON, type LeaveLock } from "../model/leave-locked-reason";
import { ACTION_PAIR_CLASS } from "./action-class-names";
import { ActionNotice } from "./action-notice";
import { ActionPair } from "./action-pair";
import { DrawResultLink } from "./draw-result-link";
import { ScheduleLink } from "./schedule-link";

interface LockedJoinedActionsProps {
  gameId: string;
  canSchedule: boolean;
  drawn: boolean;
  lock: LeaveLock;
}

// 취소할 수 없으면 왜 없는지 먼저 알린다. 추첨이면 취소 자리를 결과 보기가 차지한다.
export function LockedJoinedActions({
  gameId,
  canSchedule,
  drawn,
  lock,
}: LockedJoinedActionsProps) {
  const hasActions = canSchedule || drawn;

  return (
    <VStack gap="125">
      <ActionNotice title="참여가 확정됐습니다" tone="success" icon={Check}>
        {LEAVE_LOCKED_REASON[lock]} 신청을 취소할 수 없습니다.
        <br />
        참여를 취소하려면 GM에게 직접 문의해 주세요.
      </ActionNotice>
      {hasActions && (
        <ActionPair>
          {drawn && (
            <DrawResultLink gameId={gameId} variant="outline" className={ACTION_PAIR_CLASS} />
          )}
          {canSchedule && <ScheduleLink gameId={gameId} className={ACTION_PAIR_CLASS} />}
        </ActionPair>
      )}
    </VStack>
  );
}
