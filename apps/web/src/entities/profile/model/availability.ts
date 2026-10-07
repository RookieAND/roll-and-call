import { isNumber, isPlainObject } from "es-toolkit";

import { padTwoDigits, WEEKDAY_LABELS } from "@/shared/lib";
import type { AvailabilityInterval } from "@/shared/server";

export const AVAILABILITY_MIN_HOUR = 0;
export const AVAILABILITY_MAX_HOUR = 24;

export type { AvailabilityInterval };

export function formatHour(hour: number): string {
  return `${padTwoDigits(hour)}:00`;
}

export function formatInterval({ from, to }: AvailabilityInterval): string {
  return `${formatHour(from)} – ${formatHour(to)}`;
}

export function normalizeAvailability(input: unknown): AvailabilityInterval[] {
  if (!Array.isArray(input)) return [];
  const valid = input.flatMap((raw) => {
    if (!isPlainObject(raw)) return [];
    const { day, from, to } = raw;
    if (!isNumber(day) || !isNumber(from) || !isNumber(to)) return [];
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
