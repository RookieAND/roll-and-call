import { VStack } from "@roll-and-call/ui";

import { LeaveGameButton } from "@/features/join-game";

import { ActionNotice } from "./action-notice";
import { ActionPair } from "./action-pair";
import { DrawResultLink } from "./draw-result-link";

interface WaitingActionsProps {
  gameId: string;
  waitlistRank: number | null;
  isLottery: boolean;
}

export function WaitingActions({ gameId, waitlistRank, isLottery }: WaitingActionsProps) {
  const title = waitlistRank === null ? "대기로 접수됐습니다" : `현재 대기 ${waitlistRank}번입니다`;

  return (
    <VStack gap="125">
      <ActionNotice title={title} colorPalette="gray">
        자리가 나면 순서대로 확정되고 알림이 갑니다.
      </ActionNotice>
      <ActionPair>
        <LeaveGameButton gameId={gameId} className="flex-1">
          대기 취소
        </LeaveGameButton>
        {isLottery && (
          <DrawResultLink gameId={gameId} variant="tinted" size="lg" className="flex-1" />
        )}
      </ActionPair>
    </VStack>
  );
}
