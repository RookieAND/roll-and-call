import { VStack } from "@trpg/ui";
import { Clock } from "lucide-react";

import { LeaveGameButton } from "@/features/join-game";
import { formatDate } from "@/shared/lib";

import { ACTION_PRIMARY_CLASS } from "./action-class-names";
import { ActionNotice } from "./action-notice";

interface WaitingActionsProps {
  gameId: string;
  waitlistRank: number | null;
  pendingDraw: boolean;
  endDate: Date;
  expired: boolean;
}

// 추첨제는 뽑기 전까지 순번이 없다 — 숫자 대신 언제 뽑는지 말한다.
export function WaitingActions({
  gameId,
  waitlistRank,
  pendingDraw,
  endDate,
  expired,
}: WaitingActionsProps) {
  if (pendingDraw) {
    return (
      <VStack gap="125">
        <ActionNotice title="추첨 신청이 접수되었습니다" tone="primary" icon={Clock}>
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

  const title =
    waitlistRank === null
      ? "대기로 접수됐습니다"
      : `현재 대기 ${waitlistRank}번으로 등록되었습니다`;

  return (
    <VStack gap="125">
      <ActionNotice title={title}>참여 인원의 공백이 생기면 GM이 순서대로 확정합니다.</ActionNotice>
      <LeaveGameButton gameId={gameId} className={ACTION_PRIMARY_CLASS}>
        대기 취소
      </LeaveGameButton>
    </VStack>
  );
}
