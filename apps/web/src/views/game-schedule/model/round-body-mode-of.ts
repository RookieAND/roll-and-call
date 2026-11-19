import type { AwaitingResultMethod } from "@roll-and-call/database/games/model";
import { isNull } from "es-toolkit";

import { closedScheduleNotice } from "./closed-schedule-notice";
import { SCHEDULE_BODY_MODE, type ScheduleBodyMode } from "./schedule-body-mode";
import { SCHEDULE_NOTICE } from "./schedule-notices";

// 2회차부터의 가능 시간 화면. 추첨·선발 전 → 기간 밖 → 칠하기 → 보기만 순서로 고른다.
export function roundBodyModeOf({
  isOpen,
  canPaint,
  awaitingResult,
}: {
  // 가능 시간을 받는 기간 안이다.
  isOpen: boolean;
  canPaint: boolean;
  awaitingResult: AwaitingResultMethod | null;
}): ScheduleBodyMode {
  const awaitingNotice = closedScheduleNotice({ awaitingResult, unscheduled: false });
  if (!isNull(awaitingNotice)) return { kind: SCHEDULE_BODY_MODE.closed, notice: awaitingNotice };
  if (!isOpen) {
    return { kind: SCHEDULE_BODY_MODE.closed, notice: SCHEDULE_NOTICE.roundEnded };
  }
  if (canPaint) return { kind: SCHEDULE_BODY_MODE.paint, showDeadlineNotice: false };
  return { kind: SCHEDULE_BODY_MODE.closed, notice: SCHEDULE_NOTICE.roundParticipantsOnly };
}
