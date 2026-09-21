import { VStack } from "@trpg/ui";
import { CircleAlert } from "lucide-react";

import { LeaveGameButton } from "@/features/join-game";

import { ACTION_PAIR_CLASS } from "./action-class-names";
import { ActionNotice } from "./action-notice";
import { ActionPair } from "./action-pair";
import { SimilarGamesLink } from "./similar-games-link";

interface ConfirmedWaitingActionsProps {
  gameId: string;
  waitlistRank: number | null;
}

// 세션이 확정되면 순번보다 자리가 안 날 수 있다는 사실을 먼저 알린다.
export function ConfirmedWaitingActions({ gameId, waitlistRank }: ConfirmedWaitingActionsProps) {
  const rankLabel = waitlistRank === null ? "대기 순번은" : `대기 ${waitlistRank}번은`;

  return (
    <VStack gap="125">
      <ActionNotice title="세션 시간이 정해져 신청이 닫혔습니다" tone="warning" icon={CircleAlert}>
        {rankLabel} 그대로 유지되고, 취소가 생기면 순서대로 연락드립니다.
        <br />
        하지만 자리가 나지 않을 수 있으니 다른 구인글도 함께 찾아보세요.
      </ActionNotice>
      <ActionPair>
        <LeaveGameButton gameId={gameId} className={ACTION_PAIR_CLASS}>
          대기 취소
        </LeaveGameButton>
        <SimilarGamesLink className={ACTION_PAIR_CLASS} />
      </ActionPair>
    </VStack>
  );
}
