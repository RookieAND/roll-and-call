import type { AwaitingResultMethod } from "@roll-and-call/database/games/model";
import { isNull } from "es-toolkit";

import { closedScheduleNotice } from "./closed-schedule-notice";
import { SCHEDULE_BODY_MODE, type ScheduleBodyMode } from "./schedule-body-mode";

// 확정 → 아무도 못 칠함(추첨 전·확정자 없음) → 칠하기 → 보기만 순서로 고른다.
export function scheduleBodyModeOf({
  confirmedAt,
  canPaint,
  awaitingResult,
  unscheduled,
  isGm,
  isSignedIn,
  deadlinePassed,
}: {
  confirmedAt: Date | null;
  // GM 또는 확정 참여자. 대기자·추첨 전 신청자·내보낸 사람은 보기만 한다(R2).
  canPaint: boolean;
  awaitingResult: AwaitingResultMethod | null;
  // 모집 마감이 지났는데 확정 참여자가 없다.
  unscheduled: boolean;
  isGm: boolean;
  isSignedIn: boolean;
  deadlinePassed: boolean;
}): ScheduleBodyMode {
  if (!isNull(confirmedAt)) return { kind: SCHEDULE_BODY_MODE.confirmed, confirmedAt };
  const notice = closedScheduleNotice({ awaitingResult, unscheduled });
  if (!isNull(notice)) return { kind: SCHEDULE_BODY_MODE.closed, notice };
  if (canPaint) {
    return { kind: SCHEDULE_BODY_MODE.paint, showDeadlineNotice: !isGm && deadlinePassed };
  }
  return { kind: SCHEDULE_BODY_MODE.viewOnly, isSignedIn };
}
