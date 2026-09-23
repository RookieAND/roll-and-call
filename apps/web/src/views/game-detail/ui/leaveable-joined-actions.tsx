import { VStack } from "@roll-and-call/ui";

import { LeaveGameButton } from "@/features/join-game";

import { ActionNotice } from "./action-notice";
import { ActionPair } from "./action-pair";
import { ScheduleLink } from "./schedule-link";

interface LeaveableJoinedActionsProps {
  gameId: string;
  canSchedule: boolean;
}

export function LeaveableJoinedActions({ gameId, canSchedule }: LeaveableJoinedActionsProps) {
  const description = canSchedule
    ? "가능한 시간을 알려주시면 GM이 일정을 정합니다."
    : "시작 1시간 전 디스코드로 알립니다.";

  return (
    <VStack gap="125">
      <ActionNotice title="참여가 확정됐습니다" colorPalette="success">
        {description}
      </ActionNotice>
      <ActionPair>
        <LeaveGameButton gameId={gameId} className="flex-1">
          신청 취소
        </LeaveGameButton>
        {canSchedule && <ScheduleLink gameId={gameId} size="lg" className="flex-1" />}
      </ActionPair>
    </VStack>
  );
}
