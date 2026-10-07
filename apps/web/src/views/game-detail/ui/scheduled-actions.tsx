import { VStack } from "@roll-and-call/ui";

import type { GameDetailData } from "@/shared/server";

import { confirmedWhenText } from "../model/confirmed-when-text";
import type { ActionLinks } from "../model/game-action-view";
import { ActionNotice } from "./action-notice";
import { ActionPair } from "./action-pair";
import { DrawResultLink } from "./draw-result-link";
import { GameCalendarButton } from "./game-calendar-button";
import { ScheduleLink } from "./schedule-link";

interface ScheduledActionsProps extends ActionLinks {
  game: GameDetailData;
  confirmedAt: Date;
  live: boolean;
}

const LOCKED_LINES = [
  "일정이 확정되어 신청을 취소할 수 없습니다.",
  "참여를 취소하려면 GM에게 직접 문의해 주세요.",
];

// 진행 중에는 제목만 남고 [캘린더에 추가]가 사라진다.
export function ScheduledActions({
  game,
  confirmedAt,
  live,
  resultLink,
  scheduleLink,
  calendar,
}: ScheduledActionsProps) {
  const lines = live ? [] : LOCKED_LINES;
  const hasButtons = resultLink || scheduleLink || calendar;

  return (
    <VStack gap="125">
      <ActionNotice
        title={`${confirmedWhenText(confirmedAt)} 확정되었습니다`}
        lines={lines}
        colorPalette="success"
      />
      {hasButtons && (
        <ActionPair>
          {resultLink && <DrawResultLink gameId={game.id} variant="outline" size="lg" />}
          {scheduleLink && (
            <ScheduleLink gameId={game.id} label="일정 보기" variant="outline" size="lg" />
          )}
          {calendar && <GameCalendarButton game={game} variant="tinted" />}
        </ActionPair>
      )}
    </VStack>
  );
}
