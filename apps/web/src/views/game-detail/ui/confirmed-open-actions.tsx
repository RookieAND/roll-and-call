import { VStack } from "@roll-and-call/ui";

import { LEAVE_KIND, LeaveConfirmButton } from "@/features/join-game";
import { formatDateTime } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";

import type { ActionLinks } from "../model/game-action-view";
import { ActionNotice } from "./action-notice";
import { ActionPair } from "./action-pair";
import { GameCalendarButton } from "./game-calendar-button";
import { ScheduleLink } from "./schedule-link";

interface ConfirmedOpenActionsProps extends ActionLinks {
  game: GameDetailData;
  confirmedAt: Date | null;
}

// 조율형은 아직 시각이 없어 [일정 조율], 일시 지정형은 시각이 있어 [캘린더에 추가]를 붙인다.
export function ConfirmedOpenActions({
  game,
  confirmedAt,
  scheduleLink,
  calendar,
}: ConfirmedOpenActionsProps) {
  const line = confirmedAt
    ? `${formatDateTime(confirmedAt)}에 진행합니다.`
    : "가능한 시간을 알려 주시면 GM이 일정을 정합니다.";

  return (
    <VStack gap="125">
      <ActionNotice title="참여가 확정되었습니다" lines={[line]} colorPalette="success" />
      <ActionPair>
        <LeaveConfirmButton gameId={game.id} kind={LEAVE_KIND.confirmed} size="lg" />
        {scheduleLink && <ScheduleLink gameId={game.id} size="lg" />}
        {!scheduleLink && calendar && <GameCalendarButton game={game} variant="tinted" />}
      </ActionPair>
    </VStack>
  );
}
