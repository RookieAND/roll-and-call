import { isNil } from "es-toolkit";

import { isAwaitingResult } from "./is-awaiting-result";
import { PARTICIPANT_STATUS, type ParticipantStatus } from "./participant-status";
import type { RecruitMethod } from "./recruit-method";
import { isSessionStarted } from "./session-timing";

type Moment = Date | string | null;

// 빈자리 알림(seat_opened)을 받을 사람: 세션 시작 전, 취소되지 않음, 추첨·선발 글이면 결과 뒤, 빈자리 1개 이상일 때 대기자 전원.
export function seatOpenedRecipientIds({
  game,
  participants,
  now = new Date(),
}: {
  game: {
    confirmedAt: Moment;
    cancelledAt: Moment;
    drawnAt: Moment;
    selectionFinishedAt: Moment;
    recruitMethod: RecruitMethod;
    maxPlayers: number;
  };
  participants: readonly { userId: string; status: ParticipantStatus }[];
  now?: Date;
}): string[] {
  if (isSessionStarted(game, now) || !isNil(game.cancelledAt)) return [];
  if (isAwaitingResult(game)) return [];
  const confirmedCount = participants.filter(
    (participant) => participant.status === PARTICIPANT_STATUS.confirmed,
  ).length;
  if (confirmedCount >= game.maxPlayers) return [];
  return participants
    .filter((participant) => participant.status === PARTICIPANT_STATUS.waiting)
    .map((participant) => participant.userId);
}
