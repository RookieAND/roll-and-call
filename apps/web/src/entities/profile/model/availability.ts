import { padTwoDigits, slotIso, type DayColumn, type TimeRow } from "@/shared/lib";
import type { AvailabilityInterval } from "@/shared/server";

// 월요일이 0. 화면도 저장도 이 순서를 그대로 쓴다.
export const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"] as const;

export const AVAILABILITY_MIN_HOUR = 0;
export const AVAILABILITY_MAX_HOUR = 24;

export type { AvailabilityInterval };

export type AvailabilityDay = { day: number; label: string; intervals: AvailabilityInterval[] };

export function formatHour(hour: number): string {
  return `${padTwoDigits(hour)}:00`;
}

export function formatInterval({ from, to }: AvailabilityInterval): string {
  return `${formatHour(from)} – ${formatHour(to)}`;
}

// 요일 하나가 한 줄. 구간이 여럿이면 그 줄 안에서 " · "로 잇는다.
export function groupByDay(intervals: readonly AvailabilityInterval[]): AvailabilityDay[] {
  return WEEKDAY_LABELS.map((label, day) => ({
    day,
    label,
    intervals: intervals
      .filter((interval) => interval.day === day)
      .toSorted((left, right) => left.from - right.from),
  }));
}

export function filledDays(intervals: readonly AvailabilityInterval[]): AvailabilityDay[] {
  return groupByDay(intervals).filter((entry) => entry.intervals.length > 0);
}

export function normalizeAvailability(input: unknown): AvailabilityInterval[] {
  if (!Array.isArray(input)) return [];
  const valid = input.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const { day, from, to } = raw as Record<string, unknown>;
    if (typeof day !== "number" || typeof from !== "number" || typeof to !== "number") return [];
    const hours = {
      day: Math.trunc(day),
      from: Math.trunc(from),
      to: Math.trunc(to),
    };
    if (hours.day < 0 || hours.day >= WEEKDAY_LABELS.length) return [];
    if (hours.from < AVAILABILITY_MIN_HOUR || hours.to > AVAILABILITY_MAX_HOUR) return [];
    if (hours.from >= hours.to) return [];
    return [hours];
  });

  return mergeOverlaps(valid);
}

// 같은 요일에서 겹치거나 맞닿은 구간은 하나로 합쳐 격자에 칠할 때 풀어낼 것이 없게 한다.
function mergeOverlaps(intervals: AvailabilityInterval[]): AvailabilityInterval[] {
  const sorted = intervals.toSorted(
    (left, right) => left.day - right.day || left.from - right.from,
  );
  const merged: AvailabilityInterval[] = [];
  for (const interval of sorted) {
    const last = merged.at(-1);
    if (last && last.day === interval.day && interval.from <= last.to) {
      last.to = Math.max(last.to, interval.to);
      continue;
    }
    merged.push({ ...interval });
  }
  return merged;
}

// 조율 격자에 미리 칠할 칸. 날짜 열의 요일을 프로필 요일과 맞춘다.
export function availabilityPrefill(
  intervals: readonly AvailabilityInterval[],
  days: DayColumn[],
  timeRows: TimeRow[],
): { keys: string[]; label: string } | null {
  if (intervals.length === 0) return null;
  const slots = new Set<string>();
  for (const day of days) {
    const index = WEEKDAY_LABELS.indexOf(day.dow as (typeof WEEKDAY_LABELS)[number]);
    if (index < 0) continue;
    for (const interval of intervals) {
      if (interval.day !== index) continue;
      for (const row of timeRows) {
        if (row.hour >= interval.from && row.hour < interval.to) {
          slots.add(slotIso(day.date, row.hour, row.minute));
        }
      }
    }
  }
  if (slots.size === 0) return null;
  return {
    keys: [...slots],
    label: filledDays(intervals)
      .map((entry) => entry.label)
      .join("·"),
  };
}
