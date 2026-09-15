import type { Game } from "@/shared/server";

import { SCHEDULE_MODE, type ScheduleMode } from "./schedule-mode";

// 조율형은 GM이 확정하는 순간 잠긴다. 일시 지정형의 confirmedAt은 등록 때부터 있는 세션 시각이라 그 시각이 지나야 잠긴다.
export function isSessionLocked({
  scheduleMode,
  confirmedAt,
  now = Date.now(),
}: {
  scheduleMode: ScheduleMode;
  confirmedAt: Game["confirmedAt"];
  now?: number;
}): boolean {
  if (!confirmedAt) return false;
  if (scheduleMode === SCHEDULE_MODE.coordinate) return true;
  return new Date(confirmedAt).getTime() <= now;
}
