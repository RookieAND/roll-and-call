import {
  GAME_STATUS,
  type GameStatus,
  isDeadlinePassed,
  isSessionLocked,
  PARTICIPANT_STATUS,
  type ParticipantStatus,
} from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

import { deriveActionView, GAME_ACTION_VIEW } from "../model/derive-action-view";
import { AnonActions } from "./anon-actions";
import { ClosedActions } from "./closed-actions";
import { ConfirmedActions } from "./confirmed-actions";
import { ConfirmedWaitingActions } from "./confirmed-waiting-actions";
import { GmConfirmActions } from "./gm-confirm-actions";
import { GmCoordinateActions } from "./gm-coordinate-actions";
import { GmFixedActions } from "./gm-fixed-actions";
import { JoinableActions } from "./joinable-actions";
import { JoinedActions } from "./joined-actions";
import { WaitingActions } from "./waiting-actions";

export type GameActionZoneProps = {
  game: GameDetailData;
  viewerId: string | null;
  isGm: boolean;
  viewerStatus: ParticipantStatus | null;
  waitlistRank: number | null;
  waitingCount: number;
  confirmedCount: number;
  respondedConfirmed: number;
  viewerResponded: boolean;
  status: GameStatus;
  canSchedule: boolean;
};

export function GameActionZone({
  game,
  viewerId,
  isGm,
  viewerStatus,
  waitlistRank,
  waitingCount,
  confirmedCount,
  respondedConfirmed,
  viewerResponded,
  status,
  canSchedule,
}: GameActionZoneProps) {
  // 기한 경과, 또는 대기 신청을 끈 게임의 정원 충족(full). 대기 받는 정원 충족(confirmed)은 마감이 아니다.
  const isClosed = status === GAME_STATUS.closed || status === GAME_STATUS.full;
  const actionView = deriveActionView({
    // 일시 지정형은 등록 때부터 confirmedAt이 있지만 모집 중이면 참여하기를 보여야 한다.
    sessionConfirmed: isSessionLocked(game),
    isGm,
    isCoordinate: canSchedule,
    deadlinePassed: isDeadlinePassed(game.endDate),
    isWaiting: viewerStatus === PARTICIPANT_STATUS.waiting,
    isClosed,
    isSignedIn: Boolean(viewerId),
    viewerConfirmed: viewerStatus === PARTICIPANT_STATUS.confirmed,
  });

  // 정원 충족이어도 신청은 받는다(초과분은 대기).
  const isFull = status === GAME_STATUS.confirmed;
  const expired = status === GAME_STATUS.closed;
  // leaveGame과 같은 규칙: 확정자는 정원 충족·기한 경과 후 자가 취소 불가.
  const canLeave = !isFull && !isClosed;

  switch (actionView) {
    case GAME_ACTION_VIEW.confirmed:
      return <ConfirmedActions confirmedAt={game.confirmedAt!} />;
    case GAME_ACTION_VIEW.confirmedWaiting:
      return (
        <ConfirmedWaitingActions
          gameId={game.id}
          confirmedAt={game.confirmedAt!}
          waitlistRank={waitlistRank}
          waitingCount={waitingCount}
        />
      );
    case GAME_ACTION_VIEW.gmCoordinate:
      return (
        <GmCoordinateActions
          gameId={game.id}
          respondedConfirmed={respondedConfirmed}
          confirmedCount={confirmedCount}
        />
      );
    case GAME_ACTION_VIEW.gmFixed:
      return <GmFixedActions gameId={game.id} />;
    case GAME_ACTION_VIEW.gmConfirm:
      return <GmConfirmActions gameId={game.id} />;
    case GAME_ACTION_VIEW.waiting:
      return <WaitingActions gameId={game.id} canSchedule={canSchedule} />;
    case GAME_ACTION_VIEW.joined:
      return (
        <JoinedActions
          gameId={game.id}
          canSchedule={canSchedule}
          canLeave={canLeave}
          expired={expired}
          viewerResponded={viewerResponded}
        />
      );
    case GAME_ACTION_VIEW.closed:
      return <ClosedActions endDate={game.endDate} expired={expired} />;
    case GAME_ACTION_VIEW.anon:
      return <AnonActions isFull={isFull} />;
    case GAME_ACTION_VIEW.joinable:
      return (
        <JoinableActions
          gameId={game.id}
          isFull={isFull}
          canSchedule={canSchedule}
          waitingCount={waitingCount}
        />
      );
  }
}
