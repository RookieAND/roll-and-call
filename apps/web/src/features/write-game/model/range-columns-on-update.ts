import { SCHEDULE_MODE, type ScheduleMode } from "@/entities/game";
import { coordinationRange } from "@/shared/lib";

// 일시 지정형에서 조율형으로 바꿀 때만 조율 기간을 새로 잡고, 이미 조율형이면 저장된 기간을 둔다.
export function rangeColumnsOnUpdate({
  previousMode,
  nextMode,
}: {
  previousMode: ScheduleMode;
  nextMode: ScheduleMode;
}) {
  if (nextMode === SCHEDULE_MODE.fixed) return { rangeStart: null, rangeEnd: null };
  return previousMode === SCHEDULE_MODE.fixed ? coordinationRange() : {};
}
