import {
  AVAILABILITY_MAX_HOUR,
  AVAILABILITY_MIN_HOUR,
  type AvailabilityInterval,
} from "@/entities/profile";

const DEFAULT_INTERVAL = { from: 19, to: 23 } as const;

export const HOUR_OPTIONS = Array.from(
  { length: AVAILABILITY_MAX_HOUR - AVAILABILITY_MIN_HOUR + 1 },
  (_, index) => AVAILABILITY_MIN_HOUR + index,
);

export function addInterval(
  intervals: AvailabilityInterval[],
  day: number,
): AvailabilityInterval[] {
  return [...intervals, { day, ...DEFAULT_INTERVAL }];
}

export function removeAt(intervals: AvailabilityInterval[], index: number): AvailabilityInterval[] {
  return intervals.filter((_, itemIndex) => itemIndex !== index);
}

export function removeDay(intervals: AvailabilityInterval[], day: number): AvailabilityInterval[] {
  return intervals.filter((interval) => interval.day !== day);
}

// 끝이 시작보다 빨라지면 붙여서 빈 구간이 저장되지 않게 한다.
export function setHour(
  intervals: AvailabilityInterval[],
  index: number,
  edge: "from" | "to",
  hour: number,
): AvailabilityInterval[] {
  return intervals.map((interval, itemIndex) => {
    if (itemIndex !== index) return interval;
    if (edge === "from") return { ...interval, from: hour, to: Math.max(interval.to, hour + 1) };
    return { ...interval, to: hour, from: Math.min(interval.from, hour - 1) };
  });
}
