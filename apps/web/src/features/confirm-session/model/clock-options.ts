import { range, uniq } from "es-toolkit";

import { padTwoDigits, type TimeRow } from "@/shared/lib";

const MINUTE_STEP = 5;
const HOURS_PER_DAY = 24;

type ClockOption = { value: string; label: string };

// 자정 뒤 시(24 이상)는 전날 열에 이어 붙은 시각이라 +1을 붙인다.
function hourOption(hour: number): ClockOption {
  const suffix = hour >= HOURS_PER_DAY ? " +1" : "";
  return { value: String(hour), label: `${hour % HOURS_PER_DAY}시${suffix}` };
}

// 시간대가 없으면(일시 지정) 0~23시 전부다. 이미 정한 시가 시간대 밖이면 그 값 하나를 더한다.
export function hourOptions({
  timeRows,
  selectedMinutes,
}: {
  timeRows?: TimeRow[];
  selectedMinutes: number;
}): ClockOption[] {
  if (!timeRows) return range(HOURS_PER_DAY).map(hourOption);
  const selectedHour = Math.floor(selectedMinutes / 60);
  const hours = uniq([
    ...timeRows.map((row) => row.dayOffset * HOURS_PER_DAY + row.hour),
    selectedHour,
  ]);
  return hours.toSorted((left, right) => left - right).map(hourOption);
}

// 5분 단위. 예전에 5분 단위가 아닌 분으로 정한 값도 그대로 고를 수 있게 끼워 둔다.
export function minuteOptions({ selectedMinutes }: { selectedMinutes: number }): ClockOption[] {
  const selectedMinute = selectedMinutes % 60;
  const minutes = uniq([...range(0, 60, MINUTE_STEP), selectedMinute]).toSorted(
    (left, right) => left - right,
  );
  return minutes.map((minute) => ({ value: String(minute), label: `${padTwoDigits(minute)}분` }));
}

export function withClock({
  minutes,
  hour,
  minute,
}: {
  minutes: number;
  hour?: number;
  minute?: number;
}): number {
  return (hour ?? Math.floor(minutes / 60)) * 60 + (minute ?? minutes % 60);
}
