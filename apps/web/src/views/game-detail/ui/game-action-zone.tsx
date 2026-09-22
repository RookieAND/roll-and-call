import {
  GAME_STATUS,
  type GameStatus,
  isSessionLocked,
  PARTICIPANT_STATUS,
  type ParticipantStatus,
  RECRUIT_METHOD,
} from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

import { deriveActionView, GAME_ACTION_VIEW } from "../model/derive-action-view";
import { AnonActions } from "./anon-actions";
import { ClosedActions } from "./closed-actions";
import { ConfirmedActions } from "./confirmed-actions";
import { JoinableActions } from "./joinable-actions";
import { JoinedActions } from "./joined-actions";
import { ManageGameLink } from "./manage-game-link";
import { WaitingActions } from "./waiting-actions";

export interface GameActionZoneProps {
  game: GameDetailData;
  viewerId: string | null;
  isGm: boolean;
  viewerStatus: ParticipantStatus | null;
  waitlistRank: number | null;
  waitingCount: number;
  status: GameStatus;
  canSchedule: boolean;
}

export function GameActionZone({
  game,
  viewerId,
  isGm,
  viewerStatus,
  waitlistRank,
  waitingCount,
  status,
  canSchedule,
}: GameActionZoneProps) {
  // 기한 경과, 또는 대기 신청을 끈 게임의 정원 충족(full). 대기 받는 정원 충족(confirmed)은 마감이 아니다.
  const isClosed = status === GAME_STATUS.closed || status === GAME_STATUS.full;
  const sessionConfirmed = isSessionLocked(game);
  const actionView = deriveActionView({
    // 일시 지정형은 등록 때부터 confirmedAt이 있지만 모집 중이면 참여하기를 보여야 한다.
    sessionConfirmed,
    isGm,
    isWaiting: viewerStatus === PARTICIPANT_STATUS.waiting,
    isClosed,
    isSignedIn: Boolean(viewerId),
    viewerConfirmed: viewerStatus === PARTICIPANT_STATUS.confirmed,
  });

  // 정원 충족이어도 신청은 받는다(초과분은 대기).
  const isFull = status === GAME_STATUS.confirmed;
  const expired = status === GAME_STATUS.closed;
  const isLottery = game.recruitMethod === RECRUIT_METHOD.lottery;
  const drawn = game.drawnAt !== null;
  // leaveGame과 같은 규칙: 확정자는 정원 충족·기한 경과 후 자가 취소 불가.
  const canLeave = !isFull && !isClosed;

  switch (actionView) {
    // GM에게도 상세는 읽는 화면이다. 시간 확정 · 참여자 관리 · 세션 준비는 운영 관리 한 곳으로 보낸다.
    case GAME_ACTION_VIEW.gm:
      return <ManageGameLink gameId={game.id} />;
    case GAME_ACTION_VIEW.confirmed:
      return (
        <ConfirmedActions
          gameId={game.id}
          confirmedAt={game.confirmedAt!}
          canSchedule={canSchedule}
          drawn={drawn}
        />
      );
    case GAME_ACTION_VIEW.waiting:
      return (
        <WaitingActions
          gameId={game.id}
          waitlistRank={waitlistRank}
          isLottery={isLottery}
          drawn={drawn}
          endDate={game.endDate}
          expired={expired}
        />
      );
    case GAME_ACTION_VIEW.joined:
      return (
        <JoinedActions
          gameId={game.id}
          canSchedule={canSchedule}
          canLeave={canLeave}
          expired={expired}
          drawn={drawn}
        />
      );
    case GAME_ACTION_VIEW.closed:
      return <ClosedActions />;
    case GAME_ACTION_VIEW.anon:
      return <AnonActions isLottery={isLottery} />;
    case GAME_ACTION_VIEW.joinable:
      return (
        <JoinableActions
          gameId={game.id}
          isFull={isFull}
          isLottery={isLottery}
          waitingCount={waitingCount}
          endDate={game.endDate}
        />
      );
  }
}
