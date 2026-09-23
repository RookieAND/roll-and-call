import { VStack } from "@roll-and-call/ui";

import { LeaveGameButton } from "@/features/join-game";
import { formatDate } from "@/shared/lib";

import { ActionNotice } from "./action-notice";

interface LotteryAppliedActionsProps {
  gameId: string;
  endDate: Date;
  expired: boolean;
}

// 추첨은 발표 전이라 할 일이 없다. 조율 버튼 없이 취소 하나만 남긴다.
export function LotteryAppliedActions({ gameId, endDate, expired }: LotteryAppliedActionsProps) {
  return (
    <VStack gap="125">
      <ActionNotice title="참여 신청이 접수되었습니다" colorPalette="primary">
        {expired
          ? "모집이 끝나 GM이 추첨합니다."
          : `${formatDate(endDate)} 모집이 끝나면 GM이 추첨하고,`}
        <br />
        결과는 알림으로 알려드립니다.
      </ActionNotice>
      <LeaveGameButton gameId={gameId} className="w-full">
        신청 취소
      </LeaveGameButton>
    </VStack>
  );
}
