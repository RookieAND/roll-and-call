import type { Game } from "@/shared/server";

import { SCHEDULE_MODE, type ScheduleMode } from "./schedule-mode";
import { sessionEndsAt } from "./session-end";

export const SESSION_STATE = {
  recruiting: "recruiting",
  scheduling: "scheduling",
  pendingConfirm: "pending_confirm",
  confirmed: "confirmed",
  closed: "closed",
  finished: "finished",
} as const;

export type SessionState = (typeof SESSION_STATE)[keyof typeof SESSION_STATE];

export const SESSION_ROLE = {
  host: "host",
  player: "player",
} as const;

export type SessionRole = (typeof SESSION_ROLE)[keyof typeof SESSION_ROLE];

// 일시 지정형은 등록 때부터 confirmedAt이 있으므로 그것만으로 확정이 아니다.
// ponytail: 정원 충족 후 scheduling/pending_confirm 은 scheduleMode로 근사한다
// (조율 진행률 availabilities 를 조회하지 않는 휴리스틱). 세밀화가 필요하면 그때 쿼리 추가.
export function deriveSessionState(
  {
    confirmedAt,
    playMinutes,
    endDate,
    maxPlayers,
    confirmedCount,
    scheduleMode,
  }: {
    confirmedAt: Game["confirmedAt"];
    playMinutes: Game["playMinutes"];
    endDate: Game["endDate"];
    maxPlayers: number;
    confirmedCount: number;
    scheduleMode: ScheduleMode;
  },
  now: Date = new Date(),
): SessionState {
  const nowTime = now.getTime();
  const deadlinePassed = new Date(endDate).getTime() < nowTime;
  if (confirmedAt) {
    // 시작이 아니라 플레이타임만큼 지나야 끝난 것이다. 진행 중인 세션은 아직 종료가 아니다.
    if (sessionEndsAt({ confirmedAt, playMinutes })!.getTime() < nowTime) {
      return SESSION_STATE.finished;
    }
    if (scheduleMode === SCHEDULE_MODE.fixed) {
      if (!deadlinePassed && confirmedCount < maxPlayers) return SESSION_STATE.recruiting;
      if (deadlinePassed && confirmedCount === 0) return SESSION_STATE.closed;
    }
    return SESSION_STATE.confirmed;
  }
  if (deadlinePassed) return SESSION_STATE.closed;
  if (confirmedCount < maxPlayers) return SESSION_STATE.recruiting;
  return scheduleMode === SCHEDULE_MODE.coordinate
    ? SESSION_STATE.scheduling
    : SESSION_STATE.pendingConfirm;
}
