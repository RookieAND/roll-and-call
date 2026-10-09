import type { AwaitingResultMethod } from "@roll-and-call/database/games/model";

import { SCHEDULE_NOTICE } from "./schedule-notices";

// 아무도 칠할 수 없는 조율 화면의 안내. 칠할 수 있으면 null.
export function closedScheduleNotice({
  awaitingResult,
  unscheduled,
}: {
  awaitingResult: AwaitingResultMethod | null;
  unscheduled: boolean;
}) {
  if (awaitingResult === "lottery") return SCHEDULE_NOTICE.awaitingDraw;
  if (awaitingResult === "selection") return SCHEDULE_NOTICE.awaitingSelection;
  if (unscheduled) return SCHEDULE_NOTICE.unscheduled;
  return null;
}
