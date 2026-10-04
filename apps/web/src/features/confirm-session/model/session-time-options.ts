import { sortBy } from "es-toolkit";

import { padTwoDigits, type TimeRow } from "@/shared/lib";

import { DAY_MINUTES } from "./session-start";

type SessionTimeOption = { value: string; label: string; minutes: number };

// 시작 시각 선택지는 시간대 줄 전부다. 이미 정한 시각이 시간대 밖이면 그 값 하나를 더한다.
export function sessionTimeOptions({
  timeRows,
  selectedMinutes,
}: {
  timeRows: TimeRow[];
  selectedMinutes: number;
}): SessionTimeOption[] {
  const optionOf = (minutes: number): SessionTimeOption => {
    const minuteOfDay = minutes % DAY_MINUTES;
    const clock = `${padTwoDigits(Math.floor(minuteOfDay / 60))}:${padTwoDigits(minuteOfDay % 60)}`;
    return {
      value: String(minutes),
      label: minutes >= DAY_MINUTES ? `${clock} +1` : clock,
      minutes,
    };
  };
  const options = timeRows.map((row) =>
    optionOf(row.dayOffset * DAY_MINUTES + row.hour * 60 + row.minute),
  );
  if (options.some((option) => option.minutes === selectedMinutes)) return options;
  return sortBy([...options, optionOf(selectedMinutes)], ["minutes"]);
}
