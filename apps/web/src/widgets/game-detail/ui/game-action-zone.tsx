import { formatDateClock } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";

import { GAME_ACTION_VIEW, type GameActionView } from "../model/game-action-view";
import { AbsentActions } from "./absent-actions";
import { CancelledActions } from "./cancelled-actions";
import { ClosedActions } from "./closed-actions";
import { ConfirmedLockedActions } from "./confirmed-locked-actions";
import { ConfirmedOpenActions } from "./confirmed-open-actions";
import { EndedGmActions } from "./ended-gm-actions";
import { EndedParticipantActions } from "./ended-participant-actions";
import { GmLiveActions } from "./gm-live-actions";
import { GmUpcomingActions } from "./gm-upcoming-actions";
import { JoinableActions } from "./joinable-actions";
import { LotteryAppliedActions } from "./lottery-applied-actions";
import { SanctionedActions } from "./sanctioned-actions";
import { ScheduledActions } from "./scheduled-actions";
import { SelectionAppliedActions } from "./selection-applied-actions";
import { WaitingActions } from "./waiting-actions";

export interface GameActionZoneProps {
  game: GameDetailData;
  view: GameActionView;
}

export function GameActionZone({ game, view }: GameActionZoneProps) {
  switch (view.kind) {
    case GAME_ACTION_VIEW.cancelled:
      return <CancelledActions gameId={game.id} {...view} />;
    case GAME_ACTION_VIEW.gmEnded:
      return <EndedGmActions gameId={game.id} {...view} />;
    case GAME_ACTION_VIEW.gmLive:
      return <GmLiveActions gameId={game.id} {...view} />;
    case GAME_ACTION_VIEW.gmUpcoming:
      return <GmUpcomingActions game={game} calendar={view.calendar} />;
    case GAME_ACTION_VIEW.absent:
      return <AbsentActions />;
    case GAME_ACTION_VIEW.endedParticipant:
      return <EndedParticipantActions gameId={game.id} {...view} />;
    case GAME_ACTION_VIEW.endedOther:
      return <ClosedActions title="종료된 세션입니다" reviewsGameId={game.id} />;
    case GAME_ACTION_VIEW.lotteryApplied:
      return <LotteryAppliedActions gameId={game.id} {...view} />;
    case GAME_ACTION_VIEW.selectionApplied:
      return <SelectionAppliedActions gameId={game.id} {...view} />;
    case GAME_ACTION_VIEW.waiting:
      return <WaitingActions gameId={game.id} {...view} />;
    case GAME_ACTION_VIEW.scheduled:
      return <ScheduledActions game={game} {...view} />;
    case GAME_ACTION_VIEW.confirmedOpen:
      return <ConfirmedOpenActions game={game} {...view} />;
    case GAME_ACTION_VIEW.confirmedLocked:
      return <ConfirmedLockedActions game={game} {...view} />;
    case GAME_ACTION_VIEW.closedScheduled:
      return <ClosedActions title="일정이 확정되어 신청을 받지 않습니다" />;
    case GAME_ACTION_VIEW.closed:
      return <ClosedActions title="모집이 끝났습니다" />;
    case GAME_ACTION_VIEW.sanctioned:
      return <SanctionedActions reason={view.reason} until={view.until} />;
    case GAME_ACTION_VIEW.joinWaitlist:
      return (
        <JoinableActions
          gameId={game.id}
          applicationNote={game.applicationNoteEnabled}
          hint={`지금 신청하면 대기 ${view.nextRank}번입니다.`}
          label="대기로 신청하기"
        />
      );
    case GAME_ACTION_VIEW.join:
      return (
        <JoinableActions
          gameId={game.id}
          applicationNote={game.applicationNoteEnabled}
          hint="지금 신청하면 바로 확정됩니다."
          label="신청하기"
        />
      );
    case GAME_ACTION_VIEW.joinLottery:
      return (
        <JoinableActions
          gameId={game.id}
          applicationNote={game.applicationNoteEnabled}
          hint={`${formatDateClock(view.endDate)} 마감 때 추첨합니다.`}
          label="신청하기"
        />
      );
    case GAME_ACTION_VIEW.joinSelection:
      return (
        <JoinableActions
          gameId={game.id}
          applicationNote={game.applicationNoteEnabled}
          hint={`${formatDateClock(view.endDate)} 모집이 끝나면 GM이 선발합니다.`}
          label="신청하기"
        />
      );
  }
}
