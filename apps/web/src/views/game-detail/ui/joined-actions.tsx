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

  // 취소할 수 없으면 조율 버튼 하나만 두고, 그 아래에 왜 취소가 없는지 적는다.
  if (!canLeave) {
    return (
      <VStack gap={2}>
        {canSchedule && <ScheduleLink gameId={gameId} className={ACTION_PRIMARY_CLASS} />}
        <StatusNotice tone="muted">{leaveLockedMessage}</StatusNotice>
      </VStack>
    );
  }

  return (
    <VStack gap={2}>
      {needsResponse && (
        <HStack align="center" gap={2}>
          <CircleAlert size={15} className="shrink-0 text-warning-600" aria-hidden />
          <Text typography="body3" foreground="warning" className="font-semibold">
            아직 가능 시간을 내지 않았습니다.
          </Text>
        </HStack>
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
