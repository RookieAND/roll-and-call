import { isNil } from "es-toolkit";

import { isSessionStarted, plannedEndAt } from "./session-timing";

type Moment = Date | string | null;

// 화면 토스트 되돌리기는 6초다. 서버는 네트워크 지연을 감안해 30초까지 받는다(D302).
export const UNDO_END_SESSION_SECONDS = 30;

export const END_SESSION_BLOCK = {
  notGm: "notGm",
  cancelled: "cancelled",
  notStarted: "notStarted",
  alreadyEnded: "alreadyEnded",
  sessionOver: "sessionOver",
  noConfirmed: "noConfirmed",
} as const;

export type EndSessionBlock = (typeof END_SESSION_BLOCK)[keyof typeof END_SESSION_BLOCK];

export type EndSessionGame = {
  gmId: string;
  cancelledAt: Moment;
  confirmedAt: Moment;
  playMinutes: number | null;
  endedAt: Moment;
};

// 세션 마치기는 구인 GM만, 시작부터 예정 종료 전까지, 확정 참여자가 있을 때만 된다(D215).
export function endSessionBlock({
  game,
  actorId,
  confirmedCount,
  now,
}: {
  game: EndSessionGame;
  actorId: string;
  confirmedCount: number;
  now: Date;
}): EndSessionBlock | null {
  if (game.gmId !== actorId) return END_SESSION_BLOCK.notGm;
  if (!isNil(game.cancelledAt)) return END_SESSION_BLOCK.cancelled;
  if (!isSessionStarted(game, now)) return END_SESSION_BLOCK.notStarted;
  if (!isNil(game.endedAt)) return END_SESSION_BLOCK.alreadyEnded;
  const plannedEnd = plannedEndAt(game);
  if (isNil(plannedEnd) || plannedEnd.getTime() <= now.getTime()) {
    return END_SESSION_BLOCK.sessionOver;
  }
  if (confirmedCount === 0) return END_SESSION_BLOCK.noConfirmed;
  return null;
}
