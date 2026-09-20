import { Text, VStack } from "@trpg/ui";

import { StatusNotice } from "@/shared/ui";

import { LEAVE_LOCKED_REASON, type LeaveLock } from "../model/leave-locked-reason";
import { ACTION_PRIMARY_CLASS } from "./action-class-names";
import { ScheduleLink } from "./schedule-link";

// 취소할 수 없으면 왜 취소가 없는지 먼저 알리고, 그 아래에 조율 버튼 하나만 둔다.
export function LockedJoinedActions({
  gameId,
  canSchedule,
  lock,
}: {
  gameId: string;
  canSchedule: boolean;
  lock: LeaveLock;
}) {
  return (
    <VStack gap="100">
      <StatusNotice tone="muted" className="text-left">
        <Text typography="body4" weight="bold" render={<p />}>
          참여가 확정됐습니다
        </Text>
        <Text typography="body3" foreground="muted" render={<p />} className="mt-075">
          {LEAVE_LOCKED_REASON[lock]} 혼자 취소할 수 없습니다. GM에게 말해주세요.
        </Text>
      </StatusNotice>
      {canSchedule && <ScheduleLink gameId={gameId} className={ACTION_PRIMARY_CLASS} />}
    </VStack>
  );
}
