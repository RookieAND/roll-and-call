import { HStack, Text, VStack } from "@trpg/ui";
import { CircleAlert } from "lucide-react";

import { LeaveGameButton } from "@/features/join-game";
import { StatusNotice } from "@/shared/ui";

import { ACTION_PAIR_CLASS, ACTION_PRIMARY_CLASS } from "./action-class-names";
import { ActionPair } from "./action-pair";
import { ScheduleLink } from "./schedule-link";

export function JoinedActions({
  gameId,
  canSchedule,
  canLeave,
  expired,
  drawn,
  viewerResponded,
}: {
  gameId: string;
  canSchedule: boolean;
  canLeave: boolean;
  expired: boolean;
  drawn: boolean;
  viewerResponded: boolean;
}) {
  const leaveLockedReason = drawn ? "추첨이 끝나" : expired ? "모집이 마감되어" : "정원이 차서";
  const needsResponse = canSchedule && !viewerResponded;

  // 취소할 수 없으면 왜 취소가 없는지 먼저 알리고, 그 아래에 조율 버튼 하나만 둔다.
  if (!canLeave) {
    return (
      <VStack gap={2}>
        <StatusNotice tone="muted" className="text-left">
          <Text typography="subtitle2" render={<p />}>
            참여가 확정되었습니다
          </Text>
          <Text typography="body3" foreground="muted" render={<p />} className="mt-1.5">
            {leaveLockedReason} 취소는 GM에게 문의해야 합니다.
          </Text>
        </StatusNotice>
        {canSchedule && <ScheduleLink gameId={gameId} className={ACTION_PRIMARY_CLASS} />}
      </VStack>
    );
  }

  return (
    <VStack gap={2}>
      {needsResponse && (
        <StatusNotice tone="muted" className="text-left">
          <HStack align="center" gap={2}>
            <CircleAlert size={15} className="shrink-0 text-warning-600" aria-hidden />
            <Text typography="subtitle2" foreground="warning">
              아직 가능 시간을 내지 않았습니다
            </Text>
          </HStack>
          <Text typography="body3" foreground="muted" render={<p />} className="mt-1.5">
            일정 조율에서 가능한 시간을 입력하세요.
          </Text>
        </StatusNotice>
      )}
      <ActionPair>
        <LeaveGameButton gameId={gameId} className={ACTION_PAIR_CLASS}>
          참여 취소
        </LeaveGameButton>
        {canSchedule && <ScheduleLink gameId={gameId} className={ACTION_PAIR_CLASS} />}
      </ActionPair>
    </VStack>
  );
}
