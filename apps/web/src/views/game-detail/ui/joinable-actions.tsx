import { VStack } from "@trpg/ui";

import { JoinGameButton } from "@/features/join-game";

import { ACTION_PRIMARY_CLASS } from "./action-class-names";
import { ActionHint } from "./action-hint";

export function JoinableActions({
  gameId,
  isFull,
  canSchedule,
  waitingCount,
}: {
  gameId: string;
  isFull: boolean;
  canSchedule: boolean;
  waitingCount: number;
}) {
  const joinLabel = isFull ? "대기 신청하기" : "참여하기";
  const scheduleHint = canSchedule ? "참여하면 가능한 시간을 입력하게 됩니다." : null;
  const joinHint = isFull
    ? `지금 신청하면 대기 ${waitingCount + 1}번입니다. 자리가 나면 순서대로 확정됩니다.`
    : scheduleHint;

  return (
    <VStack gap={2}>
      <JoinGameButton gameId={gameId} className={ACTION_PRIMARY_CLASS}>
        {joinLabel}
      </JoinGameButton>
      {joinHint && <ActionHint>{joinHint}</ActionHint>}
    </VStack>
  );
}
