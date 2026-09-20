import { VStack } from "@trpg/ui";

import { ConfirmedSessionNotice } from "@/entities/game";
import { LeaveGameButton } from "@/features/join-game";

import { ACTION_SECONDARY_CLASS } from "./action-class-names";
import { WaitlistRankNotice } from "./waitlist-rank-notice";

interface ConfirmedWaitingActionsProps {
  gameId: string;
  confirmedAt: Date;
  waitlistRank: number | null;
}

// 순번을 먼저 알리고, 그 아래에 확정된 세션 시간을 읽는 정보로 둔다.
export function ConfirmedWaitingActions({
  gameId,
  confirmedAt,
  waitlistRank,
}: ConfirmedWaitingActionsProps) {
  return (
    <VStack gap="100">
      <WaitlistRankNotice
        rank={waitlistRank}
        note="이번 회차는 자리가 없습니다. 다음 회차가 열리면 알립니다."
      />
      <ConfirmedSessionNotice confirmedAt={confirmedAt} />
      <LeaveGameButton gameId={gameId} className={ACTION_SECONDARY_CLASS}>
        대기 취소
      </LeaveGameButton>
    </VStack>
  );
}
