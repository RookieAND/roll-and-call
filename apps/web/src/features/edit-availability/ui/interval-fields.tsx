"use client";

import { Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { AVAILABILITY_MAX_HOUR, AVAILABILITY_MIN_HOUR } from "@/entities/profile";

import type { DayIntervalRow } from "../model/day-interval-row";
import { HourSelect } from "./hour-select";

interface IntervalFieldsProps {
  label: string;
  row: DayIntervalRow;
  invalid?: boolean;
  onHourChange: (index: number, edge: "from" | "to", hour: number) => void;
  trailing: ReactNode;
}

export function IntervalFields({
  label,
  row,
  invalid = false,
  onHourChange,
  trailing,
}: IntervalFieldsProps) {
  return (
    <>
      <HourSelect
        label={`${label}요일 시작 시각`}
        value={row.interval.from}
        min={AVAILABILITY_MIN_HOUR}
        max={AVAILABILITY_MAX_HOUR - 1}
        invalid={invalid}
        onChange={(hour) => onHourChange(row.index, "from", hour)}
      />
      <Text typography="body3" foreground="hint" className="flex-none">
        ~
      </Text>
      <HourSelect
        label={`${label}요일 끝 시각`}
        value={row.interval.to}
        min={AVAILABILITY_MIN_HOUR + 1}
        max={AVAILABILITY_MAX_HOUR}
        invalid={invalid}
        onChange={(hour) => onHourChange(row.index, "to", hour)}
      />
      {trailing}
    </>
  );
}
