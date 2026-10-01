import { VStack } from "@roll-and-call/ui";

import { JoinGameButton } from "@/features/join-game";

import { JoinHint } from "./join-hint";
import { joinHintText } from "./join-hint-text";

interface JoinableActionsProps {
  gameId: string;
  isFull: boolean;
  isLottery: boolean;
  waitingCount: number;
  endDate: Date;
}

export function JoinableActions({
  gameId,
  isFull,
  isLottery,
  waitingCount,
  endDate,
}: JoinableActionsProps) {
  const joinLabel = !isLottery && isFull ? "대기로 신청하기" : "신청하기";
  const joinHint = joinHintText({ isFull, isLottery, waitingCount, endDate });

  return (
    <VStack gap="125">
      <JoinHint>{joinHint}</JoinHint>
      <JoinGameButton gameId={gameId} className="w-full">
        {joinLabel}
      </JoinGameButton>
    </VStack>
  );
}
