import { VStack } from "@trpg/ui";

import { JoinGameButton } from "@/features/join-game";
import { formatDate } from "@/shared/lib";

import { ACTION_PRIMARY_CLASS } from "./action-class-names";
import { JoinHint } from "./join-hint";

interface JoinableActionsProps {
  gameId: string;
  isFull: boolean;
  isLottery: boolean;
  waitingCount: number;
  endDate: Date;
}

// 선착순은 누르는 순간 확정, 추첨은 마감까지 결과를 모른다. 버튼 라벨로 그 차이를 먼저 말한다.
export function JoinableActions({
  gameId,
  isFull,
  isLottery,
  waitingCount,
  endDate,
}: JoinableActionsProps) {
  const joinLabel = isLottery ? "추첨 신청하기" : isFull ? "대기로 신청하기" : "신청하기";
  const joinHint = isLottery
    ? `${formatDate(endDate)} 마감 뒤 GM이 추첨합니다.`
    : isFull
      ? `지금 신청하면 대기 ${waitingCount + 1}번입니다.`
      : "지금 신청하면 바로 확정됩니다.";

  return (
    <VStack gap="125">
      <JoinHint>{joinHint}</JoinHint>
      <JoinGameButton gameId={gameId} className={ACTION_PRIMARY_CLASS}>
        {joinLabel}
      </JoinGameButton>
    </VStack>
  );
}
