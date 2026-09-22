import { VStack } from "@roll-and-call/ui";
import { Clock, Dices, Users } from "lucide-react";

import { LeaveGameButton } from "@/features/join-game";
import { formatDate } from "@/shared/lib";

import { ACTION_PAIR_CLASS, ACTION_PRIMARY_CLASS } from "./action-class-names";
import { ActionNotice } from "./action-notice";
import { ActionPair } from "./action-pair";
import { DrawResultLink } from "./draw-result-link";

interface WaitingActionsProps {
  gameId: string;
  waitlistRank: number | null;
  isLottery: boolean;
  drawn: boolean;
  endDate: Date;
  expired: boolean;
}

// 선착순은 신청하는 순간부터 순번이 있고, 추첨은 발표 뒤에 순번이 생긴다.
export function WaitingActions({
  gameId,
  waitlistRank,
  isLottery,
  drawn,
  endDate,
  expired,
}: WaitingActionsProps) {
  if (isLottery && !drawn) {
    return (
      <VStack gap="125">
        <ActionNotice title="참여 신청이 접수되었습니다" tone="primary" icon={Clock}>
          {expired
            ? "모집이 끝나 GM이 추첨하면 결과는 알림으로 알려드립니다."
            : `${formatDate(endDate)} 모집이 끝나면 GM이 추첨하고, 결과는 알림으로 알려드립니다.`}
        </ActionNotice>
        <LeaveGameButton gameId={gameId} className={ACTION_PRIMARY_CLASS}>
          신청 취소
        </LeaveGameButton>
      </VStack>
    );
  }

  const title = waitlistRank === null ? "대기로 접수됐습니다" : `현재 대기 ${waitlistRank}번입니다`;
  const icon = isLottery ? Dices : Users;

  return (
    <VStack gap="125">
      <ActionNotice title={title} icon={icon}>
        자리가 나면 순서대로 확정되고 알림이 갑니다.
      </ActionNotice>
      <ActionPair>
        <LeaveGameButton gameId={gameId} className={ACTION_PAIR_CLASS}>
          대기 취소
        </LeaveGameButton>
        {isLottery && (
          <DrawResultLink gameId={gameId} variant="tinted" className={ACTION_PAIR_CLASS} />
        )}
      </ActionPair>
    </VStack>
  );
}
