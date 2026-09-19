import { VStack } from "@trpg/ui";

import { JoinGameButton } from "@/features/join-game";

import { ACTION_PRIMARY_CLASS } from "./action-class-names";
import { ActionHint } from "./action-hint";

export function JoinableActions({
  gameId,
  isFull,
  isLottery,
  canSchedule,
  waitingCount,
  maxPlayers,
}: {
  gameId: string;
  isFull: boolean;
  isLottery: boolean;
  canSchedule: boolean;
  waitingCount: number;
  maxPlayers: number;
}) {
  const scheduleHint = canSchedule ? "참여하면 가능한 시간을 입력하게 됩니다." : null;

  // 추첨은 정원과 무관하게 받으므로 대기 순번 대신 뽑는 인원을 알린다.
  const joinLabel = isLottery ? "신청하기" : isFull ? "대기 신청하기" : "참여하기";
  const joinHint = isLottery
    ? `마감 뒤 GM이 추첨으로 ${maxPlayers}명을 정합니다.`
    : isFull
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
