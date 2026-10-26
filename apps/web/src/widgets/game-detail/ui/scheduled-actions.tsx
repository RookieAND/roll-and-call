import type { GameDetailData } from "@roll-and-call/database/games";
import { Button, VStack } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

import { confirmedWhenText } from "../model/confirmed-when-text";
import type { ActionLinks } from "../model/game-action-view";
import { REVIEW_STATUS, type ReviewStatus } from "../model/review-status";
import { ActionNotice } from "./action-notice";
import { ActionPair } from "./action-pair";
import { DrawResultLink } from "./draw-result-link";
import { GameCalendarButton } from "./game-calendar-button";
import { ReviewsLink } from "./reviews-link";
import { ScheduleLink } from "./schedule-link";

interface ScheduledActionsProps extends ActionLinks {
  game: GameDetailData;
  confirmedAt: Date;
  live: boolean;
  review: ReviewStatus;
}

const LOCKED_LINES = [
  "일정이 확정되어 신청을 취소할 수 없습니다.",
  "참여를 취소하려면 GM에게 직접 문의해 주세요.",
];

const LIVE_LINES = ["세션이 진행 중입니다.", "끝나면 후기를 쓸 수 있습니다."];
const LIVE_REVIEW_LINES = ["세션이 진행 중입니다.", "세션이 끝난 뒤 7일까지 작성할 수 있습니다."];

// 진행 중에는 안내가 바뀌고 [캘린더에 추가]가 사라진다. 시작 시각부터 후기를 쓸 수 있어 후기 입구가 생긴다.
export function ScheduledActions({
  game,
  confirmedAt,
  live,
  review,
  resultLink,
  scheduleLink,
  calendar,
}: ScheduledActionsProps) {
  const reviewEntry = live && review !== REVIEW_STATUS.unavailable;
  const liveLines = reviewEntry ? LIVE_REVIEW_LINES : LIVE_LINES;
  const lines = live ? liveLines : LOCKED_LINES;
  const hasButtons = resultLink || scheduleLink || calendar || reviewEntry;

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
          {reviewEntry && review === REVIEW_STATUS.writable && (
            <Button
              render={<ServerLink path={`/games/${game.id}/review`} />}
              variant="tinted"
              size="lg"
            >
              후기 쓰기
            </Button>
          )}
          {reviewEntry && review === REVIEW_STATUS.written && <ReviewsLink gameId={game.id} />}
        </ActionPair>
      )}
    </VStack>
  );
}
