import { Text, VStack } from "@trpg/ui";

import { LeaveGameButton } from "@/features/join-game";
import { StatusNotice } from "@/shared/ui";

import { ACTION_PAIR_CLASS, ACTION_SECONDARY_CLASS } from "./action-class-names";
import { ActionPair } from "./action-pair";
import { ScheduleLink } from "./schedule-link";

export function WaitingActions({
  gameId,
  canSchedule,
  waitlistRank,
  waitingCount,
}: {
  gameId: string;
  canSchedule: boolean;
  waitlistRank: number | null;
  waitingCount: number;
}) {
  return (
    <VStack gap={2}>
      <StatusNotice tone="muted" className="text-left">
        <Text typography="subtitle2" render={<p />}>
          대기로 접수됐습니다
        </Text>
        <Text typography="body3" foreground="muted" render={<p />} className="mt-1.5">
          자리가 나면 순서대로 확정됩니다.
        </Text>
        <Text typography="body3" foreground="muted" render={<p />} className="mt-2 tabular-nums">
          대기 {waitlistRank}번 · 총 {waitingCount}명
        </Text>
      </StatusNotice>
      {canSchedule ? (
        <ActionPair>
          <LeaveGameButton gameId={gameId} className={ACTION_PAIR_CLASS}>
            대기 취소
          </LeaveGameButton>
          <ScheduleLink gameId={gameId} className={ACTION_PAIR_CLASS} />
        </ActionPair>
      ) : (
        <LeaveGameButton gameId={gameId} className={ACTION_SECONDARY_CLASS}>
          대기 취소
        </LeaveGameButton>
      )}
    </VStack>
  );
}
