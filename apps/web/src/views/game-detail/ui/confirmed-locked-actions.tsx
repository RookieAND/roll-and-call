import { VStack } from "@roll-and-call/ui";

import type { ConfirmedLeaveBlock } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

import type { ActionLinks } from "../model/game-action-view";
import { LEAVE_LOCKED_REASON } from "../model/leave-locked-reason";
import { ActionNotice } from "./action-notice";
import { ActionPair } from "./action-pair";
import { DrawResultLink } from "./draw-result-link";
import { GameCalendarButton } from "./game-calendar-button";
import { ScheduleLink } from "./schedule-link";

interface ConfirmedLockedActionsProps extends ActionLinks {
  game: GameDetailData;
  block: Exclude<ConfirmedLeaveBlock, "schedule">;
}

export function ConfirmedLockedActions({
  game,
  block,
  resultLink,
  scheduleLink,
  calendar,
}: ConfirmedLockedActionsProps) {
  const hasButtons = resultLink || scheduleLink || calendar;

  return (
    <VStack gap="125">
      <ActionNotice
        title="참여가 확정되었습니다"
        lines={[
          `${LEAVE_LOCKED_REASON[block]} 신청을 취소할 수 없습니다.`,
          "참여를 취소하려면 GM에게 직접 문의해 주세요.",
        ]}
        colorPalette="success"
      />
      {hasButtons && (
        <ActionPair>
          {resultLink && <DrawResultLink gameId={game.id} variant="outline" size="lg" />}
          {scheduleLink && <ScheduleLink gameId={game.id} size="lg" />}
          {!scheduleLink && calendar && <GameCalendarButton game={game} variant="tinted" />}
        </ActionPair>
      )}
    </VStack>
  );
}
