import { Text, VStack } from "@trpg/ui";

import { ConfirmedSessionNotice } from "@/entities/game";
import { LeaveGameButton } from "@/features/join-game";
import { StatusNotice } from "@/shared/ui";

import { ACTION_SECONDARY_CLASS } from "./action-class-names";

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
    <VStack gap={2}>
      <ConfirmedSessionNotice confirmedAt={confirmedAt} />
      <StatusNotice tone="muted" className="text-left">
        <Text typography="subtitle2" render={<p />}>
          이번 회차는 자리가 없습니다
        </Text>
        <Text typography="body3" foreground="muted" render={<p />} className="mt-1.5">
          다음 회차가 열리면 알립니다.
        </Text>
        <Text typography="body3" foreground="muted" render={<p />} className="mt-2 tabular-nums">
          대기 {waitlistRank}번 · 총 {waitingCount}명
        </Text>
      </StatusNotice>
      <LeaveGameButton gameId={gameId} className={ACTION_SECONDARY_CLASS}>
        대기 취소
      </LeaveGameButton>
    </VStack>
  );
}
