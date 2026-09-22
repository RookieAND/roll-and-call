import { VStack } from "@trpg/ui";
import { Check } from "lucide-react";

import { formatDateTime } from "@/shared/lib";

import { ACTION_PAIR_CLASS } from "./action-class-names";
import { ActionNotice } from "./action-notice";
import { ActionPair } from "./action-pair";
import { DrawResultLink } from "./draw-result-link";
import { ScheduleLink } from "./schedule-link";

interface ConfirmedActionsProps {
  gameId: string;
  confirmedAt: Date;
  canSchedule: boolean;
  drawn: boolean;
}

// 일정이 확정되면 취소 버튼이 사라진다. 조율 화면은 확정된 일정을 보는 곳으로 남는다.
export function ConfirmedActions({
  gameId,
  confirmedAt,
  canSchedule,
  drawn,
}: ConfirmedActionsProps) {
  const hasActions = canSchedule || drawn;

  return (
    <VStack gap="125">
      <ActionNotice
        title={`${formatDateTime(confirmedAt)}으로 확정됐습니다`}
        tone="success"
        icon={Check}
      >
        일정이 확정되어 신청을 취소할 수 없습니다.
        <br />
        참여를 취소하려면 GM에게 직접 문의해 주세요.
      </ActionNotice>
      {hasActions && (
        <ActionPair>
          {drawn && (
            <DrawResultLink gameId={gameId} variant="outline" className={ACTION_PAIR_CLASS} />
          )}
          {canSchedule && (
            <ScheduleLink gameId={gameId} label="일정 보기" className={ACTION_PAIR_CLASS} />
          )}
        </ActionPair>
      )}
    </VStack>
  );
}
