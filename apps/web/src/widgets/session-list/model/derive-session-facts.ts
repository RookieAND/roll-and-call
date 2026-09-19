import {
  countConfirmed,
  deriveSessionState,
  PARTICIPANT_STATUS,
  isDeadlineUrgent,
  SCHEDULE_MODE,
  scheduleLine,
  SESSION_STATE,
  type SessionRole,
} from "@/entities/game";
import { ddayKst, formatDateTime } from "@/shared/lib";

import { joinParts } from "./join-parts";
import { relativeDay } from "./relative-day";
import type { SessionContext, SessionGame } from "./session-card-model";

export type SessionFacts = ReturnType<typeof deriveSessionFacts>;

export function deriveSessionFacts(game: SessionGame, role: SessionRole, context: SessionContext) {
  const now = context.now ?? new Date();
  const confirmedCount = countConfirmed(game.participants);
  const state = deriveSessionState(
    {
      confirmedAt: game.confirmedAt,
      endDate: game.endDate,
      maxPlayers: game.maxPlayers,
      confirmedCount,
      scheduleMode: game.scheduleMode,
    },
    now,
  );
  const line = scheduleLine(game, now);
  const coordinate = game.scheduleMode === SCHEDULE_MODE.coordinate;
  // 조율형이 기한을 넘겼는데 확정자가 있고 세션 시각이 없으면 무산이 아니라 GM이 시간을 정할 차례다(deriveSessionState는 closed로 본다).
  const awaitingTime = coordinate && !game.confirmedAt && line.deadlinePassed && confirmedCount > 0;
  const past =
    (state === SESSION_STATE.closed && !awaitingTime) || state === SESSION_STATE.finished;
  const timeSet = Boolean(game.confirmedAt) && (!coordinate || line.confirmed);
  const startsAt = timeSet ? new Date(game.confirmedAt!).toISOString() : null;
  const sessionWhen = startsAt
    ? joinParts(formatDateTime(startsAt), relativeDay(ddayKst(startsAt, now)))
    : null;

  const waitingCount = game.participants.filter(
    (participant) => participant.status === PARTICIPANT_STATUS.waiting,
  ).length;

  return {
    state,
    line,
    waitingCount,
    coordinate,
    confirmedCount,
    awaitingTime,
    past,
    timeSet,
    sessionWhen,
    seats: `${confirmedCount}/${game.maxPlayers}`,
    scheduleHref: `/games/${game.id}/schedule`,
    sortKey: new Date(startsAt ?? game.endDate).getTime(),
    base: {
      id: game.id,
      title: game.title,
      round: game.round,
      role,
      startsAt,
      urgent: !context.readOnly && !past && !timeSet && isDeadlineUrgent(game.endDate, now),
    },
  };
}
