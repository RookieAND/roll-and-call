import {
  countConfirmed,
  deriveSessionState,
  isAttendanceDue,
  PARTICIPANT_STATUS,
  RECRUIT_METHOD,
  SCHEDULE_MODE,
  scheduleLine,
  SESSION_STATE,
  type SessionRole,
} from "@/entities/game";
import { ddayKst, formatDateTime } from "@/shared/lib";

import { relativeDay } from "./relative-day";
import type { SessionContext, SessionGame } from "./session-card-model";

export type SessionFacts = ReturnType<typeof deriveSessionFacts>;

export function deriveSessionFacts(game: SessionGame, role: SessionRole, context: SessionContext) {
  const now = context.now ?? new Date();
  const confirmedCount = countConfirmed(game.participants);
  const state = deriveSessionState(
    {
      confirmedAt: game.confirmedAt,
      playMinutes: game.playMinutes,
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
  const waitingCount = game.participants.filter(
    (participant) => participant.status === PARTICIPANT_STATUS.waiting,
  ).length;
  // 추첨은 마감 뒤에 뽑는다. 확정자가 없어도 뽑기 전이면 무산이 아니라 GM이 뽑을 차례다.
  const drawPending =
    game.recruitMethod === RECRUIT_METHOD.lottery &&
    game.drawnAt === null &&
    line.deadlinePassed &&
    waitingCount > 0;
  const past =
    (state === SESSION_STATE.closed && !awaitingTime && !drawPending) ||
    state === SESSION_STATE.finished;
  const timeSet = Boolean(game.confirmedAt) && (!coordinate || line.confirmed);
  const startsAt = timeSet ? new Date(game.confirmedAt!).toISOString() : null;
  const sessionWhen = startsAt ? formatDateTime(startsAt) : null;
  const sessionAgo = startsAt ? relativeDay(ddayKst(startsAt, now)) : null;

  const attendanceDue = isAttendanceDue(game, confirmedCount, now);
  // 확정 전에는 아무것도 기록되지 않았으므로 불참도 아직 없다.
  const viewerAbsent =
    game.attendanceConfirmedAt !== null &&
    game.participants.some(
      (participant) => participant.userId === context.viewerId && participant.absent,
    );

  return {
    state,
    line,
    waitingCount,
    attendanceDue,
    viewerAbsent,
    coordinate,
    confirmedCount,
    awaitingTime,
    drawPending,
    past,
    timeSet,
    sessionWhen,
    sessionAgo,
    seats: `${confirmedCount}/${game.maxPlayers}`,
    scheduleHref: `/games/${game.id}/schedule`,
    sortKey: new Date(startsAt ?? game.endDate).getTime(),
    base: {
      id: game.id,
      title: game.title,
      role,
      startsAt,
      deadlinePassed: line.deadlinePassed,
      urgent: false,
      titleDanger: false,
      waitlistRank: null,
    },
  };
}
