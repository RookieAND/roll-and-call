import { SCHEDULE_MODE, type ScheduleMode } from "./schedule-mode";

export function canCoordinate({
  scheduleMode,
}: {
  scheduleMode: ScheduleMode;
}): boolean {
  return scheduleMode === SCHEDULE_MODE.coordinate;
}
