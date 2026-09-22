"use client";

import { Card, cn, Text, VStack } from "@roll-and-call/ui";
import { type ReactNode, useEffect, useRef } from "react";

import { DAY_START_HOUR, type DayColumn, slotIso, type TimeRow } from "@/shared/lib";

const TIME_COL_PX = 44;
const DAY_COL_PX = 62;
const FIT_DAYS = 4;
const HEADER_PX = 40;
export const SLOT_ROW_PX = 26;
const VISIBLE_ROWS = 9;
const INITIAL_HOUR = 18;

interface SlotGridProps {
  days: DayColumn[];
  timeRows: TimeRow[];
  // slotKey는 칸 시작 시각(ISO). 반환 엘리먼트에 key를 달고 높이는 SLOT_ROW_PX로 맞춘다.
  renderCell: (slotKey: string) => ReactNode;
  className?: string;
}

export function SlotGrid({ days, timeRows, renderCell, className }: SlotGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fit = days.length <= FIT_DAYS;
  const dayColumnWidth = fit ? "minmax(0, 1fr)" : `${DAY_COL_PX}px`;

  useEffect(() => {
    const rowsBefore = Math.max(0, (INITIAL_HOUR - DAY_START_HOUR) * 2);
    scrollRef.current?.scrollTo({ top: rowsBefore * SLOT_ROW_PX });
  }, []);

  return (
    <Card
      ref={scrollRef}
      radius={500}
      background="none"
      padding="none"
      className="overflow-auto overscroll-contain"
      style={{ maxHeight: HEADER_PX + SLOT_ROW_PX * VISIBLE_ROWS }}
    >
      <div
        className={cn("grid select-none", fit && "min-w-full", className)}
        style={{
          gridTemplateColumns: `${TIME_COL_PX}px repeat(${days.length}, ${dayColumnWidth})`,
        }}
      >
        <span className="sticky top-0 left-0 z-20 border-b border-gray-200 bg-gray-50" />
        {days.map((day) => (
          <VStack
            key={day.date}
            align="center"
            justify="center"
            className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50"
            style={{ height: HEADER_PX }}
          >
            <Text typography="body5" foreground="hint" render={<span />} className="leading-none">
              {day.dow}
            </Text>
            <Text
              typography="body5"
              weight="bold"
              render={<span />}
              className="mt-025 leading-none"
            >
              {day.md}
            </Text>
          </VStack>
        ))}

        {timeRows.map((row) => [
          <Text
            key={`${row.label}-t`}
            typography="body5"
            weight="bold"
            foreground="hint"
            numeric
            render={<span />}
            className="sticky left-0 z-10 bg-surface pr-075 text-right leading-none"
            style={{ height: SLOT_ROW_PX }}
          >
            {row.minute === 0 ? row.label : ""}
          </Text>,
          ...days.map((day) => renderCell(slotIso(day.date, row.hour, row.minute))),
        ])}
      </div>
    </Card>
  );
}
