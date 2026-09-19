import { VStack } from "@trpg/ui";

import { LeaveGameButton } from "@/features/join-game";

import { ACTION_PAIR_CLASS, ACTION_SECONDARY_CLASS } from "./action-class-names";
import { ActionPair } from "./action-pair";
import { ScheduleLink } from "./schedule-link";
import { WaitlistRankNotice } from "./waitlist-rank-notice";

export function WaitingActions({
  gameId,
  canSchedule,
  waitlistRank,
  pendingDraw,
}: {
  gameId: string;
  canSchedule: boolean;
  waitlistRank: number | null;
  pendingDraw: boolean;
}) {
  return (
    <VStack gap={2}>
      <WaitlistRankNotice
        rank={waitlistRank}
        pendingDraw={pendingDraw}
        note={pendingDraw ? "추첨이 끝나면 결과를 알립니다." : "자리가 나면 순서대로 확정됩니다."}
      />
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
