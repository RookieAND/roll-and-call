import { SCHEDULE_NOTICE } from "./schedule-notices";

// 아무도 칠할 수 없는 조율 화면의 안내. 칠할 수 있으면 null.
export function closedScheduleNotice({
  awaitingDraw,
  unscheduled,
}: {
  awaitingDraw: boolean;
  unscheduled: boolean;
}) {
  if (awaitingDraw) return SCHEDULE_NOTICE.awaitingDraw;
  if (unscheduled) return SCHEDULE_NOTICE.unscheduled;
  return null;
}
