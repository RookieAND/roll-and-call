import { VStack } from "@trpg/ui";

import { ConfirmedSessionNotice } from "@/entities/game";
import { LeaveGameButton } from "@/features/join-game";

import { ACTION_SECONDARY_CLASS } from "./action-class-names";
import { ActionHint } from "./action-hint";

export function ConfirmedWaitingActions({
  gameId,
  confirmedAt,
  waitlistRank,
  waitingCount,
}: {
  gameId: string;
  confirmedAt: Date;
  waitlistRank: number | null;
  waitingCount: number;
}) {
  return (
    <VStack gap={3}>
      <ConfirmedSessionNotice confirmedAt={confirmedAt} />
      <ActionHint>
        대기 {waitlistRank}번 · 총 {waitingCount}명 — 이번 회차는 자리가 없습니다. 다음 회차가
        열리면 알립니다.
      </ActionHint>
      <LeaveGameButton gameId={gameId} className={ACTION_SECONDARY_CLASS}>
        대기 취소
      </LeaveGameButton>
    </VStack>
  );
}
