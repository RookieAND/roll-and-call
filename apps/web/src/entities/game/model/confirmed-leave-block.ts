import { GAME_VISIBILITY, isApplicationClosed } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

import { RECRUIT_METHOD, type RecruitMethod } from "./recruit-method";
import type { ScheduleMode } from "./schedule-mode";

export const CONFIRMED_LEAVE_BLOCK = {
  schedule: "schedule",
  drawn: "drawn",
  selected: "selected",
  expired: "expired",
  full: "full",
} as const;
export type ConfirmedLeaveBlock =
  (typeof CONFIRMED_LEAVE_BLOCK)[keyof typeof CONFIRMED_LEAVE_BLOCK];

// 확정자가 스스로 취소하지 못하는 까닭(D259). 추첨 글은 정원 참을 보지 않는다(추첨 전 waiting은 대기자가 아니라 신청자다). 지정 모집은 지정한 사람이 정원을 채우고 대기를 받지 않아 정원 참이 늘 참이므로 이 규칙을 건너뛴다.
export function confirmedLeaveBlock({
  game,
  confirmedCount,
  waitingCount,
  now = new Date(),
}: {
  game: {
    scheduleMode: ScheduleMode;
    confirmedAt: Date | null;
    endDate: Date;
    drawnAt: Date | null;
    selectionFinishedAt: Date | null;
    recruitMethod: RecruitMethod;
    maxPlayers: number;
    visibility: (typeof GAME_VISIBILITY)[keyof typeof GAME_VISIBILITY];
  };
  confirmedCount: number;
  waitingCount: number;
  now?: Date;
}): ConfirmedLeaveBlock | null {
  if (isApplicationClosed(game, now)) return CONFIRMED_LEAVE_BLOCK.schedule;
  if (!isNil(game.drawnAt)) return CONFIRMED_LEAVE_BLOCK.drawn;
  if (!isNil(game.selectionFinishedAt)) return CONFIRMED_LEAVE_BLOCK.selected;
  if (game.endDate.getTime() <= now.getTime()) return CONFIRMED_LEAVE_BLOCK.expired;
  const isFirstCome = game.recruitMethod === RECRUIT_METHOD.firstCome;
  const isPrivate = game.visibility === GAME_VISIBILITY.private;
  if (isFirstCome && !isPrivate && confirmedCount >= game.maxPlayers && waitingCount === 0) {
    return CONFIRMED_LEAVE_BLOCK.full;
  }
  return null;
}
