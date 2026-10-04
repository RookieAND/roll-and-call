import { isNull } from "es-toolkit";

import {
  GAME_STATUS,
  type GameStatus,
  isApplicationClosed,
  isAttendanceDue,
  isSessionEnded,
  PARTICIPANT_STATUS,
  type ParticipantStatus,
  RECRUIT_METHOD,
} from "@/entities/game";
import { formatDateTime } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";

import { deriveActionView, GAME_ACTION_VIEW } from "../model/derive-action-view";
import { leaveLock } from "../model/leave-locked-reason";
import { ClosedActions } from "./closed-actions";
import { ConfirmedActions } from "./confirmed-actions";
import { EndedActions } from "./ended-actions";
import { EndedGmActions } from "./ended-gm-actions";
import { JoinableActions } from "./joinable-actions";
import { LeaveableJoinedActions } from "./leaveable-joined-actions";
import { LockedJoinedActions } from "./locked-joined-actions";
import { LotteryAppliedActions } from "./lottery-applied-actions";
import { ManageGameLink } from "./manage-game-link";
import { WaitingActions } from "./waiting-actions";

export interface GameActionZoneProps {
  game: GameDetailData;
  isGm: boolean;
  viewerStatus: ParticipantStatus | null;
  waitlistRank: number | null;
  waitingCount: number;
  confirmedCount: number;
  status: GameStatus;
  canSchedule: boolean;
}

export function GameActionZone({
  game,
  isGm,
  viewerStatus,
  waitlistRank,
  waitingCount,
  confirmedCount,
  status,
  canSchedule,
}: GameActionZoneProps) {
  // 기한 경과, 대기 신청을 끈 게임의 정원 충족(full), 조율형의 일정 확정(scheduled). 대기 받는 정원 충족(confirmed)은 마감이 아니다.
  const isClosed =
    status === GAME_STATUS.closed ||
    status === GAME_STATUS.full ||
    status === GAME_STATUS.scheduled;
  const isFull = status === GAME_STATUS.confirmed;
  const expired = status === GAME_STATUS.closed;
  const isLottery = game.recruitMethod === RECRUIT_METHOD.lottery;
  const drawn = !isNull(game.drawnAt);

  const actionView = deriveActionView({
    isGm,
    viewerConfirmed: viewerStatus === PARTICIPANT_STATUS.confirmed,
    viewerWaiting: viewerStatus === PARTICIPANT_STATUS.waiting,
    isLottery,
    drawn,
    canLeave: !isFull && !isClosed && !drawn,
    // 일시 지정형은 등록 때부터 confirmedAt이 있지만 모집 중이면 참여하기를 보여야 한다.
    sessionConfirmed: isApplicationClosed(game),
    sessionEnded: isSessionEnded(game),
    isClosed,
    isFull,
  });

  switch (actionView) {
    case GAME_ACTION_VIEW.gm:
      return <ManageGameLink gameId={game.id} />;
    case GAME_ACTION_VIEW.joinable:
    case GAME_ACTION_VIEW.full:
      return (
        <JoinableActions
          gameId={game.id}
          isFull={actionView === GAME_ACTION_VIEW.full}
          isLottery={isLottery}
          waitingCount={waitingCount}
          endDate={game.endDate}
        />
      );
    case GAME_ACTION_VIEW.applied:
      return isLottery ? (
        <LotteryAppliedActions gameId={game.id} endDate={game.endDate} expired={expired} />
      ) : (
        <LeaveableJoinedActions gameId={game.id} canSchedule={canSchedule} />
      );
    case GAME_ACTION_VIEW.waiting:
      return <WaitingActions gameId={game.id} waitlistRank={waitlistRank} isLottery={isLottery} />;
    case GAME_ACTION_VIEW.joined:
      return (
        <LockedJoinedActions
          gameId={game.id}
          canSchedule={canSchedule}
          drawn={drawn}
          lock={leaveLock({ drawn, expired })}
        />
      );
    case GAME_ACTION_VIEW.scheduled:
      return (
        <ConfirmedActions
          gameId={game.id}
          confirmedAt={game.confirmedAt!}
          canSchedule={canSchedule}
          drawn={drawn}
        />
      );
    case GAME_ACTION_VIEW.outsider:
      return status === GAME_STATUS.scheduled ? (
        <ClosedActions
          title={`일정이 ${formatDateTime(game.confirmedAt!)}로 확정되어 신청을 받지 않아요`}
        />
      ) : (
        <ClosedActions />
      );
    case GAME_ACTION_VIEW.ended:
      return <EndedActions gameId={game.id} confirmedAt={game.confirmedAt!} />;
    case GAME_ACTION_VIEW.endedOutsider:
      return <ClosedActions title="종료된 세션입니다" reviewsGameId={game.id} />;
    case GAME_ACTION_VIEW.endedGm:
      return (
        <EndedGmActions
          gameId={game.id}
          attendanceDue={isAttendanceDue({ game, confirmedCount })}
          attendanceConfirmed={!isNull(game.attendanceConfirmedAt)}
        />
      );
  }
}
