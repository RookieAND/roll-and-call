"use client";

import { cn, Text } from "@roll-and-call/ui";
import { type ReactNode, useEffect, useRef } from "react";

import { DAY_START_HOUR, type DayColumn, slotIso, type TimeRow } from "@/shared/lib";

const TIME_COL_PX = 44;
const FIT_DAYS = 4;
const HEADER_PX = 40;
const GAP_PX = 4;
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

// 4일 이하는 폭을 나눠 갖고, 넘으면 열 폭(--rc-size-cell)을 고정해 가로로 민다. 시각 열·요일 줄은 붙어 있다.
export function SlotGrid({ days, timeRows, renderCell, className }: SlotGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fit = days.length <= FIT_DAYS;
  const dayColumnWidth = fit ? "minmax(0, 1fr)" : "var(--rc-size-cell)";

  // 숨은 탭 안에서는 높이가 0이라 스크롤이 먹지 않는다. 처음 크기가 생길 때 한 번 내린다.
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const rowsBefore = Math.max(0, (INITIAL_HOUR - DAY_START_HOUR) * 2);
    const observer = new ResizeObserver(() => {
      if (node.clientHeight === 0) return;
      node.scrollTo({ top: rowsBefore * (SLOT_ROW_PX + GAP_PX) });
      observer.disconnect();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={scrollRef}
      className="overflow-auto overscroll-contain rounded-500 border border-gray-200 bg-gray-50 px-125 pb-150"
      style={{ maxHeight: HEADER_PX + (SLOT_ROW_PX + GAP_PX) * VISIBLE_ROWS }}
    >
      <div
        className={cn("grid gap-050 select-none", fit && "min-w-full", className)}
        style={{
          gridTemplateColumns: `${TIME_COL_PX}px repeat(${days.length}, ${dayColumnWidth})`,
        }}
      >
        <span className="sticky top-0 left-0 z-20 bg-gray-50" />
        {days.map((day) => (
          <Text
            key={day.date}
            typography="body4"
            weight="bold"
            foreground="muted"
            render={<div />}
            className="sticky top-0 z-10 flex flex-col items-center justify-center bg-gray-50 leading-tight"
            style={{ height: HEADER_PX }}
          >
            {day.dow}
            <Text typography="body4" weight="medium" foreground="hint" numeric render={<span />}>
              {day.md}
            </Text>
          </Text>
        ))}

        {timeRows.map((row) => [
          <Text
            key={`${row.label}-t`}
            typography="body4"
            foreground="hint"
            numeric
            render={<span />}
            className="sticky left-0 z-10 -translate-y-1/2 bg-gray-50 leading-none"
            style={{ height: SLOT_ROW_PX }}
          >
            {row.minute === 0 ? row.label : ""}
          </Text>,
          ...days.map((day) => renderCell(slotIso(day.date, row.hour, row.minute))),
        ])}
      </div>
    </div>
  );
}
