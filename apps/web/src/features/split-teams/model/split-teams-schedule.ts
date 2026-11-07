import { DEFAULT_WINDOW, SCHEDULE_MODE, type ScheduleMode } from "@/entities/game";
import { toKstDateInput } from "@/shared/lib";

import { isSplitRangeValid } from "./is-split-range-valid";
import type { SplitTeamsScheduleInput } from "./split-teams-input";
import { SPLIT_TEAMS_MESSAGE } from "./split-teams-rules";

export interface SplitTeamsScheduleColumns {
  scheduleMode: ScheduleMode;
  rangeStart: string | null;
  rangeEnd: string | null;
  windowStartHour: number;
  windowEndHour: number;
  confirmedAt: Date | null;
}

// 원 구인의 일정 방식을 따르지 않고 GM이 고른 대로 새 구인 일정 칼럼을 만든다. 고를 수 있는 날은 오늘부터다.
export function splitTeamsSchedule(
  input: SplitTeamsScheduleInput,
  now: Date = new Date(),
): { columns: SplitTeamsScheduleColumns } | { error: string } {
  if (input.scheduleMode === SCHEDULE_MODE.fixed) {
    const startsAt = new Date(input.startsAt);
    if (startsAt.getTime() <= now.getTime()) return { error: SPLIT_TEAMS_MESSAGE.startsAt };
    return {
      columns: {
        scheduleMode: SCHEDULE_MODE.fixed,
        rangeStart: null,
        rangeEnd: null,
        windowStartHour: DEFAULT_WINDOW.startHour,
        windowEndHour: DEFAULT_WINDOW.endHour,
        confirmedAt: startsAt,
      },
    };
  }
  const { rangeStart, rangeEnd, windowStartHour, windowEndHour } = input;
  if (!isSplitRangeValid({ today: toKstDateInput(now), rangeStart, rangeEnd })) {
    return { error: SPLIT_TEAMS_MESSAGE.range };
  }
  if (windowStartHour === windowEndHour) return { error: SPLIT_TEAMS_MESSAGE.window };
  return {
    columns: {
      scheduleMode: SCHEDULE_MODE.coordinate,
      rangeStart,
      rangeEnd,
      windowStartHour,
      windowEndHour,
      confirmedAt: null,
    },
  };
}
